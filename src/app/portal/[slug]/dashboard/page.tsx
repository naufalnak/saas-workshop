// src/app/portal/[slug]/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { getWorkshopBySlug, getMyServices } from "../actions";
import { getMyBookings } from "../booking/actions"; // ← TAMBAH IMPORT
import { CustomerDashboardClient } from "./_components/customer-dashboard-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomerDashboardPage({ params }: Props) {
  const { slug } = await params;
  const [session, workshop] = await Promise.all([
    getCustomerSession(),
    getWorkshopBySlug(slug),
  ]);

  if (!workshop) notFound();
  if (!session || session.workshopId !== workshop.id) {
    redirect(`/portal/${slug}/login`);
  }

  const [services, bookings] = await Promise.all([
    // ← fetch keduanya sekaligus
    getMyServices(),
    getMyBookings(),
  ]);

  return (
    <CustomerDashboardClient
      session={session}
      workshop={workshop}
      services={services ?? []}
      bookings={bookings ?? []}
      slug={slug} // ← TAMBAH INI
    />
  );
}
