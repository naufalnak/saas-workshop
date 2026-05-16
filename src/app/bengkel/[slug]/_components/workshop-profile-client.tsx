// src/app/bengkel/[slug]/_components/workshop-profile-client.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Wrench,
  ChevronRight,
  CalendarDays,
  Zap,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { getWorkshopBySlugPublic } from "../../actions";
import type { GlobalCustomerSession } from "@/lib/global-customer-auth";

type Workshop = NonNullable<
  Awaited<ReturnType<typeof getWorkshopBySlugPublic>>
>;

interface Props {
  workshop: Workshop;
  session: GlobalCustomerSession | null;
}

export function WorkshopProfileClient({ workshop, session }: Props) {
  const router = useRouter();

  const handleOrder = (type: "BOOKING" | "WALK_IN") => {
    if (!session) {
      router.push(`/masuk?from=/bengkel/${workshop.slug}/order?type=${type}`);
      return;
    }
    router.push(`/bengkel/${workshop.slug}/order?type=${type}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/bengkel"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Semua Bengkel
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {workshop.name}
                </h1>
                {workshop.city && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {workshop.city}
                  </div>
                )}
                {workshop.address && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {workshop.address}
                  </p>
                )}
              </div>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 mb-4">
              {workshop.openHour && workshop.closeHour && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {workshop.openHour} – {workshop.closeHour}
                </div>
              )}
              {workshop.phone && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {workshop.phone}
                </div>
              )}
            </div>

            {/* Description */}
            {workshop.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {workshop.description}
              </p>
            )}

            {/* Specialties */}
            {workshop.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {workshop.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Layanan */}
          {workshop.workshopServices.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Layanan Tersedia
              </h2>
              <div className="space-y-3">
                {workshop.workshopServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {svc.name}
                        </p>
                        {svc.description && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {svc.description}
                          </p>
                        )}
                        {svc.duration && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            ~{svc.duration} menit
                          </p>
                        )}
                      </div>
                    </div>
                    {(svc.priceMin || svc.priceMax) && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-blue-600">
                          {svc.priceMin && svc.priceMax
                            ? `${formatCurrency(svc.priceMin)} – ${formatCurrency(svc.priceMax)}`
                            : svc.priceMin
                              ? `Mulai ${formatCurrency(svc.priceMin)}`
                              : `s/d ${formatCurrency(svc.priceMax!)}`}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Order CTA */}
        <div className="space-y-4">
          {/* Booking card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Pesan Sekarang
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Pilih tipe layanan yang kamu inginkan
            </p>

            {/* Booking */}
            <button
              onClick={() => handleOrder("BOOKING")}
              className="w-full flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition mb-3 text-left group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  Booking Jadwal
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Pilih tanggal & tunggu konfirmasi bengkel
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </button>

            {/* Walk-in / Pesan Langsung */}
            <button
              onClick={() => handleOrder("WALK_IN")}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-left group">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-900">
                  Pesan Langsung
                </p>
                <p className="text-xs text-gray-500 group-hover:text-green-600 mt-0.5">
                  Langsung masuk antrean hari ini
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-400" />
            </button>

            {/* Login hint */}
            {!session && (
              <p className="text-xs text-center text-gray-400 mt-4">
                Kamu perlu{" "}
                <Link href="/masuk" className="text-blue-600 hover:underline">
                  masuk
                </Link>{" "}
                atau{" "}
                <Link href="/daftar" className="text-blue-600 hover:underline">
                  daftar
                </Link>{" "}
                untuk memesan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
