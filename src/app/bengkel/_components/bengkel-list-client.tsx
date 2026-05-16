// src/app/bengkel/_components/bengkel-list-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Wrench,
  ChevronRight,
  Star,
} from "lucide-react";
import { getPublishedWorkshops } from "../actions";

type Workshop = Awaited<ReturnType<typeof getPublishedWorkshops>>[number];

const SPECIALTIES = [
  "Semua",
  "Motor",
  "Mobil",
  "Truk",
  "AC Mobil",
  "Body Repair",
  "Ban & Velg",
  "Kelistrikan",
];

interface Props {
  initialWorkshops: Workshop[];
}

export function BengkelListClient({ initialWorkshops }: Props) {
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  const load = (q?: string, specialty?: string) => {
    startTransition(async () => {
      const data = await getPublishedWorkshops(
        q,
        specialty === "Semua" ? undefined : specialty,
      );
      setWorkshops(data);
    });
  };

  useEffect(() => {
    const t = setTimeout(() => load(search, activeSpecialty), 300);
    return () => clearTimeout(t);
  }, [search, activeSpecialty]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Cari Bengkel</h1>
        <p className="text-gray-500 text-sm">
          {workshops.length} bengkel tersedia di platform kami
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama bengkel atau kota..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
        />
      </div>

      {/* Specialty filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSpecialty(s)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              activeSpecialty === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Results */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : workshops.length === 0 ? (
        <div className="text-center py-16">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-600 mb-1">
            Bengkel tidak ditemukan
          </h3>
          <p className="text-sm text-gray-400">
            Coba kata kunci lain atau filter berbeda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workshops.map((w) => (
            <Link
              key={w.id}
              href={`/bengkel/${w.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {w.name}
                    </h3>
                    {w.city && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {w.city}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-1" />
              </div>

              {/* Description */}
              {w.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>
              )}

              {/* Specialties */}
              {w.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {w.specialties.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                  {w.specialties.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{w.specialties.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {w.openHour && w.closeHour && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {w.openHour} – {w.closeHour}
                    </div>
                  )}
                  {w.workshopServices.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {w.workshopServices.length} layanan
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-blue-600">
                  Lihat Detail →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
