// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// Generate service number: SVC-20240101-001
export function generateServiceNo(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SVC-${date}-${nanoid(6).toUpperCase()}`;
}

// Generate invoice number: INV-20240101-001
export function generateInvoiceNo(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `INV-${date}-${nanoid(6).toUpperCase()}`;
}

export function generateOrderNo(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `ORD-${date}-${nanoid(6).toUpperCase()}`;
}

export const inputClass =
  "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1C3D] focus:border-transparent transition bg-white";

export const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export const btnPrimary =
  "bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-70 flex items-center justify-center gap-2";

export const btnSecondary =
  "bg-[#0B1C3D] hover:bg-[#132447] text-white font-semibold rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2";

export const btnOutline =
  "border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition flex items-center justify-center gap-2";
