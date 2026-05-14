// src/app/(dashboard)/services/[id]/_components/service-detail-client.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  User,
  Car,
  FileText,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ServiceForm } from "./service-form";
import { ServiceItemForm } from "./service-item-form";
import { updateServiceStatus, deleteServiceItem } from "../actions";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ServiceStatus } from "@prisma/client";
import type {
  getServiceById,
  getVehiclesForSelect,
  getMechanicsForSelect,
} from "../actions";

type ServiceDetail = NonNullable<Awaited<ReturnType<typeof getServiceById>>>;
type VehicleOption = Awaited<ReturnType<typeof getVehiclesForSelect>>[number];
type MechanicOption = Awaited<ReturnType<typeof getMechanicsForSelect>>[number];

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "text-gray-700", bg: "bg-gray-100" },
  IN_PROGRESS: { label: "Proses", color: "text-blue-700", bg: "bg-blue-100" },
  DONE: { label: "Selesai", color: "text-green-700", bg: "bg-green-100" },
  CANCELLED: { label: "Dibatal", color: "text-red-700", bg: "bg-red-100" },
};

interface Props {
  service: ServiceDetail;
  vehicles: VehicleOption[];
  mechanics: MechanicOption[];
}

export function ServiceDetailClient({ service, vehicles, mechanics }: Props) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [isPending, startTransition] = useTransition();

  const status = STATUS_CONFIG[service.status];
  const isEditable =
    service.status !== "DONE" && service.status !== "CANCELLED";
  const canFinish =
    service.status === "IN_PROGRESS" && service.serviceItems.length > 0;

  const total = service.serviceItems.reduce(
    (sum, item) => sum + Number(item.total),
    0,
  );

  const handleStatusChange = (newStatus: ServiceStatus) => {
    startTransition(async () => {
      await updateServiceStatus(service.id, newStatus);
      router.refresh();
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!confirm("Hapus item ini?")) return;
    startTransition(async () => {
      await deleteServiceItem(itemId, service.id);
      router.refresh();
    });
  };

  return (
    <div className="flex-1 p-6 space-y-5 max-w-5xl">
      {/* Back + Status bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          {service.status === "PENDING" && (
            <button
              onClick={() => handleStatusChange("IN_PROGRESS")}
              disabled={isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-70">
              <Wrench className="w-3.5 h-3.5" /> Mulai Proses
            </button>
          )}
          {canFinish && !service.invoice && (
            <button
              onClick={() => handleStatusChange("DONE")}
              disabled={isPending}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-70">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
            </button>
          )}
          {isEditable && (
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium transition">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Kendaraan */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              <Car className="w-3.5 h-3.5" /> Kendaraan
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plat</span>
                <span className="font-semibold tracking-wide">
                  {service.vehicle.plateNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kendaraan</span>
                <span className="text-gray-900">
                  {service.vehicle.brand} {service.vehicle.model}
                </span>
              </div>
              {service.vehicle.year && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tahun</span>
                  <span className="text-gray-900">{service.vehicle.year}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Pemilik</span>
                <span className="text-gray-900">
                  {service.vehicle.customer.name}
                </span>
              </div>
            </div>
          </div>

          {/* Detail service */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              <FileText className="w-3.5 h-3.5" /> Detail Service
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Keluhan</div>
                <div className="text-gray-900">{service.complaint}</div>
              </div>
              {service.diagnosis && (
                <div>
                  <div className="text-gray-500 mb-1">Diagnosis</div>
                  <div className="text-gray-900">{service.diagnosis}</div>
                </div>
              )}
              {service.notes && (
                <div>
                  <div className="text-gray-500 mb-1">Catatan</div>
                  <div className="text-gray-900">{service.notes}</div>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-gray-100">
                <span className="text-gray-500">Tanggal masuk</span>
                <span>{formatDate(service.startDate)}</span>
              </div>
              {service.endDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal selesai</span>
                  <span>{formatDate(service.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mekanik */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              <User className="w-3.5 h-3.5" /> Mekanik
            </div>
            {service.mechanic ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                  {service.mechanic.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-900">
                  {service.mechanic.name}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Belum ditugaskan</p>
            )}
          </div>
        </div>

        {/* Right — Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Item Pekerjaan & Parts
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {service.serviceItems.length} item
                </p>
              </div>
              {isEditable && (
                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition">
                  <Plus className="w-3.5 h-3.5" /> Tambah Item
                </button>
              )}
            </div>

            {service.serviceItems.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Belum ada item. Tambahkan pekerjaan atau parts.
              </div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left font-medium text-gray-500 px-5 py-2.5">
                        Item
                      </th>
                      <th className="text-right font-medium text-gray-500 px-4 py-2.5">
                        Qty
                      </th>
                      <th className="text-right font-medium text-gray-500 px-4 py-2.5">
                        Harga
                      </th>
                      <th className="text-right font-medium text-gray-500 px-4 py-2.5">
                        Total
                      </th>
                      {isEditable && <th className="px-4 py-2.5 w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {service.serviceItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {formatCurrency(Number(item.unitPrice))}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatCurrency(Number(item.total))}
                        </td>
                        {isEditable && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={isPending}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total */}
                <div className="border-t border-gray-200 px-5 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Total Estimasi
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  {service.status === "DONE" && !service.invoice && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(
                            `/invoices/create?serviceId=${service.id}`,
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
                        <FileText className="w-4 h-4" /> Buat Invoice
                      </button>
                    </div>
                  )}
                  {service.invoice && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(`/invoices/${service.invoice!.id}`)
                        }
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition">
                        <FileText className="w-4 h-4" /> Lihat Invoice
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal edit service */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Service Order"
        size="lg">
        <ServiceForm
          service={service}
          vehicles={vehicles}
          mechanics={mechanics}
          onSuccess={() => {
            setShowEdit(false);
            router.refresh();
          }}
        />
      </Modal>

      {/* Modal tambah item */}
      <Modal
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        title="Tambah Item Pekerjaan">
        <ServiceItemForm
          serviceId={service.id}
          onSuccess={() => {
            setShowAddItem(false);
            router.refresh();
          }}
        />
      </Modal>
    </div>
  );
}
