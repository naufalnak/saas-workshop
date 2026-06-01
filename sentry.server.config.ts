// This file configures the initialization of Sentry on the server.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://338766a01e45ee5ec92a994f72fb7fff@o4508296217886720.ingest.us.sentry.io/4511403712315392",

  // Production: sample 10% request untuk tracing
  // Development: sample semua supaya mudah debug
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  enableLogs: true,

  // Hati-hati: ini kirim data user (email, IP) ke Sentry
  // Pastikan sudah comply dengan privacy policy kamu
  sendDefaultPii: true,
});
