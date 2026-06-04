// src/services/order.service.ts (updated untuk Inngest v4)
import { prisma } from "@/lib/prisma";
import {
  inngest,
  orderConfirmedEvent,
  orderRejectedEvent,
} from "@/lib/inngest";
import { generateServiceNo } from "@/lib/utils";
import { getCustomerPhone } from "@/lib/whatsapp";
import type { PrismaClient } from "@prisma/client";

async function resolveCustomer(
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  order: {
    globalCustomerId: string | null;
    globalCustomer: {
      name: string;
      email: string;
      phone: string | null;
    } | null;
    guestName: string | null;
    guestPhone: string | null;
  },
  workshopId: string,
) {
  if (order.globalCustomerId && order.globalCustomer) {
    const existing = await tx.customer.findFirst({
      where: { workshopId, email: order.globalCustomer.email },
    });
    if (existing) return existing;

    return tx.customer.create({
      data: {
        name: order.globalCustomer.name,
        email: order.globalCustomer.email,
        phone: order.globalCustomer.phone ?? null,
        workshopId,
      },
    });
  }

  if (order.guestName) {
    return tx.customer.create({
      data: {
        name: order.guestName,
        phone: order.guestPhone ?? null,
        workshopId,
      },
    });
  }

  throw new Error("Data customer tidak ditemukan di order ini");
}

async function resolveVehicle(
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  order: { vehicleId: string | null },
  customerId: string,
  workshopId: string,
) {
  if (order.vehicleId) return order.vehicleId;

  const placeholder = await tx.vehicle.create({
    data: {
      plateNumber: "UNKNOWN",
      brand: "Belum diketahui",
      model: "Belum diketahui",
      customerId,
      workshopId,
    },
  });
  return placeholder.id;
}

export async function confirmOrderService(orderId: string, workshopId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: { globalCustomer: true, workshop: { select: { name: true } } },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  const { service, customer } = await prisma.$transaction(async (tx) => {
    const resolvedCustomer = await resolveCustomer(tx, order, workshopId);
    const vehicleId = await resolveVehicle(
      tx,
      order,
      resolvedCustomer.id,
      workshopId,
    );

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

    return { service: svc, customer: resolvedCustomer };
  });

  // Kirim event ke Inngest — pakai orderConfirmedEvent.create() di v4
  const phone = await getCustomerPhone(
    order.globalCustomerId,
    customer.id,
    prisma,
  );
  const customerName =
    order.globalCustomer?.name ?? order.guestName ?? customer.name;

  if (phone) {
    await inngest.send(
      orderConfirmedEvent.create({
        customerPhone: phone,
        customerName,
        workshopName: order.workshop.name,
        orderNo: order.orderNo,
        orderType: order.type,
        preferredDate: order.preferredDate?.toISOString() ?? null,
      }),
    );
  }

  return { serviceId: service.id };
}

export async function rejectOrderService(
  orderId: string,
  workshopId: string,
  _reason: string,
) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: { globalCustomer: true, workshop: { select: { name: true } } },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  await prisma.order.update({
    where: { id: orderId, workshopId },
    data: { status: "REJECTED" },
  });

  const phone = await getCustomerPhone(order.globalCustomerId, null, prisma);
  const customerName = order.globalCustomer?.name ?? order.guestName;

  if (phone && customerName) {
    await inngest.send(
      orderRejectedEvent.create({
        customerPhone: phone,
        customerName,
        workshopName: order.workshop.name,
        orderNo: order.orderNo,
      }),
    );
  }
}
