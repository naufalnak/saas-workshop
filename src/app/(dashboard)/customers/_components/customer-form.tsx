// src/app/(dashboard)/customers/_components/customer-form.tsx
"use client";

import { useRef, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { createCustomer, updateCustomer } from "../actions";
import type { Customer } from "@prisma/client";

interface Props {
  customer?: Customer;
  onSuccess: () => void;
}

export function CustomerForm({ customer, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (customer) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
      }
      formRef.current?.reset();
      onSuccess();
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          defaultValue={customer?.name}
          required
          placeholder="Budi Santoso"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>No. Telepon</label>
          <input
            name="phone"
            defaultValue={customer?.phone ?? ""}
            placeholder="08123456789"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
            placeholder="budi@email.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Alamat</label>
        <textarea
          name="address"
          defaultValue={customer?.address ?? ""}
          rows={2}
          placeholder="Jl. Merdeka No. 1, Jakarta"
          className={inputClass + " resize-none"}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : customer ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Pelanggan"
          )}
        </button>
      </div>
    </form>
  );
}
