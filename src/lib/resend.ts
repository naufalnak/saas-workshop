// src/lib/resend.ts
import { Resend } from "resend";
import { env } from "@/env";

export const resend = new Resend(env.RESEND_API_KEY);
export const FROM_EMAIL = env.RESEND_FROM_EMAIL;
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
