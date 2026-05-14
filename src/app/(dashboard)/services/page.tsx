// src/app/(dashboard)/services/page.tsx
import Header from "@/components/layout/header";
import {
  getServices,
  getMechanicsForSelect,
  getVehiclesForSelect,
} from "./actions";
import { ServicesClient } from "./_components/services-client";

export default async function ServicesPage() {
  const [services, vehicles, mechanics] = await Promise.all([
    getServices(),
    getVehiclesForSelect(),
    getMechanicsForSelect(),
  ]);

  return (
    <>
      <Header title="Servis" subtitle="Kelola order servis kendaraan" />
      <ServicesClient
        initialServices={services}
        vehicles={vehicles}
        mechanics={mechanics}
      />
    </>
  );
}
