// src/app/(customer)/masuk/_components/masuk-form.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Wrench, Loader2 } from "lucide-react";
import { loginCustomer } from "../actions";

export function MasukForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/akun";
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginCustomer(formData);
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
          <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
          <p className="text-gray-500 text-sm mt-1">
            Akses semua bengkel dengan 1 akun
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
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="budi@email.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Belum punya akun?{" "}
            <Link
              href="/daftar"
              className="text-blue-600 hover:underline font-medium">
              Daftar gratis
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Kamu operator bengkel?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login operator di sini
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          <Link href="/" className="hover:text-gray-600 transition">
            ← Kembali ke halaman utama
          </Link>
        </p>
      </div>
    </div>
  );
}
