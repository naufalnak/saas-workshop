// src/app/(dashboard)/settings/_components/settings-client.tsx
"use client";

import { useState, useTransition } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import type { Workshop } from "@prisma/client";

interface Props {
  workshop: Workshop;
}

export function SettingsClient({ workshop }: Props) {
  const [copied, setCopied] = useState(false);

  const portalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/portal/${workshop.slug}`
      : `/portal/${workshop.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 max-w-2xl space-y-6">
      {/* Workshop info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Informasi Bengkel
        </h3>
        <div className="space-y-3 text-sm">
          {[
            { label: "Nama Bengkel", value: workshop.name },
            { label: "Kota", value: workshop.city ?? "—" },
            { label: "Telepon", value: workshop.phone ?? "—" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">{row.label}</span>
              <span className="text-gray-900 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portal link */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Link Portal Pelanggan
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Share link ini ke pelanggan agar mereka bisa cek status servis dan
          invoice.
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <code className="text-sm text-blue-600 flex-1 truncate">
            /portal/{workshop.slug}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Disalin!" : "Salin"}
          </button>

          <a
            href={`/portal/${workshop.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> Buka
          </a>
        </div>

        <div className="mt-3 bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-xs text-blue-700">
            💡 Kirim link ini via WhatsApp ke pelanggan setelah servis selesai,
            agar mereka bisa pantau status dan lihat invoice langsung.
          </p>
        </div>
      </div>
    </div>
  );
}
