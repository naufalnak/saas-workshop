// src/inngest/wa-notifications.ts
import {
  inngest,
  orderConfirmedEvent,
  orderRejectedEvent,
  serviceCompletedEvent,
  invoiceCreatedEvent,
} from "@/lib/inngest";
import { WA } from "@/lib/whatsapp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Order confirmed ───────────────────────────────────────

export const sendBookingConfirmedNotif = inngest.createFunction(
  {
    id: "send-booking-confirmed-wa",
    retries: 3,
    triggers: [{ event: orderConfirmedEvent }], // ← triggers array di dalam options
  },
  async ({ event }) => {
    const { data } = event;

    const sent = await WA.bookingConfirmed({
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      workshopName: data.workshopName,
      orderNo: data.orderNo,
      orderType: data.orderType,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      appUrl: APP_URL,
    });

    if (!sent) throw new Error(`WA delivery failed for order ${data.orderNo}`);
    return { sent: true, orderNo: data.orderNo };
  },
);

// ── Order rejected ────────────────────────────────────────

export const sendBookingRejectedNotif = inngest.createFunction(
  {
    id: "send-booking-rejected-wa",
    retries: 3,
    triggers: [{ event: orderRejectedEvent }],
  },
  async ({ event }) => {
    const { data } = event;

    const sent = await WA.bookingRejected({
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      workshopName: data.workshopName,
      orderNo: data.orderNo,
      appUrl: APP_URL,
    });

    if (!sent)
      throw new Error(`WA delivery failed for rejected order ${data.orderNo}`);
    return { sent: true, orderNo: data.orderNo };
  },
);

// ── Service completed ─────────────────────────────────────

export const sendServiceCompletedNotif = inngest.createFunction(
  {
    id: "send-service-completed-wa",
    retries: 3,
    triggers: [{ event: serviceCompletedEvent }],
  },
  async ({ event }) => {
    const { data } = event;

    const sent = await WA.serviceCompleted({
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      workshopName: data.workshopName,
      serviceNo: data.serviceNo,
      plateNumber: data.plateNumber,
      vehicleName: data.vehicleName,
      hasInvoice: data.hasInvoice,
      invoiceId: data.invoiceId,
      appUrl: APP_URL,
    });

    if (!sent)
      throw new Error(`WA delivery failed for service ${data.serviceNo}`);
    return { sent: true, serviceNo: data.serviceNo };
  },
);

// ── Invoice created ───────────────────────────────────────

export const sendInvoiceCreatedNotif = inngest.createFunction(
  {
    id: "send-invoice-created-wa",
    retries: 3,
    triggers: [{ event: invoiceCreatedEvent }],
  },
  async ({ event }) => {
    const { data } = event;

    const sent = await WA.invoiceCreated({
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      workshopName: data.workshopName,
      invoiceNo: data.invoiceNo,
      total: data.total,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      invoiceId: data.invoiceId,
      appUrl: APP_URL,
    });

    if (!sent)
      throw new Error(`WA delivery failed for invoice ${data.invoiceNo}`);
    return { sent: true, invoiceNo: data.invoiceNo };
  },
);
