// src/lib/email.ts
import { render } from "@react-email/render";
import { resend, FROM_EMAIL, APP_URL } from "@/lib/resend";
import { VerifyOperatorEmail } from "@/emails/verify-operator-email";
import { VerifyCustomerEmail } from "@/emails/verify-customer-email";
import { nanoid } from "nanoid";

// Generate token yang secure
export function generateVerifyToken(): { token: string; exp: Date } {
  const token = nanoid(32);
  const exp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam
  return { token, exp };
}

export async function sendOperatorVerificationEmail({
  email,
  name,
  workshopName,
  token,
}: {
  email: string;
  name: string;
  workshopName: string;
  token: string;
}) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}&type=operator`;

  const html = await render(
    VerifyOperatorEmail({ name, workshopName, verifyUrl }),
  );

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Verifikasi email bengkel ${workshopName} — BengkelKu`,
    html,
  });

  if (error) {
    console.error("Failed to send operator verification email:", error);
    throw new Error("Gagal mengirim email verifikasi");
  }
}

export async function sendCustomerVerificationEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}&type=customer`;

  const html = await render(VerifyCustomerEmail({ name, verifyUrl }));

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verifikasi email akun BengkelKu kamu",
    html,
  });

  if (error) {
    console.error("Failed to send customer verification email:", error);
    throw new Error("Gagal mengirim email verifikasi");
  }
}
