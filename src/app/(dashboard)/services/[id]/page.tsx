// src/app/(dashboard)/services/[id]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import {
  getServiceById,
  getVehiclesForSelect,
  getMechanicsForSelect,
} from "../actions";
import { ServiceDetailClient } from "./_components/service-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const [service, vehicles, mechanics] = await Promise.all([
    getServiceById(id),
    getVehiclesForSelect(),
    getMechanicsForSelect(),
  ]);

  if (!service) notFound();

  return (
    <>
      <Header
        title={`Service ${service.serviceNo}`}
        subtitle={`${service.vehicle.plateNumber} — ${service.vehicle.brand} ${service.vehicle.model}`}
      />
      <ServiceDetailClient
        service={service}
        vehicles={vehicles}
        mechanics={mechanics}
      />
    </>
  );
}
