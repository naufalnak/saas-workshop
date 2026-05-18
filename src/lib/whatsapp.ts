// src/lib/whatsapp.ts
import { env } from "@/env";
import type { PrismaClient } from "@prisma/client";

const FONNTE_URL = "https://api.fonnte.com/send";

// ── Core sender ───────────────────────────────────────────

async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  // Normalisasi nomor HP Indonesia
  const normalized = normalizePhone(phone);
  if (!normalized) {
    console.warn(`[WA] Invalid phone number: ${phone}`);
    return false;
  }

  try {
    const res = await fetch(FONNTE_URL, {
      method: "POST",
      headers: {
        Authorization: env.FONNTE_API_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: normalized,
        message,
        countryCode: "62",
      }),
    });

    const data = await res.json();

    if (!data.status) {
      console.error("[WA] Send failed:", data);
      return false;
    }

    console.log(`[WA] Message sent to ${normalized}`);
    return true;
  } catch (error) {
    console.error("[WA] Error sending message:", error);
    return false;
  }
}

// ── Phone normalizer ──────────────────────────────────────

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return null;

  if (digits.startsWith("0062")) return digits.slice(2); // 0062xx → 628xx
  if (digits.startsWith("628")) return digits; // 628xx → tetap
  if (digits.startsWith("08")) return "62" + digits.slice(1); // 08xx → 628xx
  if (digits.startsWith("8")) return "62" + digits; // 8xx → 628xx

  return null; // ← ganti dari `return digits` jadi null, nomor tidak dikenal lebih baik ditolak
}

// ── Message templates ─────────────────────────────────────

export const WA = {
  // Booking dikonfirmasi
  async bookingConfirmed({
    customerPhone,
    customerName,
    workshopName,
    orderNo,
    orderType,
    preferredDate,
    appUrl,
  }: {
    customerPhone: string;
    customerName: string;
    workshopName: string;
    orderNo: string;
    orderType: "BOOKING" | "WALK_IN";
    preferredDate?: Date | null;
    appUrl: string;
  }) {
    const typeLabel = orderType === "BOOKING" ? "Booking" : "Walk-in";
    const dateInfo = preferredDate
      ? `📅 Tanggal: ${formatDate(preferredDate)}\n`
      : "";

    const message = `✅ *Order Dikonfirmasi!*

Halo ${customerName}, order servis kamu telah dikonfirmasi oleh bengkel.

🏪 *Bengkel:* ${workshopName}
📋 *No. Order:* ${orderNo}
🔧 *Tipe:* ${typeLabel}
${dateInfo}
Silakan datang ke bengkel sesuai jadwal yang telah disepakati.

Pantau status servis kamu di:
${appUrl}/akun/orders

_BengkelKu — Platform Bengkel Kendaraan_`;

    return sendWhatsApp(customerPhone, message);
  },

  // Booking ditolak
  async bookingRejected({
    customerPhone,
    customerName,
    workshopName,
    orderNo,
    appUrl,
  }: {
    customerPhone: string;
    customerName: string;
    workshopName: string;
    orderNo: string;
    appUrl: string;
  }) {
    const message = `❌ *Order Tidak Dapat Diproses*

Halo ${customerName}, mohon maaf order servis kamu tidak dapat diproses saat ini.

🏪 *Bengkel:* ${workshopName}
📋 *No. Order:* ${orderNo}

Kamu bisa membuat order baru atau menghubungi bengkel langsung untuk informasi lebih lanjut.

Lihat detail di:
${appUrl}/akun/orders

_BengkelKu — Platform Bengkel Kendaraan_`;

    return sendWhatsApp(customerPhone, message);
  },

  // Servis selesai
  async serviceCompleted({
    customerPhone,
    customerName,
    workshopName,
    serviceNo,
    plateNumber,
    vehicleName,
    hasInvoice,
    invoiceId,
    appUrl,
  }: {
    customerPhone: string;
    customerName: string;
    workshopName: string;
    serviceNo: string;
    plateNumber: string;
    vehicleName: string;
    hasInvoice: boolean;
    invoiceId?: string;
    appUrl: string;
  }) {
    const invoiceInfo =
      hasInvoice && invoiceId
        ? `\n💳 Invoice tersedia di:\n${appUrl}/akun`
        : "";

    const message = `🎉 *Servis Selesai!*

Halo ${customerName}, kendaraan kamu sudah selesai diservis.

🏪 *Bengkel:* ${workshopName}
🔧 *No. Servis:* ${serviceNo}
🚗 *Kendaraan:* ${plateNumber} — ${vehicleName}
${invoiceInfo}

Silakan datang ke bengkel untuk mengambil kendaraan.

Lihat detail servis di:
${appUrl}/akun

_BengkelKu — Platform Bengkel Kendaraan_`;

    return sendWhatsApp(customerPhone, message);
  },

  // Invoice dibuat
  async invoiceCreated({
    customerPhone,
    customerName,
    workshopName,
    invoiceNo,
    total,
    dueDate,
    invoiceId,
    appUrl,
  }: {
    customerPhone: string;
    customerName: string;
    workshopName: string;
    invoiceNo: string;
    total: number;
    dueDate?: Date | null;
    invoiceId: string;
    appUrl: string;
  }) {
    const dueDateInfo = dueDate
      ? `📅 *Jatuh Tempo:* ${formatDate(dueDate)}\n`
      : "";

    const message = `🧾 *Invoice Tersedia*

Halo ${customerName}, invoice servis kendaraan kamu sudah siap.

🏪 *Bengkel:* ${workshopName}
📄 *No. Invoice:* ${invoiceNo}
💰 *Total:* ${formatCurrency(total)}
${dueDateInfo}
Lihat & simpan invoice kamu di:
${appUrl}/akun

_BengkelKu — Platform Bengkel Kendaraan_`;

    return sendWhatsApp(customerPhone, message);
  },
};

// ── Helpers ───────────────────────────────────────────────

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export async function getCustomerPhone(
  globalCustomerId: string | null,
  customerId: string | null,
  prisma: PrismaClient,
): Promise<string | null> {
  // Prioritas: GlobalCustomer phone → Customer phone
  if (globalCustomerId) {
    const gc = await prisma.globalCustomer.findUnique({
      where: { id: globalCustomerId },
      select: { phone: true },
    });
    if (gc?.phone) return gc.phone;
  }

  if (customerId) {
    const c = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { phone: true },
    });
    if (c?.phone) return c.phone;
  }

  return null;
}
