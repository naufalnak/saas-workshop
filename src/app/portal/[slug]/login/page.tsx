// src/app/portal/[slug]/login/page.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Wrench, Loader2 } from "lucide-react";
import { customerLogin } from "../actions";

export default function CustomerLoginPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await customerLogin(slug, formData);
      if (result?.error) setError(result.error);
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Masuk Portal</h1>
          <p className="text-gray-500 text-sm mt-1">
            Akses riwayat servis Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@anda.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className={inputClass}
              />
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
              href={`/portal/${slug}/register`}
              className="text-blue-600 hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <Link href={`/portal/${slug}`} className="hover:text-gray-600">
              ← Kembali
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
