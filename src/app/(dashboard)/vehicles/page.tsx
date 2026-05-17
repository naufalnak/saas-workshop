// src/app/(dashboard)/vehicles/page.tsx
import Header from "@/components/layout/header";
import { getVehicles, getCustomersForSelect } from "./actions";
import { VehiclesClient } from "./_components/vehicles-client";

export default async function VehiclesPage() {
  const [{ data: vehicles }, customers] = await Promise.all([
    getVehicles(),
    getCustomersForSelect(),
  ]);

  return (
    <>
      <Header title="Kendaraan" subtitle="Kelola data kendaraan pelanggan" />
      <VehiclesClient initialVehicles={vehicles} initialCustomers={customers} />
    </>
  );
}
