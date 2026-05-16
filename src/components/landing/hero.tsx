// src/components/landing/hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Wrench, CheckCircle } from "lucide-react";
import type { GlobalCustomerSession } from "@/lib/global-customer-auth";

interface Props {
  session: GlobalCustomerSession | null;
}

export default function Hero({ session }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-72 h-72 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Platform bengkel kendaraan #1 di Indonesia
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
          Servis Kendaraan Jadi
          <br />
          <span className="text-blue-600">Lebih Mudah</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Temukan bengkel terpercaya, booking jadwal servis, dan pantau progress
          kendaraan kamu — semua dari satu platform.
        </motion.p>

        {/* Search bar dummy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 max-w-lg mx-auto bg-white border border-gray-300 rounded-2xl px-5 py-3.5 shadow-lg mb-6">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <Link
            href="/bengkel"
            className="flex-1 text-left text-gray-400 text-sm hover:text-gray-600 transition">
            Cari bengkel di kotamu...
          </Link>
          <Link
            href="/bengkel"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-xl transition flex-shrink-0">
            Cari
          </Link>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {[
            "Booking & Walk-in",
            "Pantau status realtime",
            "Invoice digital",
          ].map((h) => (
            <div
              key={h}
              className="flex items-center gap-1.5 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {h}
            </div>
          ))}
        </motion.div>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Customer CTA */}
          <div className="flex flex-col items-center gap-1">
            <Link
              href={session ? "/akun" : "/daftar"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
              {session ? "Buka Akun Saya" : "Daftar sebagai Customer"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-gray-400">
              Gratis · Langsung bisa booking
            </span>
          </div>

          <div className="text-gray-300 text-sm hidden sm:block">atau</div>

          {/* Operator CTA */}
          <div className="flex flex-col items-center gap-1">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-blue-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition text-sm">
              <Wrench className="w-4 h-4" />
              Daftarkan Bengkel Saya
            </Link>
            <span className="text-xs text-gray-400">
              Mulai gratis · Kelola servis lebih mudah
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-10 border-t border-gray-200">
          {[
            { value: "2 tipe", label: "Booking & Walk-in" },
            { value: "Real-time", label: "Status servis" },
            { value: "Digital", label: "Invoice & pembayaran" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-bold text-gray-900">
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
