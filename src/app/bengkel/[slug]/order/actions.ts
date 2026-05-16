// src/app/bengkel/[slug]/order/actions.ts
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

  // Cari atau buat Customer di workshop ini
  let customer = await prisma.customer.findFirst({
    where: {
      workshopId,
      customerAccount: {
        email: session.email,
      },
    },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: session.name,
        phone: session.phone ?? null,
        workshopId,
      },
    });
  }

  // Cari atau buat Vehicle kalau ada info kendaraan
  let vehicleId: string | undefined;
  if (plateNumber && vehicleBrand && vehicleModel) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { workshopId, plateNumber, customerId: customer.id },
    });

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
    } else {
      const newVehicle = await prisma.vehicle.create({
        data: {
          plateNumber,
          brand: vehicleBrand,
          model: vehicleModel,
          year: vehicleYear ?? null,
          customerId: customer.id,
          workshopId,
        },
      });
      vehicleId = newVehicle.id;
    }
  }

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
      vehicleId: vehicleId ?? null,
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

  console.log("SESSION ID:", session.id);
  console.log("ORDER ID:", id);

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

  console.log("ORDER FOUND:", order?.id ?? "NULL");
  return order;
}
