// src/app/(dashboard)/bookings/page.tsx
import Header from "@/components/layout/header";
import { getOrders } from "./actions";
import { BookingsClient } from "./_components/bookings-client";

export default async function BookingsPage() {
  const orders = await getOrders();
  return (
    <>
      <Header
        title="Order Masuk"
        subtitle="Kelola booking dan pesanan langsung"
      />
      <BookingsClient initialOrders={orders} />
    </>
  );
}
