// src/app/portal/[slug]/booking/page.tsx
import { redirect, notFound } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { getWorkshopBySlug } from "../actions";
import { getMyVehicles } from "./actions";
import { BookingFormClient } from "./_components/booking-form-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;
  const [session, workshop, vehicles] = await Promise.all([
    getCustomerSession(),
    getWorkshopBySlug(slug),
    getMyVehicles(),
  ]);

  if (!workshop) notFound();
  if (!session || session.workshopId !== workshop.id) {
    redirect(`/portal/${slug}/login`);
  }

  return (
    <BookingFormClient
      session={session}
      workshop={workshop}
      vehicles={vehicles}
      slug={slug}
    />
  );
}
