// src/components/landing/features.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Car,
  Wrench,
  FileText,
  CreditCard,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Manajemen Pelanggan",
    desc: "Simpan data pelanggan lengkap dengan riwayat servis terstruktur.",
  },
  {
    icon: Car,
    title: "Data Kendaraan",
    desc: "Catat semua kendaraan dengan detail teknis dan nomor plat.",
  },
  {
    icon: Wrench,
    title: "Service Order",
    desc: "Kelola order servis dari pending hingga selesai secara realtime.",
  },
  {
    icon: FileText,
    title: "Invoice Digital",
    desc: "Generate invoice otomatis lengkap dengan detail item pekerjaan.",
  },
  {
    icon: CreditCard,
    title: "Catat Pembayaran",
    desc: "Tunai, Transfer, QRIS. Lacak status lunas dan sisa tagihan.",
  },
  {
    icon: BarChart3,
    title: "Laporan Keuangan",
    desc: "Dashboard pendapatan, grafik tren, dan breakdown layanan terlaris.",
  },
];

export default function Features() {
  return (
    <section
      id="layanan"
      className="py-24 bg-[#0B1C3D] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"
                alt="Layanan bengkel profesional"
                width={600}
                height={500}
                className="object-cover w-full h-96 lg:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C3D]/80 via-transparent to-transparent" />

              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <p className="text-white font-bold text-sm mb-2">
                  Fitur Lengkap untuk Bengkel Modern
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Multi-tenant",
                    "Invoice Digital",
                    "Notif WA",
                    "Laporan",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative card */}
            <div className="absolute -right-6 top-8 bg-red-600 rounded-2xl px-5 py-4 shadow-2xl shadow-red-900/40">
              <p className="text-white/80 text-xs">Total Fitur</p>
              <p className="text-white font-extrabold text-3xl">15+</p>
              <p className="text-red-200 text-xs mt-0.5">Fitur lengkap</p>
            </div>
          </motion.div>

          {/* Right — Features list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10">
              <span className="inline-block bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                Fitur Platform
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Semua yang dibutuhkan bengkel modern
              </h2>
              <p className="text-blue-300 leading-relaxed">
                Dari pencatatan pelanggan hingga laporan keuangan — dirancang
                khusus untuk alur kerja bengkel nyata.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
                  <div className="w-9 h-9 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">
                      {feature.title}
                    </p>
                    <p className="text-xs text-blue-300 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
