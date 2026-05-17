// src/app/(dashboard)/invoices/page.tsx
import Header from "@/components/layout/header";
import { getInvoices } from "./actions";
import { InvoicesClient } from "./create/_components/invoices-client";

export default async function InvoicesPage() {
  const { data: invoices } = await getInvoices(); // ← destructure
  return (
    <>
      <Header title="Invoice" subtitle="Kelola invoice dan pembayaran" />
      <InvoicesClient initialInvoices={invoices} />
    </>
  );
}
