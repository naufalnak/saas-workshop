// src/app/bengkel/[slug]/order/_components/order-form-client.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Zap,
  Car,
  FileText,
  Loader2,
} from "lucide-react";
import { createOrder } from "../actions";
import { OrderType } from "@prisma/client";
import type { getWorkshopBySlugPublic } from "../../../actions";
import type { GlobalCustomerSession } from "@/lib/global-customer-auth";

type Workshop = NonNullable<
  Awaited<ReturnType<typeof getWorkshopBySlugPublic>>
>;

interface Props {
  workshop: Workshop;
  session: GlobalCustomerSession;
  orderType: OrderType;
}

export function OrderFormClient({ workshop, session, orderType }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const isBooking = orderType === "BOOKING";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createOrder(workshop.id, orderType, formData);
      if (result?.error) setError(result.error);
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/bengkel/${workshop.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke profil bengkel
      </Link>

      {/* Type badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
          isBooking
            ? "bg-blue-100 text-blue-700"
            : "bg-green-100 text-green-700"
        }`}>
        {isBooking ? (
          <>
            <CalendarDays className="w-4 h-4" /> Booking Jadwal
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" /> Pesan Langsung
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              {isBooking ? "Booking Servis" : "Pesan Langsung"}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              {isBooking
                ? "Pilih jadwal dan isi keluhan kendaraan kamu"
                : "Langsung masuk antrean hari ini"}
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Tanggal preferensi — hanya untuk booking */}
              {isBooking && (
                <div>
                  <label className={labelClass}>
                    Tanggal Preferensi <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="preferredDate"
                    type="date"
                    required={isBooking}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Bengkel akan konfirmasi ketersediaan jadwal
                  </p>
                </div>
              )}

              {/* Info kendaraan */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" /> Info Kendaraan
                  </span>
                </label>
                <div className="space-y-3">
                  <input
                    name="plateNumber"
                    placeholder="Nomor plat (contoh: B 1234 XY)"
                    className={inputClass + " uppercase"}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="vehicleBrand"
                      placeholder="Merek (Honda, Toyota...)"
                      className={inputClass}
                    />
                    <input
                      name="vehicleModel"
                      placeholder="Model (Vario, Avanza...)"
                      className={inputClass}
                    />
                  </div>
                  <input
                    name="vehicleYear"
                    type="number"
                    placeholder="Tahun kendaraan (opsional)"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Opsional — membantu mekanik mempersiapkan servis
                </p>
              </div>

              {/* Keluhan */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Keluhan / Kerusakan <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  name="complaint"
                  required
                  rows={4}
                  placeholder="Ceritakan keluhan kendaraan kamu secara detail. Contoh: Mesin susah dinyalakan saat pagi, keluar asap putih dari knalpot..."
                  className={inputClass + " resize-none"}
                />
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
                className={`w-full font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 ${
                  isBooking
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
                  </>
                ) : isBooking ? (
                  <>
                    <CalendarDays className="w-4 h-4" /> Kirim Booking
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Pesan Langsung
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Summary */}
        <div className="space-y-4">
          {/* Bengkel info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Bengkel
            </h3>
            <p className="font-semibold text-gray-900">{workshop.name}</p>
            {workshop.city && (
              <p className="text-sm text-gray-500 mt-0.5">{workshop.city}</p>
            )}
            {workshop.openHour && workshop.closeHour && (
              <p className="text-xs text-gray-400 mt-2">
                Buka {workshop.openHour} – {workshop.closeHour}
              </p>
            )}
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Pemesan
            </h3>
            <p className="font-semibold text-gray-900">{session.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{session.email}</p>
            {session.phone && (
              <p className="text-sm text-gray-500">{session.phone}</p>
            )}
          </div>

          {/* Type info */}
          <div
            className={`rounded-xl p-4 ${
              isBooking ? "bg-blue-50" : "bg-green-50"
            }`}>
            <p
              className={`text-xs font-medium mb-1 ${
                isBooking ? "text-blue-800" : "text-green-800"
              }`}>
              {isBooking ? "📅 Booking Jadwal" : "⚡ Pesan Langsung"}
            </p>
            <p
              className={`text-xs ${
                isBooking ? "text-blue-600" : "text-green-600"
              }`}>
              {isBooking
                ? "Bengkel akan konfirmasi jadwal dalam 1x24 jam"
                : "Langsung masuk antrean, datang sesuai jam operasional"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
