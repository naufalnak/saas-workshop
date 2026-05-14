// src/app/(dashboard)/invoices/_components/invoices-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getInvoices } from "../../actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@prisma/client";

type InvoiceWithRelations = Awaited<ReturnType<typeof getInvoices>>[number];

const STATUS_TABS: {
  label: string;
  value: InvoiceStatus | "ALL";
  icon: React.ElementType;
}[] = [
  { label: "Semua", value: "ALL", icon: FileText },
  { label: "Belum Bayar", value: "UNPAID", icon: AlertCircle },
  { label: "Sebagian", value: "PARTIAL", icon: Clock },
  { label: "Lunas", value: "PAID", icon: CheckCircle2 },
];

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  UNPAID: { label: "Belum Bayar", className: "bg-red-100 text-red-700" },
  PARTIAL: { label: "Sebagian", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Lunas", className: "bg-green-100 text-green-700" },
};

interface Props {
  initialInvoices: InvoiceWithRelations[];
}

export function InvoicesClient({ initialInvoices }: Props) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getInvoices(activeTab);
      setInvoices(data);
    });
  }, [activeTab]);

  const totalUnpaid = initialInvoices
    .filter((i) => i.status !== "PAID")
    .reduce((sum, i) => sum + Number(i.total), 0);

  return (
    <div className="flex-1 p-6 space-y-5">
      {/* Summary card */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Invoice",
            value: initialInvoices.length,
            suffix: "invoice",
            color: "text-gray-900",
          },
          {
            label: "Belum Lunas",
            value: initialInvoices.filter((i) => i.status !== "PAID").length,
            suffix: "invoice",
            color: "text-red-600",
          },
          {
            label: "Outstanding",
            value: formatCurrency(totalUnpaid),
            suffix: "",
            color: "text-red-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">{card.label}</div>
            <div className={`text-xl font-bold ${card.color}`}>
              {card.value}{" "}
              <span className="text-sm font-normal text-gray-400">
                {card.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${invoices.length} invoice ditemukan`}
      </p>

      {invoices.length === 0 && !isPending ? (
        <EmptyState
          icon={FileText}
          title="Belum ada invoice"
          description="Invoice dibuat otomatis dari service order yang sudah selesai."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  No. Invoice
                </th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">
                  Pelanggan
                </th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">
                  Kendaraan
                </th>
                <th className="text-right font-medium text-gray-500 px-4 py-3">
                  Total
                </th>
                <th className="text-center font-medium text-gray-500 px-4 py-3">
                  Status
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => {
                const totalPaid = inv.payments.reduce(
                  (s, p) => s + Number(p.amount),
                  0,
                );
                const remaining = Number(inv.total) - totalPaid;
                const statusCfg = STATUS_CONFIG[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/invoices/${inv.id}`)}>
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs font-medium text-gray-900">
                        {inv.invoiceNo}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatDate(inv.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="text-gray-900">
                        {inv.service.vehicle.customer.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {inv.service.vehicle.customer.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="font-semibold tracking-wide text-gray-900">
                        {inv.service.vehicle.plateNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {inv.service.vehicle.brand} {inv.service.vehicle.model}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(Number(inv.total))}
                      </div>
                      {inv.status === "PARTIAL" && (
                        <div className="text-xs text-red-500">
                          Sisa {formatCurrency(remaining)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
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
      )}
    </div>
  );
}
