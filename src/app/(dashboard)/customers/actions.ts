// src/app/(dashboard)/customers/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { getPaginationParams, getPaginationMeta } from "@/lib/pagination";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
});

export async function getCustomers(search?: string, page: number = 1) {
  const workshopId = await getWorkshopId();
  const { skip, take } = getPaginationParams(page);

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where: {
        workshopId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
              ],
            }
          : {}),
      },
      include: { _count: { select: { vehicles: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.customer.count({
      where: {
        workshopId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    data: customers,
    meta: getPaginationMeta(total, page, take),
  };
}

export async function createCustomer(formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = customerSchema.parse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    address: formData.get("address") || undefined,
  });

  await prisma.customer.create({
    data: { ...data, workshopId, email: data.email || null },
  });

  revalidatePath("/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
  const workshopId = await getWorkshopId();
  const data = customerSchema.parse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    address: formData.get("address") || undefined,
  });

  await prisma.customer.update({
    where: { id, workshopId },
    data: { ...data, email: data.email || null },
  });

  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  const workshopId = await getWorkshopId();
  await prisma.customer.delete({ where: { id, workshopId } });
  revalidatePath("/customers");
}
