// src/app/(customer)/akun/orders/page.tsx
import { redirect } from "next/navigation";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import { getMyOrders } from "./actions";
import { OrdersListClient } from "./_components/orders-list-client";

export default async function OrdersPage() {
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  const orders = await getMyOrders();

  return <OrdersListClient orders={orders} />;
}
