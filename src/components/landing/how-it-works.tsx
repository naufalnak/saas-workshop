// src/components/landing/how-it-works.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CalendarDays,
  Wrench,
  FileText,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Cari Bengkel",
    desc: "Temukan bengkel terpercaya di sekitarmu berdasarkan lokasi dan spesialisasi.",
  },
  {
    icon: CalendarDays,
    step: "02",
    title: "Booking / Walk-in",
    desc: "Pilih jadwal booking atau langsung walk-in antrean hari itu juga.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Kendaraan Diservis",
    desc: "Bengkel mengerjakan kendaraan kamu. Pantau status realtime via aplikasi.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Invoice & Selesai",
    desc: "Terima invoice digital transparan. Lihat detail pekerjaan dan harga.",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C3D] mb-4">
            Servis kendaraan dalam 4 langkah
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Dari pencarian bengkel hingga invoice — semua bisa dilakukan dari
            smartphone kamu.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-red-200 via-blue-200 to-red-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative text-center">
                {/* Step number circle */}
                <div className="relative z-10 w-24 h-24 mx-auto mb-5">
                  <div className="w-24 h-24 bg-[#0B1C3D] rounded-2xl flex items-center justify-center shadow-xl shadow-navy/20 rotate-3 group-hover:rotate-0 transition">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-extrabold shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0B1C3D] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12">
          <Link
            href="/bengkel"
            className="inline-flex items-center gap-2 bg-[#0B1C3D] hover:bg-[#132447] text-white font-bold px-8 py-3.5 rounded-xl transition shadow-xl text-sm">
            <Search className="w-4 h-4" /> Cari Bengkel Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
