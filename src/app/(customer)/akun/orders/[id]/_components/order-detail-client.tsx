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
  XCircle,
  Wrench,
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
    desc: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Menunggu Konfirmasi",
    desc: "Bengkel sedang mereview order kamu",
    className: "text-amber-600",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    desc: "Silakan datang sesuai jadwal",
    className: "text-blue-600",
  },
  REJECTED: {
    label: "Ditolak",
    desc: "Order kamu tidak dapat diproses",
    className: "text-red-600",
  },
  IN_PROGRESS: {
    label: "Sedang Diproses",
    desc: "Kendaraan kamu sedang diservis",
    className: "text-blue-600",
  },
  DONE: {
    label: "Selesai",
    desc: "Servis telah selesai",
    className: "text-green-600",
  },
  CANCELLED: {
    label: "Dibatalkan",
    desc: "Order telah dibatalkan",
    className: "text-gray-500",
  },
};

interface Props {
  order: OrderDetail;
  isNew: boolean;
}

export function OrderDetailClient({ order, isNew }: Props) {
  const statusCfg = STATUS_CONFIG[order.status];
  const isActive = ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(
    order.status,
  );
  const currentStepIdx = STATUS_STEPS.indexOf(order.status as OrderStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/akun"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-gray-900">Detail Order</p>
            <p className="text-xs text-gray-400 font-mono">{order.orderNo}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {order.type === "BOOKING" ? (
                <CalendarDays className="w-4 h-4 text-blue-600" />
              ) : (
                <Zap className="w-4 h-4 text-green-600" />
              )}
              <span className="text-sm font-medium text-gray-600">
                {order.type === "BOOKING" ? "Booking Jadwal" : "Pesan Langsung"}
              </span>
            </div>
            <span className={`text-sm font-bold ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-4">{statusCfg.desc}</p>

          {/* Progress bar — only for non-rejected/cancelled */}
          {!["REJECTED", "CANCELLED"].includes(order.status) && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        idx <= currentStepIdx
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-300"
                      }`}>
                      {idx < currentStepIdx ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1 text-center ${
                        idx <= currentStepIdx
                          ? "text-blue-600 font-medium"
                          : "text-gray-400"
                      }`}>
                      {STATUS_CONFIG[step].label.split(" ")[0]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 -z-10">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(100, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
                  }}
                />
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
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Bengkel
          </h3>
          <p className="font-semibold text-gray-900">{order.workshop.name}</p>
          {order.workshop.city && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {order.workshop.city}
            </div>
          )}
          {order.workshop.address && (
            <p className="text-xs text-gray-400 mt-0.5">
              {order.workshop.address}
            </p>
          )}
          {order.workshop.phone && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <Phone className="w-3.5 h-3.5" />
              {order.workshop.phone}
            </div>
          )}
          <Link
            href={`/bengkel/${order.workshop.slug}`}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">
            Lihat profil bengkel <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Order detail */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Detail Order
          </h3>
          <div className="space-y-3 text-sm">
            {order.preferredDate && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Tanggal preferensi</p>
                  <p className="text-gray-900">
                    {formatDate(order.preferredDate)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Keluhan</p>
                <p className="text-gray-900">{order.complaint}</p>
              </div>
            </div>
            {order.notes && (
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Catatan</p>
                  <p className="text-gray-900">{order.notes}</p>
                </div>
              </div>
            )}
            {order.vehicle && (
              <div className="flex items-start gap-2">
                <Car className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Kendaraan</p>
                  <p className="text-gray-900 font-medium">
                    {order.vehicle.plateNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.vehicle.brand} {order.vehicle.model}
                    {order.vehicle.year ? ` (${order.vehicle.year})` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service & Invoice — muncul kalau order sudah diapprove */}
        {order.service && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Progress Servis
            </h3>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">No. Service</p>
                <p className="font-mono text-sm font-medium text-gray-900">
                  {order.service.serviceNo}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  order.service.status === "DONE"
                    ? "bg-green-100 text-green-700"
                    : order.service.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"
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
              <div className="border-t border-gray-100 pt-3 space-y-2">
                {order.service.serviceItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(Number(item.total))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>
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
                className={`mt-3 p-3 rounded-lg ${
                  order.service.invoice.status === "PAID"
                    ? "bg-green-50"
                    : "bg-amber-50"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">Invoice</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(Number(order.service.invoice.total))}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
