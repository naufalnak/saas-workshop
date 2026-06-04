// src/app/api/inngest/route.ts
//
// Satu route ini yang menjadi "server" untuk semua Inngest functions.
// Inngest cloud akan hit endpoint ini untuk menjalankan background jobs.
//
// Di development: jalankan `npx inngest-cli@latest dev` untuk local runner.

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import {
  sendBookingConfirmedNotif,
  sendBookingRejectedNotif,
  sendServiceCompletedNotif,
  sendInvoiceCreatedNotif,
} from "@/inngest/wa-notifications";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendBookingConfirmedNotif,
    sendBookingRejectedNotif,
    sendServiceCompletedNotif,
    sendInvoiceCreatedNotif,
  ],
});
