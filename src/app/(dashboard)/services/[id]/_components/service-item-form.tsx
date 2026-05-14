// src/app/(dashboard)/services/[id]/_components/service-item-form.tsx
"use client";

import { useTransition, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { addServiceItem } from "../../actions";
import { formatCurrency } from "@/lib/utils";

interface Props {
  serviceId: string;
  onSuccess: () => void;
}

export function ServiceItemForm({ serviceId, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addServiceItem(serviceId, formData);
      formRef.current?.reset();
      setQty(1);
      setUnitPrice(0);
      onSuccess();
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  // Template items
  const templates = [
    { name: "Ganti Oli Mesin", price: 85000 },
    { name: "Kampas Rem Depan", price: 120000 },
    { name: "Kampas Rem Belakang", price: 100000 },
    { name: "Jasa Tune Up", price: 150000 },
    { name: "Ganti Ban Depan", price: 350000 },
    { name: "Ganti Aki", price: 450000 },
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Quick templates */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Template cepat:</p>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                const nameInput = formRef.current?.querySelector(
                  '[name="name"]',
                ) as HTMLInputElement;
                const priceInput = formRef.current?.querySelector(
                  '[name="unitPrice"]',
                ) as HTMLInputElement;
                if (nameInput) nameInput.value = t.name;
                if (priceInput) {
                  priceInput.value = String(t.price);
                  setUnitPrice(t.price);
                }
              }}
              className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-md transition border border-gray-200">
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div>
          <label className={labelClass}>
            Nama Item <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            placeholder="Ganti Oli / Jasa Tune Up / dll"
            className={inputClass}
          />
        </div>

        <div className="mt-3">
          <label className={labelClass}>Keterangan</label>
          <input
            name="description"
            placeholder="Spesifikasi atau catatan tambahan"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className={labelClass}>
              Qty <span className="text-red-500">*</span>
            </label>
            <input
              name="qty"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Harga Satuan <span className="text-red-500">*</span>
            </label>
            <input
              name="unitPrice"
              type="number"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Preview total */}
        {qty > 0 && unitPrice > 0 && (
          <div className="mt-3 bg-blue-50 rounded-lg px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm text-blue-700">Total</span>
            <span className="text-sm font-semibold text-blue-900">
              {formatCurrency(qty * unitPrice)}
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
          </>
        ) : (
          "Tambah Item"
        )}
      </button>
    </form>
  );
}
