// src/app/portal/[slug]/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import {
  createCustomerSession,
  clearCustomerSession,
  getCustomerSession,
} from "@/lib/customer-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

// ── Workshop ──────────────────────────────────────────────

export async function getWorkshopBySlug(slug: string) {
  return prisma.workshop.findUnique({
    where: { slug },
    select: { id: true, name: true, city: true, phone: true, slug: true },
  });
}

// ── Register ──────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export async function customerRegister(slug: string, formData: FormData) {
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) return { error: "Bengkel tidak ditemukan" };

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { error: "Data tidak valid" };

  const { name, email, password, phone } = parsed.data;

  // Cek apakah sudah ada akun di bengkel ini
  const existing = await prisma.customerAccount.findUnique({
    where: { email_workshopId: { email, workshopId: workshop.id } },
  });
  if (existing) return { error: "Email sudah terdaftar di bengkel ini" };

  const hashed = await bcrypt.hash(password, 12);

  // Cek apakah sudah ada data Customer dengan email/nama ini
  let customer = await prisma.customer.findFirst({
    where: { workshopId: workshop.id, email },
  });

  // Kalau belum ada, buat Customer baru
  if (!customer) {
    customer = await prisma.customer.create({
      data: { name, email, phone: phone ?? null, workshopId: workshop.id },
    });
  }

  const account = await prisma.customerAccount.create({
    data: {
      email,
      password: hashed,
      workshopId: workshop.id,
      customerId: customer.id,
    },
  });

  await createCustomerSession({
    customerAccountId: account.id,
    customerId: customer.id,
    workshopId: workshop.id,
    name: customer.name,
    email,
  });

  redirect(`/portal/${slug}/dashboard`);
}

// ── Login ─────────────────────────────────────────────────

export async function customerLogin(slug: string, formData: FormData) {
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) return { error: "Bengkel tidak ditemukan" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const account = await prisma.customerAccount.findUnique({
    where: { email_workshopId: { email, workshopId: workshop.id } },
    include: { customer: true },
  });

  if (!account) return { error: "Email atau password salah" };

  const valid = await bcrypt.compare(password, account.password);
  if (!valid) return { error: "Email atau password salah" };

  await createCustomerSession({
    customerAccountId: account.id,
    customerId: account.customerId,
    workshopId: workshop.id,
    name: account.customer.name,
    email: account.email,
  });

  redirect(`/portal/${slug}/dashboard`);
}

// ── Logout ────────────────────────────────────────────────

export async function customerLogout(slug: string) {
  await clearCustomerSession();
  redirect(`/portal/${slug}`);
}

// ── Customer data ─────────────────────────────────────────

export async function getMyServices() {
  const session = await getCustomerSession();
  if (!session) redirect("/");

  return prisma.service.findMany({
    where: {
      workshopId: session.workshopId,
      vehicle: { customerId: session.customerId },
    },
    include: {
      vehicle: true,
      serviceItems: true,
      invoice: {
        include: { payments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyInvoices() {
  const session = await getCustomerSession();
  if (!session) redirect("/");

  return prisma.invoice.findMany({
    where: {
      workshopId: session.workshopId,
      service: {
        vehicle: { customerId: session.customerId },
      },
    },
    include: {
      service: {
        include: { vehicle: true, serviceItems: true },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
