// src/app/portal/[slug]/booking/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer-auth";
import { getWorkshopBySlug } from "../actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const bookingSchema = z.object({
  complaint: z.string().min(5, "Keluhan minimal 5 karakter"),
  notes: z.string().optional(),
  preferredDate: z.string().optional(),
  vehicleId: z.string().optional(),
});

export async function getMyVehicles() {
  const session = await getCustomerSession();
  if (!session) redirect("/");

  return prisma.vehicle.findMany({
    where: {
      workshopId: session.workshopId,
      customerId: session.customerId,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyBookings() {
  const session = await getCustomerSession();
  if (!session) redirect("/");

  return prisma.bookingRequest.findMany({
    where: {
      workshopId: session.workshopId,
      customerId: session.customerId,
    },
    include: {
      vehicle: true,
      service: { select: { id: true, serviceNo: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBooking(slug: string, formData: FormData) {
  const session = await getCustomerSession();
  if (!session) return { error: "Silakan login terlebih dahulu" };

  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) return { error: "Bengkel tidak ditemukan" };

  const parsed = bookingSchema.safeParse({
    complaint: formData.get("complaint"),
    notes: formData.get("notes") || undefined,
    preferredDate: formData.get("preferredDate") || undefined,
    vehicleId: formData.get("vehicleId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { complaint, notes, preferredDate, vehicleId } = parsed.data;

  await prisma.bookingRequest.create({
    data: {
      complaint,
      notes: notes || null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      vehicleId: vehicleId || null,
      customerId: session.customerId,
      workshopId: session.workshopId,
    },
  });

  revalidatePath(`/portal/${slug}/dashboard`);
  return { success: true };
}
