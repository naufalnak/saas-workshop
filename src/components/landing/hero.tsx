// src/components/landing/hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const highlights = [
  "Gratis untuk 1 bengkel",
  "Setup dalam 5 menit",
  "Tanpa kartu kredit",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Sistem manajemen bengkel modern
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
          Kelola Bengkel Lebih <span className="text-blue-600">Efisien</span>
          <br />
          Dari Satu Tempat
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          BengkelKu membantu bengkel kendaraan mencatat servis, mengelola
          pelanggan, dan membuat invoice profesional — semua dalam satu
          aplikasi.
        </motion.p>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {highlights.map((h) => (
            <div
              key={h}
              className="flex items-center gap-1.5 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {h}
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
            Mulai Gratis Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-xl transition text-sm">
            Masuk ke Akun
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-10 border-t border-gray-200">
          {[
            { value: "100%", label: "Web based" },
            { value: "5 mnt", label: "Setup awal" },
            { value: "∞", label: "Data servis" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
