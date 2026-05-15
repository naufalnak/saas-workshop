// src/app/(dashboard)/bookings/page.tsx
import Header from "@/components/layout/header";
import { getBookings } from "./actions";
import { BookingsClient } from "./_components/bookings-client";

export default async function BookingsPage() {
  const bookings = await getBookings();
  return (
    <>
      <Header
        title="Booking"
        subtitle="Kelola permintaan booking dari pelanggan"
      />
      <BookingsClient initialBookings={bookings} />
    </>
  );
}
