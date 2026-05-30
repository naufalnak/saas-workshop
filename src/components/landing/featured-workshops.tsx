// src/components/landing/featured-workshops.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Wrench, ChevronRight, ArrowRight } from "lucide-react";
import type { getPublishedWorkshops } from "@/app/bengkel/actions";

type Workshop = Awaited<ReturnType<typeof getPublishedWorkshops>>[number];

interface Props {
  workshops: Workshop[];
}

export default function FeaturedWorkshops({ workshops }: Props) {
  if (workshops.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              Bengkel Terdaftar
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C3D]">
              Bengkel pilihan kami
            </h2>
            <p className="text-gray-500 mt-2">
              Bengkel terpercaya yang sudah bergabung di platform BengkelKu
            </p>
          </div>
          <Link
            href="/bengkel"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition">
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshops.slice(0, 3).map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}>
              <Link
                href={`/bengkel/${w.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#0B1C3D]/20 transition-all">
                {/* Card header — navy background */}
                <div className="bg-[var(--navy)] px-5 py-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-red-900/30">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-red-300 transition">
                    {w.name}
                  </h3>
                  {w.city && (
                    <div className="flex items-center gap-1.5 text-blue-300 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      {w.city}
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5">
                  {w.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {w.description}
                    </p>
                  )}

                  {w.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {w.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-blue-50 text-[#0B1C3D] border border-blue-100 px-2.5 py-0.5 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {w.openHour && w.closeHour ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {w.openHour} – {w.closeHour}
                      </div>
                    ) : (
                      <span />
                    )}
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                      Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/bengkel"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
            Lihat semua bengkel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
