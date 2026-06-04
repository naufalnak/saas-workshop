// src/lib/inngest.ts
import { Inngest, eventType, staticSchema } from "inngest";

// ── Event definitions ─────────────────────────────────────
// Inngest v4 pakai eventType() + staticSchema() untuk typing.
// staticSchema() = type-safe di TypeScript, tanpa runtime validation.
// Setiap eventType di-export agar bisa dipakai langsung sebagai trigger
// di createFunction — jauh lebih type-safe dari pakai string literal.

export const orderConfirmedEvent = eventType("order/confirmed", {
  schema: staticSchema<{
    customerPhone: string;
    customerName: string;
    workshopName: string;
    orderNo: string;
    orderType: "BOOKING" | "WALK_IN";
    preferredDate?: string | null;
  }>(),
});

export const orderRejectedEvent = eventType("order/rejected", {
  schema: staticSchema<{
    customerPhone: string;
    customerName: string;
    workshopName: string;
    orderNo: string;
  }>(),
});

export const serviceCompletedEvent = eventType("service/completed", {
  schema: staticSchema<{
    customerPhone: string;
    customerName: string;
    workshopName: string;
    serviceNo: string;
    plateNumber: string;
    vehicleName: string;
    hasInvoice: boolean;
    invoiceId?: string;
  }>(),
});

export const invoiceCreatedEvent = eventType("invoice/created", {
  schema: staticSchema<{
    customerPhone: string;
    customerName: string;
    workshopName: string;
    invoiceNo: string;
    total: number;
    dueDate?: string | null;
    invoiceId: string;
  }>(),
});

// ── Client ────────────────────────────────────────────────
export const inngest = new Inngest({ id: "workshop-saas" });
