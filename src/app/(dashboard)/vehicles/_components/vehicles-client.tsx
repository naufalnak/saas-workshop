// src/app/(dashboard)/vehicles/_components/vehicles-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { Car, Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { VehicleForm } from "./vehicle-form";
import { VehicleList } from "./vehicle-list";
import { getVehicles, getCustomersForSelect } from "../actions";

type VehicleWithCustomer = Awaited<
  ReturnType<typeof getVehicles>
>["data"][number];
type CustomerOption = Awaited<ReturnType<typeof getCustomersForSelect>>[number];

interface Props {
  initialVehicles: VehicleWithCustomer[];
  initialCustomers: CustomerOption[];
}

export function VehiclesClient({ initialVehicles, initialCustomers }: Props) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = (q?: string) => {
    startTransition(async () => {
      const [v, c] = await Promise.all([
        getVehicles(q),
        getCustomersForSelect(),
      ]);
      setVehicles(v.data); // ← tambah .data
      setCustomers(c);
    });
  };

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="flex-1 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat, merek, model..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Tambah Kendaraan
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${vehicles.length} kendaraan ditemukan`}
      </p>

      {vehicles.length === 0 && !isPending ? (
        <EmptyState
          icon={Car}
          title="Belum ada kendaraan"
          description="Tambahkan kendaraan untuk pelanggan yang sudah terdaftar."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Tambah Kendaraan
            </button>
          }
        />
      ) : (
        <VehicleList vehicles={vehicles} customers={customers} />
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Tambah Kendaraan Baru"
        size="lg">
        <VehicleForm
          customers={customers}
          onSuccess={() => {
            setShowCreate(false);
            load(search);
          }}
        />
      </Modal>
    </div>
  );
}
