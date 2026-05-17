// src/app/(dashboard)/vehicles/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, "Nomor plat tidak valid"),
  brand: z.string().min(1, "Merek wajib diisi"),
  model: z.string().min(1, "Model wajib diisi"),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  color: z.string().optional(),
  engineCC: z.coerce.number().optional(),
  customerId: z.string().min(1, "Pilih pelanggan"),
});

export async function getVehicles(search?: string, page: number = 1) {
  const workshopId = await getWorkshopId();
  const { skip, take } = getPaginationParams(page);

  const where = {
    workshopId,
    ...(search
      ? {
          OR: [
            {
              plateNumber: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            { brand: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { model: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}),
  };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        _count: { select: { services: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return {
    data: vehicles,
    meta: getPaginationMeta(total, page, take),
  };
}

export async function getCustomersForSelect() {
  const workshopId = await getWorkshopId();
  return prisma.customer.findMany({
    where: { workshopId },
    select: { id: true, name: true, phone: true },
    orderBy: { name: "asc" },
  });
}

export async function createVehicle(formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = vehicleSchema.parse({
    plateNumber: formData.get("plateNumber"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year") || undefined,
    color: formData.get("color") || undefined,
    engineCC: formData.get("engineCC") || undefined,
    customerId: formData.get("customerId"),
  });

  await prisma.vehicle.create({ data: { ...data, workshopId } });
  revalidatePath("/vehicles");
}

export async function updateVehicle(id: string, formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = vehicleSchema.parse({
    plateNumber: formData.get("plateNumber"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year") || undefined,
    color: formData.get("color") || undefined,
    engineCC: formData.get("engineCC") || undefined,
    customerId: formData.get("customerId"),
  });

  await prisma.vehicle.update({ where: { id, workshopId }, data });
  revalidatePath("/vehicles");
}

export async function deleteVehicle(id: string) {
  const workshopId = await getWorkshopId();
  await prisma.vehicle.delete({ where: { id, workshopId } });
  revalidatePath("/vehicles");
}
