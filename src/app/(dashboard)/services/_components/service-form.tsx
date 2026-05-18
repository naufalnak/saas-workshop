// src/app/(dashboard)/services/_components/service-form.tsx
"use client";

import { useTransition, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "../actions";
import type {
  getVehiclesForSelect,
  getMechanicsForSelect,
  getServiceById,
} from "../actions";

type VehicleOption = Awaited<ReturnType<typeof getVehiclesForSelect>>[number];
type MechanicOption = Awaited<ReturnType<typeof getMechanicsForSelect>>[number];
type ServiceDetail = Awaited<ReturnType<typeof getServiceById>>;

interface Props {
  service?: ServiceDetail;
  vehicles: VehicleOption[];
  mechanics: MechanicOption[];
  onSuccess?: () => void;
}

export function ServiceForm({
  service,
  vehicles,
  mechanics,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (service) {
        await updateService(service.id, formData);
        onSuccess?.();
      } else {
        const id = await createService(formData);
        router.push(`/services/${id}`);
      }
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Kendaraan */}
      <div>
        <label className={labelClass}>
          Kendaraan <span className="text-red-500">*</span>
        </label>
        <select
          name="vehicleId"
          required
          defaultValue={service?.vehicleId ?? ""}
          className={inputClass}>
          <option value="">-- Pilih Kendaraan --</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.plateNumber} — {v.brand} {v.model} ({v.customer.name})
            </option>
          ))}
        </select>
      </div>

      {/* Mekanik */}
      <div>
        <label className={labelClass}>Mekanik</label>
        <select
          name="mechanicId"
          defaultValue={service?.mechanicId ?? ""}
          className={inputClass}>
          <option value="">-- Pilih Mekanik (opsional) --</option>
          {mechanics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>
      </div>

      {/* Keluhan */}
      <div>
        <label className={labelClass}>
          Keluhan Pelanggan <span className="text-red-500">*</span>
        </label>
        <textarea
          name="complaint"
          required
          defaultValue={service?.complaint ?? ""}
          rows={2}
          placeholder="Contoh: Mesin susah dinyalakan, suara aneh saat rem"
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Diagnosis */}
      <div>
        <label className={labelClass}>Diagnosis Mekanik</label>
        <textarea
          name="diagnosis"
          defaultValue={service?.diagnosis ?? ""}
          rows={2}
          placeholder="Contoh: Aki lemah, kampas rem aus"
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Catatan */}
      <div>
        <label className={labelClass}>Catatan Tambahan</label>
        <textarea
          name="notes"
          defaultValue={service?.notes ?? ""}
          rows={2}
          placeholder="Catatan internal untuk mekanik"
          className={inputClass + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
          </>
        ) : service ? (
          "Simpan Perubahan"
        ) : (
          "Buat & Buka Detail"
        )}
      </button>
    </form>
  );
}
