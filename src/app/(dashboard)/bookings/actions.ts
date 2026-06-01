// src/app/(dashboard)/bookings/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { OrderStatus, OrderType } from "@prisma/client";
import { generateServiceNo } from "@/lib/utils";
import { WA, getCustomerPhone } from "@/lib/whatsapp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function getOrders(
  status?: OrderStatus | "ALL",
  type?: OrderType | "ALL",
) {
  const workshopId = await getWorkshopId();
  const data = await prisma.order.findMany({
    where: {
      workshopId,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(type && type !== "ALL" ? { type } : {}),
    },
    include: {
      globalCustomer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      vehicle: true,
      service: { select: { id: true, serviceNo: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

export async function confirmOrder(orderId: string) {
  const workshopId = await getWorkshopId();

  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: {
      globalCustomer: true,
      workshop: { select: { name: true } },
    },
  });
  if (!order) throw new Error("Order tidak ditemukan");

  // ── Resolve customer ──────────────────────────────────────
  // Kasus 1: Order dari GlobalCustomer (daftar via portal publik)
  // Kasus 2: Order guest/walk-in (pakai guestName & guestPhone)
  let customer;

  if (order.globalCustomerId && order.globalCustomer) {
    // Cari customer yang sudah ada di workshop ini berdasarkan email
    customer = await prisma.customer.findFirst({
      where: { workshopId, email: order.globalCustomer.email },
    });

    // Belum ada → buat baru dari data GlobalCustomer
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: order.globalCustomer.name,
          email: order.globalCustomer.email,
          phone: order.globalCustomer.phone ?? null,
          workshopId,
        },
      });
    }
  } else if (order.guestName) {
    // Guest/walk-in — buat customer baru dari data guest di order
    customer = await prisma.customer.create({
      data: {
        name: order.guestName,
        phone: order.guestPhone ?? null,
        workshopId,
      },
    });
  } else {
    // Tidak ada data customer sama sekali — jangan lanjut
    throw new Error("Data customer tidak ditemukan di order ini");
  }

  // ── Resolve vehicle ───────────────────────────────────────
  let vehicleId = order.vehicleId;
  if (!vehicleId) {
    const placeholder = await prisma.vehicle.create({
      data: {
        plateNumber: "UNKNOWN",
        brand: "Belum diketahui",
        model: "Belum diketahui",
        customerId: customer.id,
        workshopId,
      },
    });
    vehicleId = placeholder.id;
  }

  // ── Buat service & update order dalam transaksi ───────────
  const service = await prisma.$transaction(async (tx) => {
    const svc = await tx.service.create({
      data: {
        serviceNo: generateServiceNo(),
        complaint: order.complaint,
        notes: order.notes,
        status: "PENDING",
        vehicleId,
        workshopId,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED", serviceId: svc.id },
    });

    return svc;
  });

  // ── Kirim notifikasi WA ───────────────────────────────────
  const phone = await getCustomerPhone(
    order.globalCustomerId,
    customer.id,
    prisma,
  );

  const customerName =
    order.globalCustomer?.name ?? order.guestName ?? customer.name;

  if (phone) {
    WA.bookingConfirmed({
      customerPhone: phone,
      customerName,
      workshopName: order.workshop.name,
      orderNo: order.orderNo,
      orderType: order.type,
      preferredDate: order.preferredDate,
      appUrl: APP_URL,
    }).catch((err) => console.error("[WA] bookingConfirmed error:", err));
  }

  revalidatePath("/bookings");
  revalidatePath("/services");
  return service.id;
}

export async function rejectOrder(orderId: string, reason: string) {
  const workshopId = await getWorkshopId();

  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: {
      globalCustomer: true,
      workshop: { select: { name: true } },
    },
  });
  if (!order) throw new Error("Order tidak ditemukan");

  await prisma.order.update({
    where: { id: orderId, workshopId },
    data: { status: "REJECTED" },
  });

  // ── Kirim notifikasi WA ───────────────────────────────────
  const phone = await getCustomerPhone(order.globalCustomerId, null, prisma);
  const customerName = order.globalCustomer?.name ?? order.guestName;

  if (phone && customerName) {
    WA.bookingRejected({
      customerPhone: phone,
      customerName,
      workshopName: order.workshop.name,
      orderNo: order.orderNo,
      appUrl: APP_URL,
    }).catch((err) => console.error("[WA] bookingRejected error:", err));
  }

  revalidatePath("/bookings");
}

export async function markOrderInProgress(orderId: string) {
  const workshopId = await getWorkshopId();
  await prisma.order.update({
    where: { id: orderId, workshopId },
    data: { status: "IN_PROGRESS" },
  });
  revalidatePath("/bookings");
}
