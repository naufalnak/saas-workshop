// src/app/portal/[slug]/invoices/_components/customer-invoices-client.tsx
"use client";

import Link from "next/link";
import { Wrench, FileText, ChevronRight, LogOut } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { getMyInvoices, getWorkshopBySlug } from "../../actions";
import type { CustomerSession } from "@/lib/customer-auth";
import { useTransition } from "react";
import { customerLogout } from "../../actions";

type Invoices = Awaited<ReturnType<typeof getMyInvoices>>;
type Workshop = NonNullable<Awaited<ReturnType<typeof getWorkshopBySlug>>>;

interface Props {
  session: CustomerSession;
  workshop: Workshop;
  invoices: Invoices;
  slug: string;
}

export function CustomerInvoicesClient({
  session,
  workshop,
  invoices,
  slug,
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {workshop.name}
            </p>
            <p className="text-xs text-gray-400">Portal Pelanggan</p>
          </div>
        </div>
        <button
          onClick={() => startTransition(() => customerLogout(slug))}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
          <LogOut className="w-4 h-4 text-gray-400" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="pt-2">
          <h1 className="text-xl font-bold text-gray-900">Invoice Saya</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {invoices.length} invoice ditemukan
          </p>
        </div>

        {/* Nav tabs */}
        <div className="flex gap-2">
          <Link
            href={`/portal/${slug}/dashboard`}
            className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition">
            <Wrench className="w-3.5 h-3.5" /> Servis
          </Link>
          <Link
            href={`/portal/${slug}/invoices`}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <FileText className="w-3.5 h-3.5" /> Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Belum ada invoice
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const totalPaid = inv.payments.reduce(
                (s, p) => s + Number(p.amount),
                0,
              );
              const remaining = Number(inv.total) - totalPaid;
              return (
                <Link
                  key={inv.id}
                  href={`/portal/${slug}/invoices/${inv.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-medium text-gray-900">
                        {inv.invoiceNo}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {inv.service.vehicle.plateNumber} ·{" "}
                        {formatDate(inv.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(Number(inv.total))}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            inv.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : inv.status === "PARTIAL"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}>
                          {inv.status === "PAID"
                            ? "Lunas"
                            : inv.status === "PARTIAL"
                              ? "Sebagian"
                              : "Belum Bayar"}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
