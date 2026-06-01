// src/app/(dashboard)/laporan/_components/transaction-table.tsx
"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ChevronRight, Search, ChevronLeft } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getTransactions, type TransactionsData } from "../actions";

const METHOD_CONFIG = {
  CASH: { label: "Tunai", className: "bg-green-100 text-green-700" },
  TRANSFER: { label: "Transfer", className: "bg-blue-100 text-blue-700" },
  QRIS: { label: "QRIS", className: "bg-purple-100 text-purple-700" },
};

interface Props {
  initialData: TransactionsData;
  month: number;
  year: number;
}

export function TransactionTable({ initialData, month, year }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(
    (page: number, q: string) => {
      startTransition(async () => {
        const result = await getTransactions(month, year, q || undefined, page);
        setData(result);
      });
    },
    [month, year],
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      fetchPage(1, value);
    }, 500);
  };

  const { payments, total, totalPages, page } = data;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Transaksi Pembayaran
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{total} transaksi</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari pelanggan, plat, invoice..."
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="py-14 text-center">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            {search
              ? "Transaksi tidak ditemukan"
              : "Belum ada transaksi bulan ini"}
          </p>
        </div>
      ) : (
        <>
          <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left font-medium text-gray-500 px-5 py-3">
                    Pelanggan
                  </th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
                    Invoice
                  </th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="text-center font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
                    Metode
                  </th>
                  <th className="text-right font-medium text-gray-500 px-5 py-3">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => {
                  const methodCfg = METHOD_CONFIG[payment.method];
                  const customer = payment.invoice.service.vehicle.customer;
                  const vehicle = payment.invoice.service.vehicle;

                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/invoices/${payment.invoiceId}`)
                      }>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {vehicle.plateNumber} — {vehicle.brand}{" "}
                          {vehicle.model}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="font-mono text-xs text-gray-600">
                          {payment.invoice.invoiceNo}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="text-xs text-gray-500">
                          {formatDate(payment.paidAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${methodCfg.className}`}>
                          {methodCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(Number(payment.amount))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-5 py-3 flex justify-between items-center bg-gray-50">
              <span className="text-xs text-gray-500">
                Halaman {page} dari {totalPages} · {total} transaksi
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchPage(page - 1, search)}
                  disabled={page <= 1 || isPending}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => fetchPage(page + 1, search)}
                  disabled={page >= totalPages || isPending}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
