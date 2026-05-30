// src/app/bengkel/_components/bengkel-list-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, Wrench, ChevronRight } from "lucide-react";

type Workshop = {
  id: string;
  slug: string;
  name: string;
  city?: string | null;
  description?: string | null;
  specialties: string[];
  openHour?: string | null;
  closeHour?: string | null;
  workshopServices: { id: string }[];
};

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
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (specialty && specialty !== "Semua")
        params.set("specialty", specialty);

      const res = await fetch(`/api/workshops?${params.toString()}`);
      const data: Workshop[] = await res.json();
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Cari Bengkel</h1>
        <p className="text-gray-500 text-sm">
          {workshops.length} bengkel tersedia di platform kami
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama bengkel atau kota..."
          className="w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 placeholder-red-700/70 font-medium text-slate-800 bg-white"
        />
      </div>

      {/* Specialty Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSpecialty(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeSpecialty === s
                ? "bg-[var(--navy)] text-white bg-[var(--navy)]"
                : "bg-white text-gray-800 border-gray-400 hover:border-gray-600"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
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
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-600 mb-2">
            {search || activeSpecialty !== "Semua"
              ? "Bengkel tidak ditemukan"
              : "Belum ada bengkel terdaftar"}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
            {search || activeSpecialty !== "Semua"
              ? "Coba kata kunci lain atau hapus filter"
              : "Jadilah bengkel pertama yang bergabung di platform ini!"}
          </p>
          {!search && activeSpecialty === "Semua" && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[var(--navy-light)] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-800 transition">
              <Wrench className="w-4 h-4" />
              Daftarkan Bengkel Saya
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workshops.map((w) => (
            <Link
              key={w.id}
              href={`/bengkel/${w.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--navy-mid)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] text-gray-900 group-hover:text-slate-700 transition">
                        {w.name}
                      </h3>
                      {w.city && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {w.city}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition flex-shrink-0 mt-1" />
                </div>

                {/* Card Description */}
                {w.description && (
                  <p className="text-xs text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                    {w.description}
                  </p>
                )}

                {/* Card Badges / Specialties */}
                {w.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {w.specialties.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-xs font-medium text-slate-800 bg-white border border-gray-400 px-3 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                    {w.specialties.length > 4 && (
                      <span className="text-xs text-gray-400 self-center">
                        +{w.specialties.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-4">
                  {w.openHour && w.closeHour && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {w.openHour} - {w.closeHour}
                    </div>
                  )}
                  <span className="text-xs text-slate-800 font-medium">
                    {w.workshopServices.length || 0} layanan
                  </span>
                </div>
                <span className="text-xs font-bold text-red-700 hover:underline">
                  Lihat Detail &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
