// src/app/verify-email/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Props {
  searchParams: Promise<{ token?: string; type?: string }>;
}

async function verifyToken(token: string, type: string) {
  const now = new Date();

  if (type === "operator") {
    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) return { status: "invalid" as const };
    if (user.emailVerified) return { status: "already" as const };
    if (user.verifyTokenExp && user.verifyTokenExp < now) {
      return {
        status: "expired" as const,
        email: user.email,
        type: "operator",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExp: null,
      },
    });

    return { status: "success" as const, type: "operator" };
  }

  if (type === "customer") {
    const customer = await prisma.globalCustomer.findFirst({
      where: { verifyToken: token },
    });

    if (!customer) return { status: "invalid" as const };
    if (customer.emailVerified) return { status: "already" as const };
    if (customer.verifyTokenExp && customer.verifyTokenExp < now) {
      return {
        status: "expired" as const,
        email: customer.email,
        type: "customer",
      };
    }

    await prisma.globalCustomer.update({
      where: { id: customer.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExp: null,
      },
    });

    return { status: "success" as const, type: "customer" };
  }

  return { status: "invalid" as const };
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, type } = await searchParams;

  if (!token || !type) redirect("/");

  const result = await verifyToken(token, type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {result.status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Terverifikasi! 🎉
            </h1>
            <p className="text-gray-500 mb-8">
              Akun kamu sudah aktif. Sekarang kamu bisa login dan mulai
              menggunakan BengkelHub.
            </p>
            <Link
              href={result.type === "operator" ? "/login" : "/masuk"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm">
              Login Sekarang →
            </Link>
          </>
        )}

        {result.status === "already" && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sudah Terverifikasi
            </h1>
            <p className="text-gray-500 mb-8">
              Email kamu sudah diverifikasi sebelumnya. Silakan login.
            </p>
            <Link
              href="/masuk"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm">
              Login →
            </Link>
          </>
        )}

        {result.status === "expired" && (
          <>
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link Kadaluarsa
            </h1>
            <p className="text-gray-500 mb-8">
              Link verifikasi sudah tidak berlaku (lebih dari 24 jam). Minta
              link verifikasi baru.
            </p>
            <Link
              href={`/check-email?type=${result.type}&email=${result.email}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm">
              Kirim Ulang Email
            </Link>
          </>
        )}

        {result.status === "invalid" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link Tidak Valid
            </h1>
            <p className="text-gray-500 mb-8">
              Link verifikasi tidak ditemukan atau sudah digunakan. Pastikan
              kamu membuka link yang benar dari email.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl transition text-sm hover:bg-gray-50">
              Kembali ke Beranda
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
