// src/components/landing/cta.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Search } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-700 rounded-full opacity-30" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bergabung dengan BengkelKu
          </h2>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Platform bengkel kendaraan yang menghubungkan pelanggan dengan
            bengkel terpercaya.
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Saya Pemilik Kendaraan
            </h3>
            <p className="text-blue-100 text-sm mb-5 leading-relaxed">
              Cari bengkel terpercaya, booking jadwal, dan pantau servis
              kendaraan kamu secara realtime.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/daftar"
                className="flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition">
                Daftar Gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bengkel"
                className="flex items-center justify-center gap-2 border border-white/40 text-white py-2.5 rounded-xl text-sm hover:bg-white/10 transition">
                Lihat Bengkel
              </Link>
            </div>
          </motion.div>

          {/* Operator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Saya Pemilik Bengkel
            </h3>
            <p className="text-blue-100 text-sm mb-5 leading-relaxed">
              Tampilkan bengkel kamu di platform, terima booking online, dan
              kelola servis lebih efisien.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition">
                Daftarkan Bengkel <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 border border-white/40 text-white py-2.5 rounded-xl text-sm hover:bg-white/10 transition">
                Login Operator
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
