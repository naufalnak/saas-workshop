// src/app/(dashboard)/services/_components/services-client.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { Wrench, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ServiceForm } from "./service-form";
import { ServiceList } from "./service-list";
import { getServices } from "../actions";
import { ServiceStatus } from "@prisma/client";

type ServiceWithRelations = Awaited<ReturnType<typeof getServices>>[number];
type VehicleOption = Awaited<
  ReturnType<typeof import("../actions").getVehiclesForSelect>
>[number];
type MechanicOption = Awaited<
  ReturnType<typeof import("../actions").getMechanicsForSelect>
>[number];

const STATUS_TABS: { label: string; value: ServiceStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Proses", value: "IN_PROGRESS" },
  { label: "Selesai", value: "DONE" },
  { label: "Batal", value: "CANCELLED" },
];

interface Props {
  initialServices: ServiceWithRelations[];
  vehicles: VehicleOption[];
  mechanics: MechanicOption[];
}

export function ServicesClient({
  initialServices,
  vehicles,
  mechanics,
}: Props) {
  const [services, setServices] = useState(initialServices);
  const [activeTab, setActiveTab] = useState<ServiceStatus | "ALL">("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = (status?: ServiceStatus | "ALL") => {
    startTransition(async () => {
      const data = await getServices(status);
      setServices(data);
    });
  };

  useEffect(() => {
    load(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: ServiceStatus | "ALL") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 p-6 space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Buat Service
        </button>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        {isPending ? "Memuat..." : `${services.length} service ditemukan`}
      </p>

      {/* List */}
      {services.length === 0 && !isPending ? (
        <EmptyState
          icon={Wrench}
          title="Belum ada service order"
          description="Buat service order baru untuk mulai mencatat pekerjaan bengkel."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Buat Service
            </button>
          }
        />
      ) : (
        <ServiceList services={services} onRefresh={() => load(activeTab)} />
      )}

      {/* Modal create */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Buat Service Order Baru"
        size="lg">
        <ServiceForm
          vehicles={vehicles}
          mechanics={mechanics}
          onSuccess={() => {
            setShowCreate(false);
            load(activeTab);
          }}
        />
      </Modal>
    </div>
  );
}
