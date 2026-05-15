// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `SVC-${date}-${rand}`;
}

// Generate invoice number: INV-20240101-001
export function generateInvoiceNo(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${dateStr}-${rand}`;
}
