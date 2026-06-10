// src/components/landing/dashboard-preview.tsx
"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

const stats = [
  {
    label: "Total Pelanggan",
    value: "124",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Total Kendaraan",
    value: "89",
    icon: Car,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Total Servis",
    value: "312",
    icon: Wrench,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Total Invoice",
    value: "98",
    icon: FileText,
    color: "text-purple-600 bg-purple-50",
  },
];

const recentServices = [
  {
    plate: "B 1234 XY",
    name: "Honda Vario",
    customer: "Budi Santoso",
    status: "DONE",
    statusLabel: "Selesai",
  },
  {
    plate: "D 5678 AB",
    name: "Toyota Avanza",
    customer: "Siti Rahayu",
    status: "IN_PROGRESS",
    statusLabel: "Proses",
  },
  {
    plate: "F 9012 CD",
    name: "Yamaha NMAX",
    customer: "Agus Wijaya",
    status: "PENDING",
    statusLabel: "Pending",
  },
];

const statusClass: Record<string, string> = {
  DONE: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  PENDING: "bg-gray-100 text-gray-700",
};

export default function DashboardPreview() {
  return (
    <section id="preview" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Dashboard Preview
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tampilan yang bersih & mudah dipakai
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Dirancang agar mekanik dan pemilik bengkel bisa langsung pakai tanpa
            perlu pelatihan panjang.
          </p>
        </motion.div>

        {/* Mock dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Mock browser bar */}
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 mx-4">
              app.bengkelhub.com/dashboard
            </div>
          </div>

          {/* Mock app layout */}
          <div className="flex h-96">
            {/* Mock sidebar */}
            <div className="w-48 bg-white border-r border-gray-100 flex flex-col p-3 gap-0.5">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <Wrench className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-900">
                  BengkelHub
                </span>
              </div>
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: Users, label: "Pelanggan", active: false },
                { icon: Car, label: "Kendaraan", active: false },
                { icon: Wrench, label: "Servis", active: false },
                { icon: FileText, label: "Invoice", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                    item.active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-500"
                  }`}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Mock content */}
            <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="bg-white rounded-xl border border-gray-200 p-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent services */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">
                    Service Terbaru
                  </span>
                  <span className="text-xs text-blue-600">Lihat semua</span>
                </div>
                {recentServices.map((s) => (
                  <div
                    key={s.plate}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Car className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {s.plate} — {s.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {s.customer}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass[s.status]}`}>
                      {s.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
