// src/app/(dashboard)/invoices/[id]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import { getInvoiceById, getWorkshopInfo } from "../actions";
import { InvoiceDetailClient } from "./_components/invoice-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const [invoice, workshop] = await Promise.all([
    getInvoiceById(id),
    getWorkshopInfo(),
  ]);

  if (!invoice) notFound();

  return (
    <>
      <Header
        title={`Invoice ${invoice.invoiceNo}`}
        subtitle={`${invoice.service.vehicle.customer.name} — ${invoice.service.vehicle.plateNumber}`}
      />
      <InvoiceDetailClient invoice={invoice} workshop={workshop} />
    </>
  );
}
