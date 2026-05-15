// src/app/(dashboard)/bookings/_components/bookings-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { getBookings, approveBooking, rejectBooking } from "../actions";
import { formatDate } from "@/lib/utils";
import { BookingStatus } from "@prisma/client";

type BookingWithRelations = Awaited<ReturnType<typeof getBookings>>[number];

const STATUS_TABS: { label: string; value: BookingStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Menunggu", value: "PENDING" },
  { label: "Disetujui", value: "APPROVED" },
  { label: "Ditolak", value: "REJECTED" },
];

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Disetujui", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Ditolak", className: "bg-red-100 text-red-700" },
};

interface Props {
  initialBookings: BookingWithRelations[];
}

export function BookingsClient({ initialBookings }: Props) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = (status?: BookingStatus | "ALL") => {
    startTransition(async () => {
      const data = await getBookings(status);
      setBookings(data);
    });
  };

  useEffect(() => {
    load(activeTab);
  }, [activeTab]);

  const handleApprove = (id: string) => {
    if (!confirm("Setujui booking ini? Service order akan dibuat otomatis."))
      return;
    startTransition(async () => {
      const serviceId = await approveBooking(id);
      router.push(`/services/${serviceId}`);
    });
  };

  const handleReject = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    startTransition(async () => {
      await rejectBooking(rejectTarget, rejectReason);
      setRejectTarget(null);
      setRejectReason("");
      load(activeTab);
    });
  };

  const pendingCount = initialBookings.filter(
    (b) => b.status === "PENDING",
  ).length;

  return (
    <div className="flex-1 p-6 space-y-5">
      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Ada <strong>{pendingCount} booking</strong> yang menunggu konfirmasi
            Anda.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
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

      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${bookings.length} booking ditemukan`}
      </p>

      {bookings.length === 0 && !isPending ? (
        <EmptyState
          icon={CalendarDays}
          title="Belum ada booking"
          description="Booking dari pelanggan akan muncul di sini."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const statusCfg = STATUS_CONFIG[b.status];
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {b.customer.name}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    {b.customer.phone && (
                      <p className="text-xs text-gray-400 mb-2">
                        {b.customer.phone}
                      </p>
                    )}

                    {/* Kendaraan */}
                    {b.vehicle && (
                      <div className="text-sm text-gray-600 mb-2">
                        🚗 {b.vehicle.plateNumber} — {b.vehicle.brand}{" "}
                        {b.vehicle.model}
                      </div>
                    )}

                    {/* Keluhan */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs text-gray-500 mb-0.5">Keluhan</p>
                      <p className="text-sm text-gray-800">{b.complaint}</p>
                    </div>

                    {/* Tanggal preferensi */}
                    {b.preferredDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Preferensi: {formatDate(b.preferredDate)}
                      </div>
                    )}

                    {/* Notes */}
                    {b.notes && (
                      <p className="text-xs text-gray-400 italic">{b.notes}</p>
                    )}

                    {/* Reject reason */}
                    {b.status === "REJECTED" && b.rejectReason && (
                      <div className="mt-2 bg-red-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-red-600">
                          Alasan penolakan: {b.rejectReason}
                        </p>
                      </div>
                    )}

                    {/* Link ke service kalau approved */}
                    {b.status === "APPROVED" && b.service && (
                      <button
                        onClick={() =>
                          router.push(`/services/${b.service!.id}`)
                        }
                        className="mt-2 text-xs text-blue-600 hover:underline">
                        Lihat Service Order: {b.service.serviceNo} →
                      </button>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Dikirim {formatDate(b.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  {b.status === "PENDING" && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(b.id)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition disabled:opacity-70">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                      </button>
                      <button
                        onClick={() => {
                          setRejectTarget(b.id);
                          setRejectReason("");
                        }}
                        disabled={isPending}
                        className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-medium transition disabled:opacity-70">
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
        title="Tolak Booking"
        size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Berikan alasan penolakan agar pelanggan mengerti.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Contoh: Jadwal penuh, silakan booking ulang minggu depan"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-none"
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
              Tolak Booking
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
