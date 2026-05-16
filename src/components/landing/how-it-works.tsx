// src/components/landing/how-it-works.tsx
"use client";

import { motion } from "framer-motion";
import { Search, CalendarDays, Wrench, FileText } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Cari Bengkel",
    desc: "Temukan bengkel terpercaya di sekitar kamu. Filter berdasarkan spesialisasi — motor, mobil, AC mobil, dan lainnya.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    step: "02",
    title: "Pilih Tipe Servis",
    desc: "Booking jadwal sesuai waktu kamu, atau langsung masuk antrean walk-in hari itu juga.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Kendaraan Diservis",
    desc: "Bengkel mengerjakan kendaraan kamu. Pantau status servis secara realtime dari aplikasi.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: FileText,
    step: "04",
    title: "Invoice & Selesai",
    desc: "Terima invoice digital yang transparan. Lihat detail pekerjaan dan harga sebelum membayar.",
    color: "bg-green-50 text-green-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Cara Kerja
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servis kendaraan dalam 4 langkah
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Dari pencarian bengkel hingga invoice — semua bisa dilakukan dari
            smartphone kamu.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-8px)] w-full h-0.5 bg-gray-200 z-0" />
              )}

              <div className="relative bg-white rounded-2xl border border-gray-200 p-5 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${step.color}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-100">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10">
          <Link
            href="/bengkel"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
            <Search className="w-4 h-4" /> Cari Bengkel Sekarang
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
