"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Wrench, Loader2, ArrowRight } from "lucide-react";
import { registerCustomer } from "../actions";

export default function DaftarPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    "w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition";

  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top left, #1e3a6e 0%, #152d55 40%, #0f2040 100%)",
      }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Bengkel<span className="text-red-400">Ku</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Buat akun gratis
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Daftar sekali, booking ke semua bengkel
          </p>
        </div>

        {/* Card — WHITE */}
        <div
          className="bg-white rounded-2xl relative overflow-hidden"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
          }}>
          {/* Red accent top strip */}
          <div
            className="absolute top-0 left-8 right-8 h-0.5"
            style={{
              background:
                "linear-gradient(90deg, transparent, #dc2626, transparent)",
            }}
          />

          <div className="p-7">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className={labelClass}>
                  Nama Lengkap{" "}
                  <span className="text-red-500 normal-case">*</span>
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
                  Email <span className="text-red-500 normal-case">*</span>
                </label>
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
                <label className={labelClass}>No. Telepon</label>
                <input
                  name="phone"
                  placeholder="08123456789"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Password <span className="text-red-500 normal-case">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
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
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                style={{ boxShadow: "0 4px 14px rgba(220,38,38,0.25)" }}>
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

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link
                href="/masuk"
                className="text-red-600 hover:text-red-700 font-semibold transition">
                Masuk
              </Link>
            </p>
          </div>
        </div>

        {/* Info box */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}>
          <p className="text-xs text-slate-300 text-center leading-relaxed">
            Dengan mendaftar, kamu bisa booking servis ke bengkel manapun yang
            terdaftar di BengkelKu.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center gap-3 mt-5">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
            <span className="text-xs text-slate-400">Punya bengkel?</span>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <Link
              href="/register"
              className="text-xs text-red-400 hover:text-red-300 font-semibold transition">
              Daftarkan bengkel di sini
            </Link>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}
