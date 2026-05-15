// src/app/portal/[slug]/dashboard/_components/customer-dashboard-client.tsx
"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ← TAMBAH INI
import {
  Wrench,
  FileText,
  Car,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  CalendarDays,
} from "lucide-react";
import { customerLogout } from "../../actions";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ServiceStatus } from "@prisma/client";
import type { getMyServices } from "../../actions";
import type { CustomerSession } from "@/lib/customer-auth";
import type { getWorkshopBySlug } from "../../actions";

type Services = Awaited<ReturnType<typeof getMyServices>>;
type Workshop = NonNullable<Awaited<ReturnType<typeof getWorkshopBySlug>>>;
type BookingWithRelations = Awaited<
  ReturnType<typeof import("../../booking/actions").getMyBookings>
>[number];

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "Diproses",
    className: "bg-blue-100 text-blue-700",
    icon: Wrench,
  },
  DONE: {
    label: "Selesai",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Dibatal",
    className: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

interface Props {
  session: CustomerSession;
  workshop: Workshop;
  services: Services;
  bookings: BookingWithRelations[]; // ← TAMBAH
  slug: string;
}

export function CustomerDashboardClient({
  session,
  workshop,
  services,
  bookings,
  slug,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname(); // ← TAMBAH INI

  const handleLogout = () => {
    startTransition(async () => {
      await customerLogout(slug);
    });
  };

  const activeServices = services.filter(
    (s) => s.status === "PENDING" || s.status === "IN_PROGRESS",
  );
  const unpaidInvoices = services.filter(
    (s) => s.invoice && s.invoice.status !== "PAID",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {workshop.name}
            </p>
            <p className="text-xs text-gray-400">Portal Pelanggan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{session.name}</p>
            <p className="text-xs text-gray-400">{session.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
            <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-5">
        {/* Greeting */}
        <div className="pt-2">
          <h1 className="text-xl font-bold text-gray-900">
            Halo, {session.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ini riwayat servis kendaraan Anda di {workshop.name}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Servis",
              value: services.length,
              icon: Wrench,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Aktif",
              value: activeServices.length,
              icon: Clock,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Belum Bayar",
              value: unpaidInvoices.length,
              icon: AlertCircle,
              color: "text-red-600 bg-red-50",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Nav tabs */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/portal/${slug}/dashboard`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              pathname.includes("/dashboard")
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}>
            <Wrench className="w-3.5 h-3.5" /> Servis
          </Link>
          <Link
            href={`/portal/${slug}/invoices`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              pathname.includes("/invoices")
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}>
            <FileText className="w-3.5 h-3.5" /> Invoice
          </Link>
          <Link
            href={`/portal/${slug}/booking`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition">
            <Plus className="w-3.5 h-3.5" /> Booking Servis
          </Link>
        </div>

        {/* Booking status */}
        {bookings.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">
              Status Booking
            </h2>
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {b.complaint}
                      </span>
                    </div>
                    {b.preferredDate && (
                      <p className="text-xs text-gray-400 ml-5">
                        Preferensi: {formatDate(b.preferredDate)}
                      </p>
                    )}
                    {b.status === "REJECTED" && b.rejectReason && (
                      <p className="text-xs text-red-500 ml-5 mt-1">
                        Ditolak: {b.rejectReason}
                      </p>
                    )}
                    {b.status === "APPROVED" && b.service && (
                      <p className="text-xs text-green-600 ml-5 mt-1">
                        ✓ Service order dibuat — {b.service.serviceNo}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                      b.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : b.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                    {b.status === "PENDING"
                      ? "Menunggu"
                      : b.status === "APPROVED"
                        ? "Disetujui"
                        : "Ditolak"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service list */}
        {services.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Car className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Belum ada riwayat servis
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data servis akan muncul setelah bengkel mencatat kendaraan Anda
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((s) => {
              const statusCfg = STATUS_CONFIG[s.status];
              const StatusIcon = statusCfg.icon;
              const totalPaid =
                s.invoice?.payments.reduce(
                  (sum, p) => sum + Number(p.amount),
                  0,
                ) ?? 0;
              const invoiceTotal = Number(s.invoice?.total ?? 0);
              const remaining = invoiceTotal - totalPaid;

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-gray-200 p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 text-sm tracking-wide">
                          {s.vehicle.plateNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          {s.vehicle.brand} {s.vehicle.model}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 ml-6">
                        {formatDate(s.startDate)}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Complaint */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-0.5">Keluhan</p>
                    <p className="text-sm text-gray-700">{s.complaint}</p>
                    {s.serviceItems.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {s.serviceItems.length} item ·{" "}
                        {formatCurrency(
                          s.serviceItems.reduce(
                            (sum, i) => sum + Number(i.total),
                            0,
                          ),
                        )}
                      </p>
                    )}
                  </div>

                  {/* Invoice info */}
                  {s.invoice && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-xs text-gray-500">Invoice</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(invoiceTotal)}
                        </p>
                        {s.invoice.status !== "PAID" && remaining > 0 && (
                          <p className="text-xs text-red-500">
                            Sisa {formatCurrency(remaining)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            s.invoice.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : s.invoice.status === "PARTIAL"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}>
                          {s.invoice.status === "PAID"
                            ? "Lunas"
                            : s.invoice.status === "PARTIAL"
                              ? "Sebagian"
                              : "Belum Bayar"}
                        </span>
                        <Link
                          href={`/portal/${slug}/invoices/${s.invoice.id}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
