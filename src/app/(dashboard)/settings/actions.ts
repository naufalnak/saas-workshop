// src/app/(dashboard)/settings/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const workshopSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  openHour: z.string().optional(),
  closeHour: z.string().optional(),
  specialties: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
});

export async function getWorkshopProfile() {
  const workshopId = await getWorkshopId();
  return prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { workshopServices: { orderBy: { createdAt: "asc" } } },
  });
}

export async function updateWorkshopProfile(formData: FormData) {
  const workshopId = await getWorkshopId();

  const specialtiesRaw = formData.get("specialties") as string;
  const specialties = specialtiesRaw
    ? specialtiesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const data = workshopSchema.parse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    description: formData.get("description") || undefined,
    openHour: formData.get("openHour") || undefined,
    closeHour: formData.get("closeHour") || undefined,
    isPublished: formData.get("isPublished") === "true",
  });

  await prisma.workshop.update({
    where: { id: workshopId },
    data: { ...data, specialties },
  });

  revalidatePath("/settings");
  revalidatePath("/bengkel");
}

export async function addWorkshopService(formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = serviceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    priceMin: formData.get("priceMin") || undefined,
    priceMax: formData.get("priceMax") || undefined,
    duration: formData.get("duration") || undefined,
  });

  await prisma.workshopService.create({
    data: { ...data, workshopId },
  });

  revalidatePath("/settings");
}

export async function deleteWorkshopService(id: string) {
  const workshopId = await getWorkshopId();
  await prisma.workshopService.deleteMany({
    where: { id, workshopId },
  });
  revalidatePath("/settings");
}
