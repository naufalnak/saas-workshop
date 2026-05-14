// src/components/landing/features.tsx
"use client";

import { motion } from "framer-motion";
import {
  Users,
  Car,
  Wrench,
  FileText,
  CreditCard,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Manajemen Pelanggan",
    desc: "Simpan data pelanggan lengkap, riwayat servis, dan informasi kontak dalam satu tempat.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Car,
    title: "Data Kendaraan",
    desc: "Catat semua kendaraan beserta detail teknis — merek, model, tahun, nomor plat, dan CC mesin.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Wrench,
    title: "Service Order",
    desc: "Buat dan kelola order servis dengan status real-time dari pending hingga selesai.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FileText,
    title: "Invoice Profesional",
    desc: "Generate invoice otomatis dari service order yang sudah selesai, lengkap dengan detail item.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CreditCard,
    title: "Pencatatan Pembayaran",
    desc: "Catat pembayaran tunai, transfer, atau QRIS. Lacak status lunas dan sisa tagihan.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Dashboard Overview",
    desc: "Pantau total pelanggan, kendaraan, servis aktif, dan invoice dalam satu tampilan.",
    color: "bg-teal-50 text-teal-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Fitur Lengkap
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Semua yang dibutuhkan bengkel
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Dari pencatatan pelanggan hingga pembayaran — semua fitur dirancang
            khusus untuk alur kerja bengkel nyata.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
