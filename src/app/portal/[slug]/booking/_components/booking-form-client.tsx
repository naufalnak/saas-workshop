// src/app/portal/[slug]/booking/_components/booking-form-client.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench, Loader2, CheckCircle2 } from "lucide-react";
import { createBooking } from "../actions";
import type { getWorkshopBySlug } from "../../actions";
import type { CustomerSession } from "@/lib/customer-auth";
import type { Vehicle } from "@prisma/client";

type Workshop = NonNullable<Awaited<ReturnType<typeof getWorkshopBySlug>>>;

interface Props {
  session: CustomerSession;
  workshop: Workshop;
  vehicles: Vehicle[];
  slug: string;
}

export function BookingFormClient({
  session,
  workshop,
  vehicles,
  slug,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createBooking(slug, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{workshop.name}</p>
          <p className="text-xs text-gray-400">Portal Pelanggan</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/portal/${slug}/dashboard`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Servis</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Isi form di bawah, bengkel akan konfirmasi jadwal Anda
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-1">
              Booking Terkirim!
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Bengkel akan segera mengkonfirmasi jadwal servis Anda.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="text-sm border border-green-300 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition">
                Buat Booking Lagi
              </button>
              <Link
                href={`/portal/${slug}/dashboard`}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Lihat Status
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Pilih kendaraan */}
              <div>
                <label className={labelClass}>Kendaraan</label>
                {vehicles.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-amber-700">
                      Belum ada kendaraan terdaftar. Bengkel akan mencatat
                      kendaraan saat servis berlangsung.
                    </p>
                  </div>
                ) : (
                  <select name="vehicleId" className={inputClass}>
                    <option value="">-- Pilih kendaraan (opsional) --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plateNumber} — {v.brand} {v.model}
                        {v.year ? ` (${v.year})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Keluhan */}
              <div>
                <label className={labelClass}>
                  Keluhan / Kerusakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="complaint"
                  required
                  rows={3}
                  placeholder="Ceritakan keluhan kendaraan Anda. Contoh: Mesin susah dinyalakan, rem bunyi, oli bocor..."
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Tanggal preferensi */}
              <div>
                <label className={labelClass}>Tanggal Preferensi</label>
                <input
                  name="preferredDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Opsional — bengkel akan konfirmasi ketersediaan
                </p>
              </div>

              {/* Catatan */}
              <div>
                <label className={labelClass}>Catatan Tambahan</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Info tambahan untuk bengkel (opsional)"
                  className={inputClass + " resize-none"}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
                  </>
                ) : (
                  "Kirim Booking"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-100 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Proses Booking
          </h4>
          <div className="space-y-2">
            {[
              "Isi form dan kirim booking",
              "Bengkel review dan konfirmasi jadwal",
              "Kendaraan dibawa ke bengkel sesuai jadwal",
              "Pantau status servis di portal ini",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs text-gray-600">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
