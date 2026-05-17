// src/app/(dashboard)/customers/_components/customers-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { CustomerForm } from "./customer-form";
import { CustomerList } from "./customer-list";
import { getCustomers } from "../actions";

type CustomerWithCount = Awaited<
  ReturnType<typeof getCustomers>
>["data"][number];

interface Props {
  initialCustomers: CustomerWithCount[];
}

export function CustomersClient({ initialCustomers }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = (q?: string) => {
    startTransition(async () => {
      const result = await getCustomers(q);
      setCustomers(result.data);
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
            placeholder="Cari nama atau telepon..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Tambah Pelanggan
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${customers.length} pelanggan ditemukan`}
      </p>

      {customers.length === 0 && !isPending ? (
        <EmptyState
          icon={Users}
          title="Belum ada pelanggan"
          description="Tambahkan pelanggan pertama bengkel Anda."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Tambah Pelanggan
            </button>
          }
        />
      ) : (
        <CustomerList customers={customers} />
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Tambah Pelanggan Baru">
        <CustomerForm
          onSuccess={() => {
            setShowCreate(false);
            load(search);
          }}
        />
      </Modal>
    </div>
  );
}
