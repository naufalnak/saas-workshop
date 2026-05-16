// src/app/bengkel/[slug]/order/page.tsx
import { notFound, redirect } from "next/navigation";
import { getWorkshopBySlugPublic } from "../../actions";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import PublicNavbar from "@/components/public-navbar";
import { OrderFormClient } from "./_components/order-form-client";
import { OrderType } from "@prisma/client";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { type } = await searchParams;

  const orderType: OrderType = type === "WALK_IN" ? "WALK_IN" : "BOOKING";

  const [workshop, session] = await Promise.all([
    getWorkshopBySlugPublic(slug),
    getGlobalCustomerSession(),
  ]);

  if (!workshop) notFound();
  if (!session)
    redirect(`/masuk?from=/bengkel/${slug}/order?type=${orderType}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar session={session} />
      <div className="pt-16">
        <OrderFormClient
          workshop={workshop}
          session={session}
          orderType={orderType}
        />
      </div>
    </div>
  );
}
