// src/app/(dashboard)/vehicles/_components/vehicle-form.tsx
"use client";

import { useTransition, useRef } from "react";
import { Loader2 } from "lucide-react";
import { createVehicle, updateVehicle } from "../actions";
import type { Vehicle } from "@prisma/client";

type CustomerOption = { id: string; name: string; phone: string | null };
type VehicleWithCustomer = Vehicle & { customer: CustomerOption };

interface Props {
  vehicle?: VehicleWithCustomer;
  customers: CustomerOption[];
  onSuccess: () => void;
}

const BRANDS = [
  "Honda",
  "Toyota",
  "Yamaha",
  "Suzuki",
  "Kawasaki",
  "Mitsubishi",
  "Daihatsu",
  "Nissan",
  "Mazda",
  "Isuzu",
  "Lainnya",
];

export function VehicleForm({ vehicle, customers, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (vehicle) await updateVehicle(vehicle.id, formData);
      else await createVehicle(formData);
      formRef.current?.reset();
      onSuccess();
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Pelanggan */}
      <div>
        <label className={labelClass}>
          Pelanggan <span className="text-red-500">*</span>
        </label>
        <select
          name="customerId"
          required
          defaultValue={vehicle?.customerId ?? ""}
          className={inputClass}>
          <option value="">-- Pilih Pelanggan --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.phone ? `(${c.phone})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Plat & Merek */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            No. Plat <span className="text-red-500">*</span>
          </label>
          <input
            name="plateNumber"
            defaultValue={vehicle?.plateNumber}
            required
            placeholder="B 1234 XYZ"
            className={inputClass + " uppercase"}
          />
        </div>
        <div>
          <label className={labelClass}>
            Merek <span className="text-red-500">*</span>
          </label>
          <select
            name="brand"
            required
            defaultValue={vehicle?.brand ?? ""}
            className={inputClass}>
            <option value="">-- Pilih Merek --</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model & Tahun */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            Model <span className="text-red-500">*</span>
          </label>
          <input
            name="model"
            defaultValue={vehicle?.model}
            required
            placeholder="Vario 125"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tahun</label>
          <input
            name="year"
            type="number"
            defaultValue={vehicle?.year ?? ""}
            placeholder="2022"
            min="1990"
            max={new Date().getFullYear() + 1}
            className={inputClass}
          />
        </div>
      </div>

      {/* Warna & CC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Warna</label>
          <input
            name="color"
            defaultValue={vehicle?.color ?? ""}
            placeholder="Hitam"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CC Mesin</label>
          <input
            name="engineCC"
            type="number"
            defaultValue={vehicle?.engineCC ?? ""}
            placeholder="125"
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
          </>
        ) : vehicle ? (
          "Simpan Perubahan"
        ) : (
          "Tambah Kendaraan"
        )}
      </button>
    </form>
  );
}
