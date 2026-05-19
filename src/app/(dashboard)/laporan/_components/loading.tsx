// src/app/(dashboard)/laporan/loading.tsx
export default function LaporanLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      {/* Filter skeleton */}
      <div className="h-10 w-56 bg-gray-200 rounded-xl" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>

      {/* Chart + breakdown skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-72 bg-gray-200 rounded-xl" />
        <div className="h-72 bg-gray-200 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
}
