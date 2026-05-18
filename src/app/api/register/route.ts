// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  generateVerifyToken,
  sendOperatorVerificationEmail,
} from "@/lib/email";

const schema = z.object({
  workshopName: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  city: z.string().optional(),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (await prisma.workshop.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await checkRateLimit(ip, "register");
  if (!success) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const { workshopName, name, email, password, phone, city } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const slug = await uniqueSlug(generateSlug(workshopName));
    const { token, exp } = generateVerifyToken();

    // Buat workshop + user dalam transaksi
    const result = await prisma.$transaction(async (tx) => {
      const workshop = await tx.workshop.create({
        data: { name: workshopName, phone, city, slug },
      });
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "OWNER",
          workshopId: workshop.id,
          emailVerified: false,
          verifyToken: token,
          verifyTokenExp: exp,
        },
      });
      return { workshop, user };
    });

    // Kirim email verifikasi
    await sendOperatorVerificationEmail({
      email,
      name,
      workshopName,
      token,
    });

    return NextResponse.json(
      {
        message: "Berhasil daftar. Cek email untuk verifikasi akun.",
        workshopId: result.workshop.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
