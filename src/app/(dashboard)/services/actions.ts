// src/app/(dashboard)/services/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { generateServiceNo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma, ServiceStatus } from "@prisma/client";

// ── helpers ──────────────────────────────────────────────

type WithServiceItems<T> = T & {
  serviceItems: {
    id: string;
    name: string;
    description: string | null;
    qty: number;
    unitPrice: Prisma.Decimal;
    total: Prisma.Decimal;
    serviceId: string;
    createdAt: Date;
  }[];
};

function serializeService<T extends WithServiceItems<object>>(service: T) {
  return {
    ...service,
    serviceItems: service.serviceItems.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
  };
}

// ── schemas ───────────────────────────────────────────────

const serviceSchema = z.object({
  vehicleId: z.string().min(1, "Pilih kendaraan"),
  complaint: z.string().min(3, "Keluhan wajib diisi"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  mechanicId: z.string().optional(),
});

const serviceItemSchema = z.object({
  name: z.string().min(1, "Nama item wajib diisi"),
  description: z.string().optional(),
  qty: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
});

// ── queries ───────────────────────────────────────────────

export async function getServices(status?: ServiceStatus | "ALL") {
  const workshopId = await getWorkshopId();
  const services = await prisma.service.findMany({
    where: {
      workshopId,
      ...(status && status !== "ALL" ? { status } : {}),
    },
    include: {
      vehicle: {
        include: { customer: { select: { name: true } } },
      },
      mechanic: { select: { id: true, name: true } },
      serviceItems: true,
      _count: { select: { serviceItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return services.map(serializeService);
}

export async function getServiceById(id: string) {
  const workshopId = await getWorkshopId();
  const service = await prisma.service.findFirst({
    where: { id, workshopId },
    include: {
      vehicle: { include: { customer: true } },
      mechanic: { select: { id: true, name: true } },
      serviceItems: { orderBy: { createdAt: "asc" } },
      invoice: true,
    },
  });

  if (!service) return null;
  return serializeService(service);
}

export async function getVehiclesForSelect() {
  const workshopId = await getWorkshopId();
  return prisma.vehicle.findMany({
    where: { workshopId },
    include: { customer: { select: { name: true } } },
    orderBy: { plateNumber: "asc" },
  });
}

export async function getMechanicsForSelect() {
  const workshopId = await getWorkshopId();
  return prisma.user.findMany({
    where: { workshopId },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

// ── mutations ─────────────────────────────────────────────

export async function createService(formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = serviceSchema.parse({
    vehicleId: formData.get("vehicleId"),
    complaint: formData.get("complaint"),
    diagnosis: formData.get("diagnosis") || undefined,
    notes: formData.get("notes") || undefined,
    mechanicId: formData.get("mechanicId") || undefined,
  });

  const service = await prisma.service.create({
    data: {
      ...data,
      mechanicId: data.mechanicId || null,
      serviceNo: generateServiceNo(),
      workshopId,
      status: "PENDING",
    },
  });

  revalidatePath("/services");
  return service.id;
}

export async function updateService(id: string, formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = serviceSchema.parse({
    vehicleId: formData.get("vehicleId"),
    complaint: formData.get("complaint"),
    diagnosis: formData.get("diagnosis") || undefined,
    notes: formData.get("notes") || undefined,
    mechanicId: formData.get("mechanicId") || undefined,
  });

  await prisma.service.update({
    where: { id, workshopId },
    data: { ...data, mechanicId: data.mechanicId || null },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${id}`);
}

export async function updateServiceStatus(id: string, status: ServiceStatus) {
  const workshopId = await getWorkshopId();
  await prisma.service.update({
    where: { id, workshopId },
    data: {
      status,
      ...(status === "DONE" ? { endDate: new Date() } : {}),
    },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${id}`);
}

export async function deleteService(id: string) {
  const workshopId = await getWorkshopId();

  // Hapus serviceItems dulu, baru hapus service
  await prisma.$transaction([
    prisma.serviceItem.deleteMany({ where: { serviceId: id } }),
    prisma.service.delete({ where: { id, workshopId } }),
  ]);

  revalidatePath("/services");
}

// ── service items ─────────────────────────────────────────

export async function addServiceItem(serviceId: string, formData: FormData) {
  const workshopId = await getWorkshopId();

  // Verify service belongs to this workshop
  const service = await prisma.service.findFirst({
    where: { id: serviceId, workshopId },
  });
  if (!service) throw new Error("Service tidak ditemukan");

  const data = serviceItemSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    qty: formData.get("qty"),
    unitPrice: formData.get("unitPrice"),
  });

  const total = data.qty * data.unitPrice;

  await prisma.serviceItem.create({
    data: { ...data, total, serviceId },
  });

  revalidatePath(`/services/${serviceId}`);
}

export async function deleteServiceItem(itemId: string, serviceId: string) {
  await prisma.serviceItem.delete({ where: { id: itemId } });
  revalidatePath(`/services/${serviceId}`);
}
