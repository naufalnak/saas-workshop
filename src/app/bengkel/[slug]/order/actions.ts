"use server";

import { prisma } from "@/lib/prisma";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { OrderType } from "@prisma/client";
import { generateOrderNo } from "@/lib/utils";

// ── schemas ───────────────────────────────────────────────
const orderSchema = z.object({
  complaint: z.string().min(5, "Keluhan minimal 5 karakter"),
  notes: z.string().optional(),
  preferredDate: z.string().optional(),
  plateNumber: z.string().optional(),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.coerce.number().optional(),
});

export async function createOrder(
  workshopId: string,
  type: OrderType,
  formData: FormData,
) {
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  const parsed = orderSchema.safeParse({
    complaint: formData.get("complaint"),
    notes: formData.get("notes") || undefined,
    preferredDate: formData.get("preferredDate") || undefined,
    plateNumber: formData.get("plateNumber") || undefined,
    vehicleBrand: formData.get("vehicleBrand") || undefined,
    vehicleModel: formData.get("vehicleModel") || undefined,
    vehicleYear: formData.get("vehicleYear") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const {
    complaint,
    notes,
    preferredDate,
    plateNumber,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
  } = parsed.data;

  const order = await prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      type,
      status: "PENDING",
      complaint,
      notes: notes ?? null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      workshopId,
      globalCustomerId: session.id,
      guestName: session.name,
      guestPhone: session.phone ?? null,
      // Info kendaraan disimpan sebagai notes tambahan jika ada,
      // vehicle akan di-assign oleh workshop dari dashboard
      vehicleId: null,
    },
  });

  redirect(`/akun/orders/${order.id}?success=1`);
}

export async function getMyOrders() {
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  return prisma.order.findMany({
    where: { globalCustomerId: session.id },
    include: {
      workshop: { select: { id: true, name: true, city: true, slug: true } },
      vehicle: true,
      service: {
        select: {
          id: true,
          serviceNo: true,
          status: true,
          invoice: {
            select: { id: true, total: true, status: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  const order = await prisma.order.findFirst({
    where: { id, globalCustomerId: session.id },
    include: {
      workshop: {
        select: {
          id: true,
          name: true,
          city: true,
          slug: true,
          phone: true,
          address: true,
        },
      },
      vehicle: true,
      service: {
        include: {
          serviceItems: true,
          invoice: {
            include: { payments: true },
          },
        },
      },
    },
  });

  return order;
}
