// src/app/(dashboard)/bookings/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
import { generateServiceNo } from "@/lib/utils";

export async function getBookings(status?: BookingStatus | "ALL") {
  const workshopId = await getWorkshopId();
  return prisma.bookingRequest.findMany({
    where: {
      workshopId,
      ...(status && status !== "ALL" ? { status } : {}),
    },
    include: {
      customer: true,
      vehicle: true,
      service: { select: { id: true, serviceNo: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveBooking(bookingId: string, mechanicId?: string) {
  const workshopId = await getWorkshopId();

  const booking = await prisma.bookingRequest.findFirst({
    where: { id: bookingId, workshopId },
    include: { customer: true, vehicle: true },
  });

  if (!booking) throw new Error("Booking tidak ditemukan");
  if (booking.status !== "PENDING") throw new Error("Booking sudah diproses");

  // Kalau customer belum punya kendaraan, buat vehicle placeholder
  let vehicleId = booking.vehicleId;
  if (!vehicleId) {
    const placeholder = await prisma.vehicle.create({
      data: {
        plateNumber: "UNKNOWN",
        brand: "Belum diketahui",
        model: "Belum diketahui",
        customerId: booking.customerId,
        workshopId,
      },
    });
    vehicleId = placeholder.id;
  }

  // Buat service order otomatis
  const service = await prisma.service.create({
    data: {
      serviceNo: generateServiceNo(),
      complaint: booking.complaint,
      notes: booking.notes,
      status: "PENDING",
      vehicleId,
      workshopId,
      mechanicId: mechanicId || null,
      bookingRequestId: bookingId, // ← link langsung saat create
    },
  });

  // Update booking status + link ke service
  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "APPROVED" }, // ← hapus serviceId
  });

  revalidatePath("/bookings");
  revalidatePath("/services");
  return service.id;
}

export async function rejectBooking(bookingId: string, reason: string) {
  const workshopId = await getWorkshopId();

  await prisma.bookingRequest.update({
    where: { id: bookingId, workshopId },
    data: { status: "REJECTED", rejectReason: reason },
  });

  revalidatePath("/bookings");
}
