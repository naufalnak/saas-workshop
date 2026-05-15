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

  const existing = await prisma.globalCustomer.findUnique({
    where: { email },
  });
  if (existing) return { error: "Email sudah terdaftar" };

  const hashed = await bcrypt.hash(password, 12);

  const customer = await prisma.globalCustomer.create({
    data: { name, email, password: hashed, phone: phone ?? null },
  });

  await createGlobalCustomerSession({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  });

  redirect("/akun");
}

export async function loginCustomer(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "Data tidak valid" };

  const { email, password } = parsed.data;

  const customer = await prisma.globalCustomer.findUnique({
    where: { email },
  });
  if (!customer) return { error: "Email atau password salah" };

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) return { error: "Email atau password salah" };

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
