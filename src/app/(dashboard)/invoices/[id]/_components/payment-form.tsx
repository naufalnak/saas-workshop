// src/app/(dashboard)/invoices/[id]/_components/payment-form.tsx
"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  remaining: number;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

const METHODS = [
  { value: "CASH", label: "Tunai" },
  { value: "TRANSFER", label: "Transfer Bank" },
  { value: "QRIS", label: "QRIS" },
];

export function PaymentForm({ remaining, onSubmit, isPending }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(remaining);
  const [method, setMethod] = useState("CASH");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Sisa tagihan */}
      <div className="bg-blue-50 rounded-lg px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-blue-700">Sisa tagihan</span>
        <span className="font-bold text-blue-900">
          {formatCurrency(remaining)}
        </span>
      </div>

      {/* Jumlah bayar */}
      <div>
        <label className={labelClass}>
          Jumlah Pembayaran <span className="text-red-500">*</span>
        </label>
        <input
          name="amount"
          type="number"
          min="1"
          max={remaining}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          className={inputClass}
        />
        <div className="flex gap-2 mt-1.5">
          <button
            type="button"
            onClick={() => setAmount(remaining)}
            className="text-xs text-blue-600 hover:underline">
            Bayar penuh ({formatCurrency(remaining)})
          </button>
          <button
            type="button"
            onClick={() => setAmount(Math.round(remaining / 2))}
            className="text-xs text-gray-400 hover:underline">
            Bayar setengah
          </button>
        </div>
      </div>

      {/* Metode */}
      <div>
        <label className={labelClass}>Metode Pembayaran</label>
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                method === m.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="method" value={method} />
      </div>

      {/* No. referensi (untuk transfer/qris) */}
      {method !== "CASH" && (
        <div>
          <label className={labelClass}>No. Referensi</label>
          <input
            name="referenceNo"
            placeholder="No. transaksi / bukti transfer"
            className={inputClass}
          />
        </div>
      )}

      {/* Catatan */}
      <div>
        <label className={labelClass}>Catatan</label>
        <input
          name="notes"
          placeholder="Catatan tambahan (opsional)"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending || amount <= 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
          </>
        ) : (
          `Simpan Pembayaran ${formatCurrency(amount)}`
        )}
      </button>
    </form>
  );
}
