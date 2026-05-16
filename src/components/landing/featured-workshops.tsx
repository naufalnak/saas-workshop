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

  const featured = workshops.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
              Bengkel Terdaftar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bengkel pilihan
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Bengkel terpercaya yang sudah bergabung di platform BengkelKu
            </p>
          </div>
          <Link
            href="/bengkel"
            className="hidden md:flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Link
                href={`/bengkel/${w.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                {/* Icon & name */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
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

                {/* Description */}
                {w.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {w.description}
                  </p>
                )}

                {/* Specialties */}
                {w.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {w.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {w.openHour && w.closeHour ? (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {w.openHour} – {w.closeHour}
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs font-medium text-blue-600 flex items-center gap-0.5">
                    Lihat <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile lihat semua */}
        <div className="text-center mt-6 md:hidden">
          <Link
            href="/bengkel"
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
            Lihat semua bengkel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
