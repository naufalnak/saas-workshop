// src/app/(dashboard)/invoices/create/page.tsx
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/header";
import { getServiceForInvoice } from "../actions";
import { CreateInvoiceClient } from "./_components/create-invoice-client";

interface Props {
  searchParams: Promise<{ serviceId?: string }>;
}

export default async function CreateInvoicePage({ searchParams }: Props) {
  const { serviceId } = await searchParams;
  if (!serviceId) redirect("/services");

  const service = await getServiceForInvoice(serviceId);
  if (!service) notFound();
  if (service.invoice) redirect(`/invoices/${service.invoice.id}`);
  if (service.status !== "DONE") redirect(`/services/${service.id}`);

  return (
    <>
      <Header
        title="Buat Invoice"
        subtitle={`Service ${service.vehicle.plateNumber} — ${service.vehicle.customer.name}`}
      />
      <CreateInvoiceClient service={service} />
    </>
  );
}
