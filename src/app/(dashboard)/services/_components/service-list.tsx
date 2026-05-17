// src/app/(dashboard)/services/_components/service-list.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ChevronRight, Clock, User } from "lucide-react";
import { deleteService, updateServiceStatus } from "../actions";
import { formatDate } from "@/lib/utils";
import type { getServices } from "../actions";
import { ServiceStatus } from "@prisma/client";

type ServiceWithRelations = Awaited<
  ReturnType<typeof getServices>
>["data"][number];

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-gray-100 text-gray-700" },
  IN_PROGRESS: { label: "Proses", className: "bg-blue-100 text-blue-700" },
  DONE: { label: "Selesai", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatal", className: "bg-red-100 text-red-700" },
};

const NEXT_STATUS: Partial<Record<ServiceStatus, ServiceStatus>> = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
};

interface Props {
  services: ServiceWithRelations[];
  onRefresh: () => void;
}

export function ServiceList({ services, onRefresh }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, no: string) => {
    if (!confirm(`Hapus service order "${no}"?`)) return;
    startTransition(async () => {
      await deleteService(id);
      onRefresh();
    });
  };

  const handleStatusChange = (id: string, status: ServiceStatus) => {
    startTransition(async () => {
      await updateServiceStatus(id, status);
      onRefresh();
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left font-medium text-gray-500 px-5 py-3">
              No. Service
            </th>
            <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
              Kendaraan
            </th>
            <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">
              Keluhan
            </th>
            <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">
              Mekanik
            </th>
            <th className="text-center font-medium text-gray-500 px-4 py-3">
              Status
            </th>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {services.map((s) => {
            const status = STATUS_CONFIG[s.status];
            const nextStatus = NEXT_STATUS[s.status];
            return (
              <tr
                key={s.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/services/${s.id}`)}>
                <td className="px-5 py-3.5">
                  <div className="font-mono text-xs font-medium text-gray-900">
                    {s.serviceNo}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(s.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="font-semibold text-gray-900 tracking-wide">
                    {s.vehicle.plateNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.vehicle.brand} {s.vehicle.model}
                  </div>
                  <div className="text-xs text-gray-400">
                    {s.vehicle.customer.name}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <div className="text-gray-700 max-w-xs truncate">
                    {s.complaint}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {s._count.serviceItems} item
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  {s.mechanic ? (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      {s.mechanic.name}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td
                  className="px-4 py-3.5 text-center"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusChange(s.id, nextStatus)}
                        disabled={isPending}
                        className="text-xs text-blue-600 hover:underline disabled:opacity-50">
                        → {STATUS_CONFIG[nextStatus].label}
                      </button>
                    )}
                  </div>
                </td>
                <td
                  className="px-4 py-3.5"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => router.push(`/services/${s.id}`)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.serviceNo)}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
