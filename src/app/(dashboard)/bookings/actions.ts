// src/app/(dashboard)/bookings/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { OrderStatus, OrderType } from "@prisma/client";
import {
  confirmOrderService,
  rejectOrderService,
} from "@/services/order.service";

// ── Queries ───────────────────────────────────────────────

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

// ── Mutations ─────────────────────────────────────────────

export async function confirmOrder(orderId: string) {
  const workshopId = await getWorkshopId();

  // Business logic ada di service layer — action hanya orchestrate
  const { serviceId } = await confirmOrderService(orderId, workshopId);

  revalidatePath("/bookings");
  revalidatePath("/services");

  return serviceId;
}

export async function rejectOrder(orderId: string, reason: string) {
  const workshopId = await getWorkshopId();

  await rejectOrderService(orderId, workshopId, reason);

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
