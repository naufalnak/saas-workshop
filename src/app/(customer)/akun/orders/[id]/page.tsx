// src/app/(customer)/akun/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import { getOrderById } from "../actions";
import { OrderDetailClient } from "./_components/order-detail-client";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { success } = await searchParams;
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  const order = await getOrderById(id);
  if (!order) notFound();

  return <OrderDetailClient order={order} isNew={success === "1"} />;
}
