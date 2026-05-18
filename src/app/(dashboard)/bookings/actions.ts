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

  return { data }; // ← wrap dalam object
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

  // Handle customer
  let customer = await prisma.customer.findFirst({
    where: { workshopId },
  });

  if (order.globalCustomerId) {
    const gc = await prisma.globalCustomer.findUnique({
      where: { id: order.globalCustomerId },
    });

    customer = await prisma.customer.findFirst({
      where: { workshopId, email: gc?.email },
    });

    if (!customer && gc) {
      customer = await prisma.customer.create({
        data: {
          name: gc.name,
          email: gc.email,
          phone: gc.phone ?? null,
          workshopId,
        },
      });
    }
  }

  if (!customer) throw new Error("Customer tidak ditemukan");

  // Handle vehicle
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

  // Buat service order
  const service = await prisma.service.create({
    data: {
      serviceNo: generateServiceNo(),
      complaint: order.complaint,
      notes: order.notes,
      status: "PENDING",
      vehicleId,
      workshopId,
    },
  });

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CONFIRMED", serviceId: service.id },
  });

  // ── Kirim notifikasi WA ──────────────────────────────────
  const phone = await getCustomerPhone(
    order.globalCustomerId,
    customer.id,
    prisma,
  );

  if (phone && order.globalCustomer) {
    // Fire and forget — tidak perlu await
    WA.bookingConfirmed({
      customerPhone: phone,
      customerName: order.globalCustomer.name,
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

  // ── Kirim notifikasi WA ──────────────────────────────────
  const phone = await getCustomerPhone(order.globalCustomerId, null, prisma);

  if (phone && order.globalCustomer) {
    WA.bookingRejected({
      customerPhone: phone,
      customerName: order.globalCustomer.name,
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
