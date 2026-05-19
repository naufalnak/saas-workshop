// src/app/(dashboard)/laporan/_components/laporan-client.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  TrendingUp,
  Wrench,
  FileText,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { RevenueChart } from "./revenue-chart";
import { ServiceBreakdown } from "./service-breakdown";
import { TransactionTable } from "./transaction-table";
import type { LaporanData } from "../actions";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

interface Props {
  data: LaporanData;
  selectedMonth: number;
  selectedYear: number;
}

export function LaporanClient({ data, selectedMonth, selectedYear }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const handleFilter = (month: number, year: number) => {
    startTransition(() => {
      router.push(`/laporan?month=${month}&year=${year}`);
    });
  };

  const { summary, chartData, payments, serviceItemBreakdown } = data;

  const summaryCards = [
    {
      label: "Total Pendapatan",
      value: formatCurrency(summary.totalPendapatan),
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      desc: `${MONTHS[selectedMonth - 1]} ${selectedYear}`,
    },
    {
      label: "Total Servis",
      value: summary.totalServis,
      icon: Wrench,
      color: "text-blue-600 bg-blue-50",
      desc: "Order servis masuk",
    },
    {
      label: "Invoice Lunas",
      value: `${summary.invoiceLunas} / ${summary.totalInvoice}`,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
      desc: "Invoice terbayar bulan ini",
    },
    {
      label: "Outstanding",
      value: formatCurrency(summary.outstanding),
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
      desc: `${summary.invoiceBelumLunas} invoice belum lunas`,
    },
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Filter periode */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-sm text-gray-500 font-medium">Periode:</span>
          <select
            value={selectedMonth}
            onChange={(e) => handleFilter(Number(e.target.value), selectedYear)}
            disabled={isPending}
            className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer">
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) =>
              handleFilter(selectedMonth, Number(e.target.value))
            }
            disabled={isPending}
            className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer">
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {isPending && (
          <span className="text-sm text-gray-400 animate-pulse">
            Memuat data...
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-gray-900 mb-0.5">
              {card.value}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {card.label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Grafik + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart — 2/3 width */}
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>

        {/* Service breakdown — 1/3 width */}
        <div>
          <ServiceBreakdown data={serviceItemBreakdown} />
        </div>
      </div>

      {/* Transaction table */}
      <TransactionTable payments={payments} />
    </div>
  );
}
