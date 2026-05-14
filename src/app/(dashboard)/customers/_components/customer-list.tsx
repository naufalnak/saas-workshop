// src/app/(dashboard)/customers/_components/customer-list.tsx
"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Car, Phone, Mail } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CustomerForm } from "./customer-form";
import { deleteCustomer } from "../actions";
import type { Customer } from "@prisma/client";

type CustomerWithCount = Customer & { _count: { vehicles: number } };

interface Props {
  customers: CustomerWithCount[];
}

export function CustomerList({ customers }: Props) {
  const [editTarget, setEditTarget] = useState<CustomerWithCount | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (
      !confirm(
        `Hapus pelanggan "${name}"? Semua kendaraan terkait juga akan terhapus.`,
      )
    )
      return;
    startTransition(() => deleteCustomer(id));
  };

  if (customers.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left font-medium text-gray-500 px-5 py-3">
                Pelanggan
              </th>
              <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
                Kontak
              </th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">
                Kendaraan
              </th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-gray-900">{c.name}</div>
                  {c.address && (
                    <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                      {c.address}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="space-y-0.5">
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    <Car className="w-3 h-3" />
                    {c._count.vehicles}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditTarget(c)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
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
        title="Edit Pelanggan">
        {editTarget && (
          <CustomerForm
            customer={editTarget}
            onSuccess={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </>
  );
}
