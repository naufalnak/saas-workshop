// src/app/portal/[slug]/invoices/[invoiceId]/page.tsx
import { redirect, notFound } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { getWorkshopBySlug } from "../../actions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string; invoiceId: string }>;
}

export default async function CustomerInvoiceDetailPage({ params }: Props) {
  const { slug, invoiceId } = await params;
  const [session, workshop] = await Promise.all([
    getCustomerSession(),
    getWorkshopBySlug(slug),
  ]);

  if (!workshop) notFound();
  if (!session || session.workshopId !== workshop.id) {
    redirect(`/portal/${slug}/login`);
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      workshopId: workshop.id,
      service: { vehicle: { customerId: session.customerId } },
    },
    include: {
      service: {
        include: {
          vehicle: { include: { customer: true } },
          serviceItems: true,
        },
      },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });

  if (!invoice) notFound();

  const totalPaid = invoice.payments.reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Number(invoice.total) - totalPaid;
  const isPaid = invoice.status === "PAID";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Back */}
        <div className="flex items-center justify-between py-4">
          <Link
            href={`/portal/${slug}/invoices`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>

        {/* Invoice card */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-6 mb-4"
          id="invoice-print">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900">{workshop.name}</h2>
              {workshop.phone && (
                <p className="text-xs text-gray-500">{workshop.phone}</p>
              )}
              {workshop.city && (
                <p className="text-xs text-gray-500">{workshop.city}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Invoice
              </p>
              <p className="font-bold font-mono text-gray-900">
                {invoice.invoiceNo}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Kendaraan */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Kendaraan</p>
            <p className="font-semibold text-gray-900">
              {invoice.service.vehicle.plateNumber} —{" "}
              {invoice.service.vehicle.brand} {invoice.service.vehicle.model}
            </p>
          </div>

          {/* Items */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-medium text-gray-500 pb-2">
                  Item
                </th>
                <th className="text-right font-medium text-gray-500 pb-2">
                  Qty
                </th>
                <th className="text-right font-medium text-gray-500 pb-2">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.service.serviceItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-2 text-gray-900">{item.name}</td>
                  <td className="py-2 text-right text-gray-500">{item.qty}</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(Number(item.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
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
            <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(Number(invoice.total))}</span>
            </div>
            {totalPaid > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Dibayar</span>
                <span>{formatCurrency(totalPaid)}</span>
              </div>
            )}
            {remaining > 0 && (
              <div className="flex justify-between font-semibold text-red-600">
                <span>Sisa tagihan</span>
                <span>{formatCurrency(remaining)}</span>
              </div>
            )}
          </div>

          {/* Lunas stamp */}
          {isPaid && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 border-2 border-green-500 text-green-600 rounded-lg px-6 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-lg tracking-widest">LUNAS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
