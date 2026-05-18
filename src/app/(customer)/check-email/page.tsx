// src/app/(customer)/check-email/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { resendVerificationEmail } from "../actions";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "customer";
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    if (!email) return;
    startTransition(async () => {
      await resendVerificationEmail(email, type as "customer" | "operator");
      setResent(true);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cek email kamu!
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Kami sudah mengirim link verifikasi ke{" "}
          {email ? (
            <strong className="text-gray-900">{email}</strong>
          ) : (
            "email kamu"
          )}
          . Klik link tersebut untuk mengaktifkan akun.
        </p>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Langkah selanjutnya:
          </p>
          {[
            "Buka inbox email kamu",
            "Cari email dari BengkelKu",
            'Klik tombol "Verifikasi Email"',
            "Login dan mulai gunakan BengkelKu",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-600">{step}</span>
            </div>
          ))}
        </div>

        {/* Resend */}
        {resent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-green-700">
              ✅ Email verifikasi sudah dikirim ulang. Cek inbox kamu.
            </p>
          </div>
        ) : email ? (
          <p className="text-sm text-gray-500 mb-4">
            Tidak ada email?{" "}
            <button
              onClick={handleResend}
              disabled={isPending}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50 inline-flex items-center gap-1">
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              Kirim ulang
            </button>
          </p>
        ) : null}

        <p className="text-xs text-gray-400 mb-6">
          Cek folder spam jika tidak ada di inbox. Link berlaku 24 jam.
        </p>

        <Link
          href={type === "operator" ? "/login" : "/masuk"}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke halaman login
        </Link>
      </div>
    </div>
  );
}
