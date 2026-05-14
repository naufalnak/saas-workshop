// src/app/(dashboard)/customers/page.tsx
import Header from "@/components/layout/header";
import { getCustomers } from "./actions";
import { CustomersClient } from "./_components/customers-client";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <>
      <Header title="Pelanggan" subtitle="Kelola data pelanggan bengkel" />
      <CustomersClient initialCustomers={customers} />
    </>
  );
}
