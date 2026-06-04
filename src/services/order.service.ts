// src/services/order.service.ts
//
// Business logic untuk Order/Booking.
// File ini TIDAK boleh import dari Next.js (revalidatePath, cookies, dll).
// Tugasnya murni: terima data → proses → kembalikan hasil.
// Server Actions hanya memanggil fungsi di sini, lalu handle side-effects (revalidate, redirect).

import { prisma } from "@/lib/prisma";
import { generateServiceNo } from "@/lib/utils";
import { WA, getCustomerPhone } from "@/lib/whatsapp";
import type { PrismaClient } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────

export type ConfirmOrderResult = {
  serviceId: string;
};

// ── Helpers (private) ─────────────────────────────────────

/**
 * Resolve atau buat Customer lokal di dalam workshop berdasarkan data order.
 * Urutan prioritas:
 *   1. GlobalCustomer (pelanggan terdaftar via portal publik) → cari by email, buat jika belum ada
 *   2. Guest order (guestName ada) → selalu buat customer baru
 */
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
    // Cari customer lokal berdasarkan email GlobalCustomer
    const existing = await tx.customer.findFirst({
      where: { workshopId, email: order.globalCustomer.email },
    });

    if (existing) return existing;

    // Belum ada → buat baru
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

/**
 * Resolve vehicleId dari order, atau buat placeholder jika belum ada.
 */
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

// ── Public functions ──────────────────────────────────────

/**
 * Konfirmasi order:
 *   1. Resolve / buat Customer lokal
 *   2. Resolve / buat Vehicle placeholder
 *   3. Buat Service + update Order status dalam satu transaksi
 *   4. Kirim notifikasi WA (fire-and-forget, error di-log tapi tidak block)
 */
export async function confirmOrderService(
  orderId: string,
  workshopId: string,
): Promise<ConfirmOrderResult> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: {
      globalCustomer: true,
      workshop: { select: { name: true } },
    },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  // Jalankan semua operasi DB dalam satu transaksi
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

  // WA notifikasi — di luar transaksi agar DB tidak tertahan
  const phone = await getCustomerPhone(
    order.globalCustomerId,
    customer.id,
    prisma,
  );
  const customerName =
    order.globalCustomer?.name ?? order.guestName ?? customer.name;

  if (phone) {
    WA.bookingConfirmed({
      customerPhone: phone,
      customerName,
      workshopName: order.workshop.name,
      orderNo: order.orderNo,
      orderType: order.type,
      preferredDate: order.preferredDate,
      appUrl: APP_URL,
    }).catch((err) => console.error("[WA] bookingConfirmed error:", err));
  }

  return { serviceId: service.id };
}

/**
 * Tolak order dan kirim notifikasi WA ke customer.
 */
export async function rejectOrderService(
  orderId: string,
  workshopId: string,
  _reason: string, // siap dipakai untuk audit log di masa depan
): Promise<void> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, workshopId },
    include: {
      globalCustomer: true,
      workshop: { select: { name: true } },
    },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  await prisma.order.update({
    where: { id: orderId, workshopId },
    data: { status: "REJECTED" },
  });

  const phone = await getCustomerPhone(order.globalCustomerId, null, prisma);
  const customerName = order.globalCustomer?.name ?? order.guestName;

  if (phone && customerName) {
    WA.bookingRejected({
      customerPhone: phone,
      customerName,
      workshopName: order.workshop.name,
      orderNo: order.orderNo,
      appUrl: APP_URL,
    }).catch((err) => console.error("[WA] bookingRejected error:", err));
  }
}
