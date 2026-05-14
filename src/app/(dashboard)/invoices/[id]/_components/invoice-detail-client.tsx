// src/app/(dashboard)/invoices/[id]/_components/invoice-detail-client.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Printer, Trash2, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { PaymentForm } from "./payment-form";
import { addPayment, deletePayment } from "../../actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { getInvoiceById, getWorkshopInfo } from "../../actions";

type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoiceById>>>;
type WorkshopInfo = Awaited<ReturnType<typeof getWorkshopInfo>>;

const STATUS_CONFIG = {
  UNPAID: { label: "Belum Bayar", className: "bg-red-100 text-red-700" },
  PARTIAL: {
    label: "Sebagian Bayar",
    className: "bg-amber-100 text-amber-700",
  },
  PAID: { label: "Lunas", className: "bg-green-100 text-green-700" },
};

const PAYMENT_METHOD: Record<string, string> = {
  CASH: "Tunai",
  TRANSFER: "Transfer Bank",
  QRIS: "QRIS",
};

interface Props {
  invoice: InvoiceDetail;
  workshop: WorkshopInfo;
}

export function InvoiceDetailClient({ invoice, workshop }: Props) {
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalPaid = invoice.payments.reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Number(invoice.total) - totalPaid;
  const statusCfg = STATUS_CONFIG[invoice.status];
  const isPaid = invoice.status === "PAID";

  const handleAddPayment = (formData: FormData) => {
    startTransition(async () => {
      await addPayment(invoice.id, formData);
      setShowPayment(false);
      router.refresh();
    });
  };

  const handleDeletePayment = (paymentId: string) => {
    if (!confirm("Hapus pembayaran ini?")) return;
    startTransition(async () => {
      await deletePayment(paymentId, invoice.id);
      router.refresh();
    });
  };

  return (
    <div className="flex-1 p-6 max-w-5xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium transition">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          {!isPaid && (
            <button
              onClick={() => setShowPayment(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
              <Plus className="w-3.5 h-3.5" /> Catat Pembayaran
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice document — printable */}
        <div className="lg:col-span-2" id="invoice-print">
          <div className="bg-white rounded-xl border border-gray-200 p-6 print:border-none print:shadow-none">
            {/* Header invoice */}
            <div className="flex justify-between items-start mb-6 pb-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {workshop?.name ?? "Bengkel"}
                </h2>
                {workshop?.address && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {workshop.address}
                  </p>
                )}
                {workshop?.phone && (
                  <p className="text-sm text-gray-500">{workshop.phone}</p>
                )}
                {workshop?.city && (
                  <p className="text-sm text-gray-500">{workshop.city}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Invoice
                </div>
                <div className="text-lg font-bold font-mono text-gray-900">
                  {invoice.invoiceNo}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Tanggal: {formatDate(invoice.createdAt)}
                </div>
                {invoice.dueDate && (
                  <div className="text-xs text-gray-500">
                    Jatuh tempo: {formatDate(invoice.dueDate)}
                  </div>
                )}
              </div>
            </div>

            {/* Pelanggan & kendaraan */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Pelanggan
                </div>
                <div className="font-semibold text-gray-900">
                  {invoice.service.vehicle.customer.name}
                </div>
                {invoice.service.vehicle.customer.phone && (
                  <div className="text-sm text-gray-500">
                    {invoice.service.vehicle.customer.phone}
                  </div>
                )}
                {invoice.service.vehicle.customer.address && (
                  <div className="text-sm text-gray-500">
                    {invoice.service.vehicle.customer.address}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Kendaraan
                </div>
                <div className="font-semibold text-gray-900">
                  {invoice.service.vehicle.plateNumber}
                </div>
                <div className="text-sm text-gray-500">
                  {invoice.service.vehicle.brand}{" "}
                  {invoice.service.vehicle.model}
                  {invoice.service.vehicle.year
                    ? ` (${invoice.service.vehicle.year})`
                    : ""}
                </div>
              </div>
            </div>

            {/* Items table */}
            <table className="w-full text-sm mb-5">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left font-semibold text-gray-700 pb-2">
                    Keterangan
                  </th>
                  <th className="text-right font-semibold text-gray-700 pb-2">
                    Qty
                  </th>
                  <th className="text-right font-semibold text-gray-700 pb-2">
                    Harga
                  </th>
                  <th className="text-right font-semibold text-gray-700 pb-2">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.service.serviceItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
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
                    <td className="py-2.5 text-right font-medium text-gray-900">
                      {formatCurrency(Number(item.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-56 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(Number(invoice.subtotal))}</span>
                </div>
                {Number(invoice.tax) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pajak</span>
                    <span>+{formatCurrency(Number(invoice.tax))}</span>
                  </div>
                )}
                {Number(invoice.discount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Diskon</span>
                    <span className="text-green-600">
                      -{formatCurrency(Number(invoice.discount))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(Number(invoice.total))}</span>
                </div>
                {totalPaid > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Dibayar</span>
                      <span>{formatCurrency(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-red-600">
                      <span>Sisa</span>
                      <span>{formatCurrency(Math.max(0, remaining))}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Lunas stamp */}
            {isPaid && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2 border-2 border-green-500 text-green-600 rounded-lg px-6 py-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-lg tracking-widest">
                    LUNAS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Payments */}
        <div className="space-y-4">
          {/* Payment summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold">
                  {formatCurrency(Number(invoice.total))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dibayar</span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-500">Sisa</span>
                <span
                  className={`font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(Math.max(0, remaining))}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (totalPaid / Number(invoice.total)) * 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">
              {Math.round((totalPaid / Number(invoice.total)) * 100)}% terbayar
            </div>
          </div>

          {/* Payment history */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Riwayat Pembayaran ({invoice.payments.length})
            </h3>
            {invoice.payments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Belum ada pembayaran
              </p>
            ) : (
              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(Number(p.amount))}
                      </div>
                      <div className="text-xs text-gray-400">
                        {PAYMENT_METHOD[p.method]} • {formatDate(p.paidAt)}
                      </div>
                      {p.referenceNo && (
                        <div className="text-xs text-gray-400">
                          Ref: {p.referenceNo}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      disabled={isPending}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        title="Catat Pembayaran">
        <PaymentForm
          remaining={remaining}
          onSubmit={handleAddPayment}
          isPending={isPending}
        />
      </Modal>
    </div>
  );
}
