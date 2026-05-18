// src/app/(customer)/daftar/page.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import { Wrench, Loader2, ArrowRight } from "lucide-react";
import { registerCustomer } from "../actions";

export default function DaftarPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerCustomer(formData);
      if (result?.error) setError(result.error);
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">BengkelKu</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
          <p className="text-gray-500 text-sm mt-1">
            1 akun untuk semua bengkel
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className={labelClass}>
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                placeholder="Budi Santoso"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="budi@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>No. Telepon</label>
              <input
                name="phone"
                placeholder="08123456789"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Password <span className="text-red-500">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Minimal 6 karakter"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mendaftar...
                </>
              ) : (
                <>
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{" "}
            <Link
              href="/masuk"
              className="text-blue-600 hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-4 bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-700 text-center">
            Dengan mendaftar, kamu bisa booking servis ke bengkel manapun yang
            terdaftar di BengkelKu.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Kamu bengkel?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftarkan bengkel di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
