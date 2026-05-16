// src/app/bengkel/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getWorkshopBySlugPublic } from "../actions";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import PublicNavbar from "@/components/public-navbar";
import { WorkshopProfileClient } from "./_components/workshop-profile-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopProfilePage({ params }: Props) {
  const { slug } = await params;
  const [workshop, session] = await Promise.all([
    getWorkshopBySlugPublic(slug),
    getGlobalCustomerSession(),
  ]);

  if (!workshop) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar session={session} />
      <div className="pt-16">
        <WorkshopProfileClient workshop={workshop} session={session} />
      </div>
    </div>
  );
}
