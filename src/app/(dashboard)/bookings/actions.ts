// src/app/(dashboard)/bookings/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { OrderStatus, OrderType } from "@prisma/client";
import { generateServiceNo } from "@/lib/utils";

export async function getOrders(
  status?: OrderStatus | "ALL",
  type?: OrderType | "ALL",
  page: number = 1,
) {
  const workshopId = await getWorkshopId();
  const { skip, take } = getPaginationParams(page);

  const where = {
    workshopId,
    ...(status && status !== "ALL" ? { status } : {}),
    ...(type && type !== "ALL" ? { type } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        globalCustomer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        vehicle: true,
        service: { select: { id: true, serviceNo: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    meta: getPaginationMeta(total, page, take),
  };
}

// ... sisa fungsi tidak berubah
export async function confirmOrder(orderId: string) {
  const workshopId = await getWorkshopId();
  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
  });
  if (!order) throw new Error("Order tidak ditemukan");

  let customer = await prisma.customer.findFirst({
    where: { workshopId, name: order.guestName ?? undefined },
  });

  if (!customer && order.globalCustomerId) {
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

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      serviceId: service.id,
    },
  });

  revalidatePath("/bookings");
  revalidatePath("/services");
  return service.id;
}

export async function rejectOrder(orderId: string, reason: string) {
  const workshopId = await getWorkshopId();
  await prisma.order.update({
    where: { id: orderId, workshopId },
    data: { status: "REJECTED" },
  });
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
