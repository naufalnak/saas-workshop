// src/app/(dashboard)/invoices/create/_components/create-invoice-client.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { createInvoice } from "../../actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { getServiceForInvoice } from "../../actions";

type ServiceData = NonNullable<
  Awaited<ReturnType<typeof getServiceForInvoice>>
>;

interface Props {
  service: ServiceData;
}

export function CreateInvoiceClient({ service }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const subtotal = service.serviceItems.reduce(
    (sum, item) => sum + Number(item.total),
    0,
  );
  const total = Math.max(0, subtotal + tax - discount);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const invoiceId = await createInvoice(formData);
      router.push(`/invoices/${invoiceId}`);
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex-1 p-6 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-5">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="serviceId" value={service.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — Preview */}
          <div className="lg:col-span-2 space-y-4">
            {/* Info kendaraan & pelanggan */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Preview Invoice
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {service.vehicle.customer.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {service.vehicle.customer.phone}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {service.vehicle.plateNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {service.vehicle.brand} {service.vehicle.model}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Tanggal: {formatDate(new Date())}
                  </div>
                </div>
              </div>

              {/* Service items */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 py-2">
                      Item
                    </th>
                    <th className="text-right font-medium text-gray-500 py-2">
                      Qty
                    </th>
                    <th className="text-right font-medium text-gray-500 py-2">
                      Harga
                    </th>
                    <th className="text-right font-medium text-gray-500 py-2">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {service.serviceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-400">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-gray-600">
                        {item.qty}
                      </td>
                      <td className="py-2.5 text-right text-gray-600">
                        {formatCurrency(Number(item.unitPrice))}
                      </td>
                      <td className="py-2.5 text-right font-medium">
                        {formatCurrency(Number(item.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotal, tax, discount, total */}
              <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pajak</span>
                    <span>+{formatCurrency(tax)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Diskon</span>
                    <span className="text-green-600">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Settings */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Pengaturan Invoice
              </h3>

              <div>
                <label className={labelClass}>Pajak (Rp)</label>
                <input
                  name="tax"
                  type="number"
                  min="0"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Diskon (Rp)</label>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Jatuh Tempo</label>
                <input
                  name="dueDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Total Invoice</span>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(total)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || service.serviceItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Membuat...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Buat Invoice
                  </>
                )}
              </button>

              {service.serviceItems.length === 0 && (
                <p className="text-xs text-red-500 text-center">
                  Tambahkan item service terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
