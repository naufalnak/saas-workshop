// src/app/(dashboard)/invoices/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";
import { generateInvoiceNo } from "@/lib/utils";
import { WA, getCustomerPhone } from "@/lib/whatsapp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
// ── helpers ───────────────────────────────────────────────

async function recalculateInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!invoice) return;

  const totalPaid = invoice.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );
  const total = Number(invoice.total);

  let status: InvoiceStatus = "UNPAID";
  if (totalPaid >= total) status = "PAID";
  else if (totalPaid > 0) status = "PARTIAL";

  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
}

// ── schemas ───────────────────────────────────────────────

const createInvoiceSchema = z.object({
  serviceId: z.string().min(1),
  tax: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  dueDate: z.string().optional(),
});

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, "Jumlah pembayaran wajib diisi"),
  method: z.enum(["CASH", "TRANSFER", "QRIS"]),
  referenceNo: z.string().optional(),
  notes: z.string().optional(),
});

// ── queries ───────────────────────────────────────────────

export async function getInvoices(
  status?: InvoiceStatus | "ALL",
  page: number = 1,
) {
  const workshopId = await getWorkshopId();
  const { skip, take } = getPaginationParams(page);

  const where = {
    workshopId,
    ...(status && status !== "ALL" ? { status } : {}),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        service: {
          include: {
            vehicle: {
              include: { customer: { select: { name: true, phone: true } } },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data: invoices,
    meta: getPaginationMeta(total, page, take),
  };
}

export async function getInvoiceById(id: string) {
  const workshopId = await getWorkshopId();
  return prisma.invoice.findFirst({
    where: { id, workshopId },
    include: {
      service: {
        include: {
          vehicle: {
            include: { customer: true },
          },
          serviceItems: true,
          mechanic: { select: { name: true } },
        },
      },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

export async function getServiceForInvoice(serviceId: string) {
  const workshopId = await getWorkshopId();
  return prisma.service.findFirst({
    where: { id: serviceId, workshopId },
    include: {
      vehicle: { include: { customer: true } },
      serviceItems: true,
      invoice: true,
    },
  });
}

export async function getWorkshopInfo() {
  const workshopId = await getWorkshopId();
  return prisma.workshop.findUnique({ where: { id: workshopId } });
}

// ── mutations ─────────────────────────────────────────────

export async function createInvoice(formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = createInvoiceSchema.parse({
    serviceId: formData.get("serviceId"),
    tax: formData.get("tax") || 0,
    discount: formData.get("discount") || 0,
    dueDate: formData.get("dueDate") || undefined,
  });

  const service = await prisma.service.findFirst({
    where: { id: data.serviceId, workshopId },
    include: {
      serviceItems: true,
      invoice: true,
      vehicle: {
        include: { customer: true },
      },
      order: {
        include: { globalCustomer: true },
      },
      workshop: { select: { name: true } },
    },
  });

  if (!service) throw new Error("Service tidak ditemukan");
  if (service.invoice) throw new Error("Invoice sudah dibuat");

  const subtotal = service.serviceItems.reduce(
    (sum, item) => sum + Number(item.total),
    0,
  );
  const total = Math.max(0, subtotal + data.tax - data.discount);

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNo: generateInvoiceNo(),
      subtotal,
      tax: data.tax,
      discount: data.discount,
      total,
      status: "UNPAID",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      workshopId,
      serviceId: data.serviceId,
    },
  });

  // ── Kirim notifikasi WA ──────────────────────────────────
  const phone = await getCustomerPhone(
    service.order?.globalCustomerId ?? null,
    service.vehicle.customerId,
    prisma,
  );

  const customerName =
    service.order?.globalCustomer?.name ?? service.vehicle.customer.name;

  if (phone) {
    WA.invoiceCreated({
      customerPhone: phone,
      customerName,
      workshopName: service.workshop.name,
      invoiceNo: invoice.invoiceNo,
      total,
      dueDate: invoice.dueDate,
      invoiceId: invoice.id,
      appUrl: APP_URL,
    }).catch((err) => console.error("[WA] invoiceCreated error:", err));
  }

  revalidatePath("/invoices");
  return invoice.id;
}

export async function addPayment(invoiceId: string, formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = paymentSchema.parse({
    amount: formData.get("amount"),
    method: formData.get("method"),
    referenceNo: formData.get("referenceNo") || undefined,
    notes: formData.get("notes") || undefined,
  });

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, workshopId },
  });
  if (!invoice) throw new Error("Invoice tidak ditemukan");

  await prisma.payment.create({
    data: {
      ...data,
      referenceNo: data.referenceNo || null,
      notes: data.notes || null,
      invoiceId,
      workshopId,
    },
  });

  await recalculateInvoiceStatus(invoiceId);
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}

export async function deletePayment(paymentId: string, invoiceId: string) {
  const workshopId = await getWorkshopId();

  // Verifikasi payment ini milik invoice yang ada di workshop ini
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      invoiceId,
      workshopId,
    },
  });

  if (!payment) throw new Error("Payment tidak ditemukan atau akses ditolak");

  await prisma.payment.delete({ where: { id: paymentId } });
  await recalculateInvoiceStatus(invoiceId);
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}
