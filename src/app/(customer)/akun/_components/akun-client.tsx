// src/app/(customer)/akun/_components/akun-client.tsx
"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  User,
  LogOut,
  Search,
  CalendarDays,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { logoutCustomer } from "../../actions";
import { formatDate } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import type { getMyOrders } from "../orders/actions";
import type { GlobalCustomerSession } from "@/lib/global-customer-auth";

type Orders = Awaited<ReturnType<typeof getMyOrders>>;

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    className: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
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
    className: "bg-gray-100 text-gray-600",
    icon: XCircle,
  },
};

interface Props {
  session: GlobalCustomerSession;
  orders: Orders;
}

export function AkunClient({ session, orders }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutCustomer();
    });
  };

  const activeOrders = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "CONFIRMED" ||
      o.status === "IN_PROGRESS",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">BengkelKu</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{session.name}</p>
              <p className="text-sm text-gray-500">{session.email}</p>
              {session.phone && (
                <p className="text-sm text-gray-400">{session.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Order",
              value: orders.length,
              color: "text-gray-900",
            },
            {
              label: "Aktif",
              value: activeOrders.length,
              color: "text-blue-600",
            },
            {
              label: "Selesai",
              value: orders.filter((o) => o.status === "DONE").length,
              color: "text-green-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick action */}
        <Link
          href="/bengkel"
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition">
          <Search className="w-5 h-5" />
          <div>
            <p className="text-sm font-semibold">Cari Bengkel</p>
            <p className="text-xs text-blue-200">
              Temukan bengkel dan pesan servis
            </p>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Link>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Order Terbaru
            </h2>
            {orders.length > 3 && (
              <Link
                href="/akun/orders"
                className="text-xs text-blue-600 hover:underline">
                Lihat semua →
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">
                Belum ada order
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Cari bengkel dan buat order pertama kamu
              </p>
              <Link
                href="/bengkel"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-blue-600 hover:underline">
                <Search className="w-3.5 h-3.5" /> Cari Bengkel
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const statusCfg = STATUS_CONFIG[order.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <Link
                    key={order.id}
                    href={`/akun/orders/${order.id}`}
                    className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            order.type === "BOOKING"
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}>
                          {order.type === "BOOKING" ? (
                            <CalendarDays className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Zap className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {order.workshop.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {order.complaint}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
