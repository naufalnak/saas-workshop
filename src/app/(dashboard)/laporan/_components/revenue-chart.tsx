// src/app/(dashboard)/laporan/_components/revenue-chart.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { month: string; pendapatan: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base font-bold text-gray-900">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function RevenueChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.pendapatan, 0);
  const hasData = data.some((d) => d.pendapatan > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Tren Pendapatan
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">6 bulan terakhir</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {formatCurrency(total)}
        </div>
      </div>

      {!hasData ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-gray-400">Belum ada data pendapatan</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000000
                  ? `${(v / 1000000).toFixed(1)}M`
                  : v >= 1000
                    ? `${(v / 1000).toFixed(0)}K`
                    : `${v}`
              }
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pendapatan"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#colorPendapatan)"
              dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
