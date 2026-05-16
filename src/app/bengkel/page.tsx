// src/app/bengkel/page.tsx
import { getPublishedWorkshops } from "./actions";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import PublicNavbar from "@/components/public-navbar";
import { BengkelListClient } from "./_components/bengkel-list-client";

export default async function BengkelPage() {
  const [workshops, session] = await Promise.all([
    getPublishedWorkshops(),
    getGlobalCustomerSession(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar session={session} />
      <div className="pt-16">
        <BengkelListClient initialWorkshops={workshops} />
      </div>
    </div>
  );
}
