// src/components/landing/cta.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-700 rounded-full opacity-30" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai kelola bengkel Anda
            <br />
            hari ini juga
          </h2>

          <p className="text-blue-100 mb-8 text-lg">
            Daftar gratis, setup dalam 5 menit, langsung bisa dipakai. Tidak
            perlu kartu kredit.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition text-sm">
              Daftar Bengkel Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/10 transition text-sm">
              Sudah punya akun? Masuk
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
