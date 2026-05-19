// src/app/(dashboard)/laporan/_components/service-breakdown.tsx
"use client";

import { formatCurrency } from "@/lib/utils";
import { Wrench } from "lucide-react";

interface Item {
  name: string;
  total: number;
  qty: number;
  count: number;
}

interface Props {
  data: Item[];
}

export function ServiceBreakdown({ data }: Props) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Layanan Terlaris
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Berdasarkan pendapatan bulan ini
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Wrench className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">Belum ada data</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, idx) => {
            const pct = Math.round((item.total / maxTotal) * 100);
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-4">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0 ml-2">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right flex-shrink-0">
                    {item.qty}x
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
