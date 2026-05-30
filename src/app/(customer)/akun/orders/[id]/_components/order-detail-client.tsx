// src/app/(customer)/akun/orders/[id]/_components/order-detail-client.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Zap,
  Car,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import type { getOrderById } from "../../actions";

type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;

const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "DONE",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    stepLabel: string;
    desc: string;
  }
> = {
  PENDING: {
    label: "Menunggu Konfirmasi",
    stepLabel: "Menunggu",
    desc: "Bengkel sedang mereview order kamu",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    stepLabel: "Dikonfirmasi",
    desc: "Silakan datang sesuai jadwal",
  },
  REJECTED: {
    label: "Ditolak",
    stepLabel: "Ditolak",
    desc: "Order kamu tidak dapat diproses",
  },
  IN_PROGRESS: {
    label: "Sedang Diproses",
    stepLabel: "Sedang",
    desc: "Kendaraan kamu sedang diservis",
  },
  DONE: {
    label: "Selesai",
    stepLabel: "Selesai",
    desc: "Servis telah selesai",
  },
  CANCELLED: {
    label: "Dibatalkan",
    stepLabel: "Batal",
    desc: "Order telah dibatalkan",
  },
};

interface Props {
  order: OrderDetail;
  isNew: boolean;
}

export function OrderDetailClient({ order, isNew }: Props) {
  const statusCfg = STATUS_CONFIG[order.status];
  const currentStepIdx = STATUS_STEPS.indexOf(order.status as OrderStatus);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-[var(--navy-mid)] text-white sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center relative justify-center">
          <Link
            href="/akun"
            className="absolute left-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="text-center">
            <p className="text-sm font-semibold">Detail Order</p>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
              {order.orderNo}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Success banner */}
        {isNew && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                Order berhasil dikirim!
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {order.type === "BOOKING"
                  ? "Bengkel akan mengkonfirmasi jadwal kamu dalam 1x24 jam."
                  : "Kamu sudah masuk antrean. Silakan datang sesuai jam operasional bengkel."}
              </p>
            </div>
          </div>
        )}

        {/* Status card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {order.type === "BOOKING" ? (
                <CalendarDays className="w-4 h-4 text-gray-700" />
              ) : (
                <Zap className="w-4 h-4 text-gray-700" />
              )}
              <span className="text-sm font-bold text-gray-800">
                {order.type === "BOOKING" ? "Booking Jadwal" : "Pesan Langsung"}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">
              {statusCfg.label}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-6">{statusCfg.desc}</p>

          {/* Progress bar — only for non-rejected/cancelled */}
          {!["REJECTED", "CANCELLED"].includes(order.status) && (
            <div className="relative px-4">
              {/* Line background */}
              <div className="absolute top-3 left-10 right-10 h-[2px] bg-gray-300 -z-0" />

              <div className="relative flex items-center justify-between z-10">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompletedOrCurrent = idx <= currentStepIdx;
                  return (
                    <div key={step} className="flex flex-col items-center w-16">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompletedOrCurrent
                            ? "bg-[var(--navy)] text-white"
                            : "bg-white border-2 border-gray-300 text-gray-400"
                        }`}>
                        {idx + 1}
                      </div>
                      <p
                        className={`text-[10px] mt-2 text-center whitespace-nowrap ${
                          isCompletedOrCurrent
                            ? "text-gray-900 font-medium"
                            : "text-gray-400"
                        }`}>
                        {STATUS_CONFIG[step].stepLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rejected reason */}
          {order.status === "REJECTED" && (
            <div className="mt-3 bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-600">
                Order kamu ditolak. Silakan hubungi bengkel atau buat order
                baru.
              </p>
            </div>
          )}
        </div>

        {/* Bengkel info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            BENGKEL
          </h3>
          <p className="font-bold text-base text-gray-900">
            {order.workshop.name}
          </p>

          <div className="space-y-1 mt-2 text-xs text-gray-600">
            {order.workshop.city && (
              <div className="flex items-center gap-1.5 font-medium text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {order.workshop.city}
              </div>
            )}
            {order.workshop.address && (
              <p className="pl-5 text-gray-500 leading-relaxed">
                {order.workshop.address}
              </p>
            )}
            {order.workshop.phone && (
              <div className="flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {order.workshop.phone}
              </div>
            )}
          </div>

          <div className="mt-3">
            <Link
              href={`/bengkel/${order.workshop.slug}`}
              className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-700 transition">
              Lihat profil bengkel{" "}
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Order detail */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            DETAIL ORDER
          </h3>
          <div className="space-y-4 text-xs">
            {order.preferredDate && (
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">
                    Tanggal preferensi
                  </p>
                  <p className="text-gray-900 mt-0.5 font-medium">
                    {formatDate(order.preferredDate)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-700">Keluhan</p>
                <p className="text-gray-900 mt-0.5 leading-relaxed">
                  {order.complaint}
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="flex gap-3">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Catatan</p>
                  <p className="text-gray-900 mt-0.5 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </div>
            )}
            {order.vehicle && (
              <div className="flex gap-3">
                <Car className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Kendaraan</p>
                  <p className="text-gray-900 mt-0.5 font-bold">
                    {order.vehicle.plateNumber}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    {order.vehicle.brand} {order.vehicle.model}
                    {order.vehicle.year ? ` (${order.vehicle.year})` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service & Progress */}
        {order.service && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              PROGRESS SERVIS
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-400">
                  No. Service
                </p>
                <p className="font-mono text-xs font-semibold text-gray-900 mt-0.5">
                  {order.service.serviceNo}
                </p>
              </div>
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                  order.service.status === "DONE"
                    ? "bg-green-100 text-green-700"
                    : order.service.status === "IN_PROGRESS"
                      ? "bg-red-100 text-red-600" // Sesuai warna "Dikerjakan" di gambar Anda
                      : "bg-gray-100 text-gray-600"
                }`}>
                {order.service.status === "DONE"
                  ? "Selesai"
                  : order.service.status === "IN_PROGRESS"
                    ? "Dikerjakan"
                    : "Pending"}
              </span>
            </div>

            {/* Items */}
            {order.service.serviceItems.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-3">
                {order.service.serviceItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-gray-700 font-medium">
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(Number(item.total))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold border-t border-gray-100 pt-3 mt-1">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      order.service.serviceItems.reduce(
                        (s, i) => s + Number(i.total),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Invoice */}
            {order.service.invoice && (
              <div
                className={`mt-4 p-3 rounded-xl ${
                  order.service.invoice.status === "PAID"
                    ? "bg-green-50"
                    : "bg-amber-50"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500">
                      Invoice
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {formatCurrency(Number(order.service.invoice.total))}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      order.service.invoice.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : order.service.invoice.status === "PARTIAL"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                    {order.service.invoice.status === "PAID"
                      ? "Lunas"
                      : order.service.invoice.status === "PARTIAL"
                        ? "Sebagian"
                        : "Belum Bayar"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
