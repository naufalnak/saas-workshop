// src/app/(customer)/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import {
  createGlobalCustomerSession,
  clearGlobalCustomerSession,
} from "@/lib/global-customer-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import {
  generateVerifyToken,
  sendCustomerVerificationEmail,
  sendOperatorVerificationEmail,
} from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerCustomer(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.globalCustomer.findUnique({ where: { email } });
  if (existing) return { error: "Email sudah terdaftar" };

  const hashed = await bcrypt.hash(password, 12);
  const { token, exp } = generateVerifyToken();

  await prisma.globalCustomer.create({
    data: {
      name,
      email,
      password: hashed,
      phone: phone ?? null,
      emailVerified: false,
      verifyToken: token,
      verifyTokenExp: exp,
    },
  });

  await sendCustomerVerificationEmail({ email, name, token });

  redirect("/check-email?type=customer");
}

export async function loginCustomer(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "anonymous";
  const { success } = await checkRateLimit(ip, "login");
  if (!success) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Data tidak valid" };

  const { email, password } = parsed.data;

  const customer = await prisma.globalCustomer.findUnique({ where: { email } });
  if (!customer) return { error: "Email atau password salah" };

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) return { error: "Email atau password salah" };

  if (!customer.emailVerified) {
    return {
      error: "Email belum diverifikasi. Cek inbox atau spam kamu.",
      unverified: true,
      email: customer.email,
    };
  }

  await createGlobalCustomerSession({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  });

  redirect("/akun");
}

export async function logoutCustomer() {
  await clearGlobalCustomerSession();
  redirect("/masuk");
}

export async function resendVerificationEmail(
  email: string,
  type: "customer" | "operator",
) {
  const { token, exp } = generateVerifyToken();

  if (type === "customer") {
    const customer = await prisma.globalCustomer.findUnique({
      where: { email },
    });

    if (!customer || customer.emailVerified)
      return { error: "Akun tidak ditemukan atau sudah terverifikasi" };

    await prisma.globalCustomer.update({
      where: { email },
      data: { verifyToken: token, verifyTokenExp: exp },
    });

    await sendCustomerVerificationEmail({ email, name: customer.name, token });

    return { success: true };
  }

  if (type === "operator") {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified)
      return { error: "Akun tidak ditemukan atau sudah terverifikasi" };

    // Ambil nama workshop untuk subject email
    const workshop = await prisma.workshop.findUnique({
      where: { id: user.workshopId },
      select: { name: true },
    });

    await prisma.user.update({
      where: { email },
      data: { verifyToken: token, verifyTokenExp: exp },
    });

    await sendOperatorVerificationEmail({
      email,
      name: user.name,
      workshopName: workshop?.name ?? "Bengkel",
      token,
    });

    return { success: true };
  }

  return { error: "Tipe tidak valid" };
}
