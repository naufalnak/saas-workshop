// src/components/landing/benefits.tsx
"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, ShieldCheck, Smartphone } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Hemat waktu administrasi",
    desc: "Invoice dibuat otomatis dari data servis. Tidak perlu input ulang, tidak ada data yang hilang.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Pantau bisnis dengan mudah",
    desc: "Dashboard real-time menampilkan performa bengkel — berapa servis aktif, invoice belum lunas, dan pendapatan.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Data aman & terorganisir",
    desc: "Semua data tersimpan di cloud. Tidak perlu khawatir kehilangan data meski ganti perangkat.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Smartphone,
    title: "Akses dari mana saja",
    desc: "Berbasis web — bisa diakses dari komputer, tablet, maupun handphone tanpa install aplikasi.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Kenapa BengkelKu?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Dirancang untuk
              <br />
              <span className="text-blue-600">bengkel nyata</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Bukan sekadar software — BengkelKu dibuat berdasarkan alur kerja
              bengkel kendaraan yang sesungguhnya. Dari pencatatan keluhan
              pelanggan, proses servis, hingga pembayaran.
            </p>

            {/* Checklist */}
            <div className="space-y-3">
              {[
                "Multi-tenant — 1 sistem untuk banyak bengkel",
                "Data terisolasi per bengkel, aman 100%",
                "Tidak perlu training — UI intuitif",
                "Update fitur berkelanjutan",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${b.bg}`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                  {b.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
