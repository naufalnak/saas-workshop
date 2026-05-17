// src/app/(dashboard)/bookings/_components/bookings-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronRight,
  Car,
  User,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { getOrders, confirmOrder, rejectOrder } from "../actions";
import { formatDate } from "@/lib/utils";
import { OrderStatus, OrderType } from "@prisma/client";

type OrderWithRelations = Awaited<ReturnType<typeof getOrders>>["data"][number];

const TYPE_TABS: { label: string; value: OrderType | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Booking", value: "BOOKING" },
  { label: "Walk-in", value: "WALK_IN" },
];

const STATUS_TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Menunggu", value: "PENDING" },
  { label: "Dikonfirmasi", value: "CONFIRMED" },
  { label: "Selesai", value: "DONE" },
  { label: "Semua", value: "ALL" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-700" },
    CONFIRMED: {
      label: "Dikonfirmasi",
      className: "bg-blue-100 text-blue-700",
    },
    REJECTED: { label: "Ditolak", className: "bg-red-100 text-red-700" },
    IN_PROGRESS: { label: "Diproses", className: "bg-blue-100 text-blue-700" },
    DONE: { label: "Selesai", className: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Dibatal", className: "bg-gray-100 text-gray-600" },
  };

interface Props {
  initialOrders: OrderWithRelations[];
}

export function BookingsClient({ initialOrders }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "ALL">(
    "PENDING",
  );
  const [activeType, setActiveType] = useState<OrderType | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    startTransition(async () => {
      const result = await getOrders(activeStatus, activeType); // ← result = { data, meta }
      setOrders(result.data); // ← ambil .data-nya
    });
  };

  useEffect(() => {
    load();
  }, [activeStatus, activeType]);

  const handleConfirm = (id: string) => {
    if (!confirm("Konfirmasi order ini? Service order akan dibuat otomatis."))
      return;
    startTransition(async () => {
      const serviceId = await confirmOrder(id);
      router.push(`/services/${serviceId}`);
    });
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    startTransition(async () => {
      await rejectOrder(rejectTarget, rejectReason);
      setRejectTarget(null);
      setRejectReason("");
      load();
    });
  };

  const pendingCount = initialOrders.filter(
    (o) => o.status === "PENDING",
  ).length;

  return (
    <div className="flex-1 p-6 space-y-5">
      {/* Alert pending */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{pendingCount} order</strong> menunggu konfirmasi kamu.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeStatus === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab.label}
              {tab.value === "PENDING" && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveType(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeType === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab.value === "BOOKING" && (
                <CalendarDays className="w-3.5 h-3.5" />
              )}
              {tab.value === "WALK_IN" && <Zap className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${orders.length} order ditemukan`}
      </p>

      {orders.length === 0 && !isPending ? (
        <EmptyState
          icon={CalendarDays}
          title="Tidak ada order"
          description="Order dari pelanggan akan muncul di sini."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          order.type === "BOOKING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                        {order.type === "BOOKING" ? (
                          <CalendarDays className="w-3 h-3" />
                        ) : (
                          <Zap className="w-3 h-3" />
                        )}
                        {order.type === "BOOKING" ? "Booking" : "Walk-in"}
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {order.orderNo}
                      </span>
                    </div>

                    {/* Customer */}
                    {order.globalCustomer && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-900 mb-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">
                          {order.globalCustomer.name}
                        </span>
                        {order.globalCustomer.phone && (
                          <span className="text-gray-400 text-xs">
                            · {order.globalCustomer.phone}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Vehicle */}
                    {order.vehicle && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Car className="w-3.5 h-3.5" />
                        {order.vehicle.plateNumber} — {order.vehicle.brand}{" "}
                        {order.vehicle.model}
                      </div>
                    )}

                    {/* Complaint */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs text-gray-500 mb-0.5">Keluhan</p>
                      <p className="text-sm text-gray-800">{order.complaint}</p>
                    </div>

                    {/* Preferred date */}
                    {order.preferredDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Preferensi: {formatDate(order.preferredDate)}
                      </div>
                    )}

                    {/* Tanggal order */}
                    <p className="text-xs text-gray-400">
                      Dikirim {formatDate(order.createdAt)}
                    </p>

                    {/* Link service kalau sudah diproses */}
                    {order.service && (
                      <button
                        onClick={() =>
                          router.push(`/services/${order.service!.id}`)
                        }
                        className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                        Lihat Service {order.service.serviceNo}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  {order.status === "PENDING" && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleConfirm(order.id)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition disabled:opacity-70">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi
                      </button>
                      <button
                        onClick={() => {
                          setRejectTarget(order.id);
                          setRejectReason("");
                        }}
                        disabled={isPending}
                        className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-medium transition">
                        <XCircle className="w-3.5 h-3.5" /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal reject */}
      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Tolak Order"
        size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Berikan alasan penolakan untuk pelanggan.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Contoh: Jadwal penuh minggu ini, silakan booking minggu depan"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setRejectTarget(null)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Batal
            </button>
            <button
              onClick={handleReject}
              disabled={isPending || !rejectReason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-70">
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Tolak
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
