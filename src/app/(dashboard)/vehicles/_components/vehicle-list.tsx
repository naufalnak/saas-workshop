// src/app/(dashboard)/vehicles/_components/vehicle-list.tsx
"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Wrench } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { VehicleForm } from "./vehicle-form";
import { deleteVehicle } from "../actions";
import type { Vehicle } from "@prisma/client";

type CustomerOption = { id: string; name: string; phone: string | null };
type VehicleWithCustomer = Vehicle & {
  customer: CustomerOption;
  _count: { services: number };
};

interface Props {
  vehicles: VehicleWithCustomer[];
  customers: CustomerOption[];
}

export function VehicleList({ vehicles, customers }: Props) {
  const [editTarget, setEditTarget] = useState<VehicleWithCustomer | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, plate: string) => {
    if (!confirm(`Hapus kendaraan "${plate}"?`)) return;
    startTransition(() => deleteVehicle(id));
  };

  if (vehicles.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left font-medium text-gray-500 px-5 py-3">
                Kendaraan
              </th>
              <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
                Pemilik
              </th>
              <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">
                Detail
              </th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">
                Servis
              </th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-gray-900 tracking-wide">
                    {v.plateNumber}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {v.brand} {v.model}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="text-sm text-gray-900">{v.customer.name}</div>
                  {v.customer.phone && (
                    <div className="text-xs text-gray-400">
                      {v.customer.phone}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1.5">
                    {v.year && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        {v.year}
                      </span>
                    )}
                    {v.color && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        {v.color}
                      </span>
                    )}
                    {v.engineCC && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        {v.engineCC}cc
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    <Wrench className="w-3 h-3" />
                    {v._count.services}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditTarget(v)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id, v.plateNumber)}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Kendaraan"
        size="lg">
        {editTarget && (
          <VehicleForm
            vehicle={editTarget}
            customers={customers}
            onSuccess={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </>
  );
}
