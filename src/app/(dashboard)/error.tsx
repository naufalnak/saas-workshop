// src/app/(dashboard)/error.tsx
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Terjadi kesalahan
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {error.message || "Halaman tidak dapat dimuat. Coba lagi."}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      </div>
    </div>
  );
}
