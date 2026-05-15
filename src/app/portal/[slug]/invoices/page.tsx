// src/app/portal/[slug]/invoices/page.tsx
import { redirect, notFound } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { getWorkshopBySlug, getMyInvoices } from "../actions";
import { CustomerInvoicesClient } from "./_components/customer-invoices-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomerInvoicesPage({ params }: Props) {
  const { slug } = await params;
  const [session, workshop, invoices] = await Promise.all([
    getCustomerSession(),
    getWorkshopBySlug(slug),
    getMyInvoices(),
  ]);

  if (!workshop) notFound();
  if (!session || session.workshopId !== workshop.id) {
    redirect(`/portal/${slug}/login`);
  }

  return (
    <CustomerInvoicesClient
      session={session}
      workshop={workshop}
      invoices={invoices}
      slug={slug}
    />
  );
}
