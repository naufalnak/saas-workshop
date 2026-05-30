// src/app/(dashboard)/dashboard/page.tsx
import Header from "@/components/layout/header";
import { getWorkshopId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  Users,
  Car,
  Wrench,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

async function getStats(workshopId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    customers,
    vehicles,
    services,
    invoices,
    pendingOrders,
    activeServices,
    unpaidInvoices,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.customer.count({ where: { workshopId } }),
    prisma.vehicle.count({ where: { workshopId } }),
    prisma.service.count({ where: { workshopId } }),
    prisma.invoice.count({ where: { workshopId } }),
    prisma.order.count({ where: { workshopId, status: "PENDING" } }),
    prisma.service.count({ where: { workshopId, status: "IN_PROGRESS" } }),
    prisma.invoice.count({
      where: { workshopId, status: { in: ["UNPAID", "PARTIAL"] } },
    }),
    prisma.payment.aggregate({
      where: { workshopId, paidAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  return {
    customers,
    vehicles,
    services,
    invoices,
    pendingOrders,
    activeServices,
    unpaidInvoices,
    monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0),
  };
}

export default async function DashboardPage() {
  const [session, workshopId] = await Promise.all([auth(), getWorkshopId()]);
  const stats = await getStats(workshopId);

  const mainCards = [
    {
      label: "Total Pelanggan",
      value: stats.customers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      href: "/customers",
    },
    {
      label: "Total Kendaraan",
      value: stats.vehicles,
      icon: Car,
      color: "bg-amber-50 text-amber-600",
      href: "/vehicles",
    },
    {
      label: "Total Servis",
      value: stats.services,
      icon: Wrench,
      color: "bg-green-50 text-green-600",
      href: "/services",
    },
    {
      label: "Total Invoice",
      value: stats.invoices,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      href: "/invoices",
    },
  ];

  const alertCards = [
    {
      label: "Booking Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      href: "/bookings",
      desc: "Menunggu konfirmasi",
    },
    {
      label: "Servis Aktif",
      value: stats.activeServices,
      icon: Wrench,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      href: "/services",
      desc: "Sedang dikerjakan",
    },
    {
      label: "Invoice Belum Lunas",
      value: stats.unpaidInvoices,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      href: "/invoices",
      desc: "Perlu ditagih",
    },
    {
      label: "Pendapatan Bulan Ini",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        notation: "compact",
      }).format(stats.monthlyRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      href: "/laporan",
      desc: "Total pembayaran masuk",
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Selamat datang, ${session?.user?.name}`}
      />
      <div className="flex-1 p-6 space-y-6">
        {/* Main stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mainCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-[#0B1C3D] mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </Link>
          ))}
        </div>

        {/* Alert / insight cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {alertCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`rounded-2xl border p-4 hover:shadow-md transition-all ${card.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className={`text-2xl font-extrabold ${card.color}`}>
                  {card.value}
                </span>
              </div>
              <p className={`text-sm font-semibold ${card.color}`}>
                {card.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-[#0B1C3D] mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Tambah Pelanggan",
                href: "/customers",
                icon: Users,
                color: "bg-blue-600",
              },
              {
                label: "Buat Servis",
                href: "/services",
                icon: Wrench,
                color: "bg-green-600",
              },
              {
                label: "Lihat Booking",
                href: "/bookings",
                icon: Clock,
                color: "bg-amber-600",
              },
              {
                label: "Laporan Keuangan",
                href: "/laporan",
                icon: TrendingUp,
                color: "bg-[var(--navy)]",
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#0B1C3D]/30 hover:bg-gray-50 transition-all group">
                <div
                  className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#0B1C3D]">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
