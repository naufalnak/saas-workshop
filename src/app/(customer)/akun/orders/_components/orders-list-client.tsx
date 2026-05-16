// src/app/(customer)/akun/orders/_components/orders-list-client.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Wrench,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import type { getMyOrders } from "../actions";

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

export function OrdersListClient({ orders }: { orders: Orders }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/akun"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <h1 className="text-sm font-semibold text-gray-900">Semua Order</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
        <p className="text-sm text-gray-500">{orders.length} order</p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada order</p>
          </div>
        ) : (
          orders.map((order) => {
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
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {order.workshop.name}
                        </p>
                        <span className="text-xs text-gray-400">
                          {order.type === "BOOKING" ? "Booking" : "Walk-in"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {order.complaint}
                      </p>
                      {order.vehicle && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.vehicle.plateNumber} — {order.vehicle.brand}{" "}
                          {order.vehicle.model}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
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
          })
        )}
      </div>
    </div>
  );
}
