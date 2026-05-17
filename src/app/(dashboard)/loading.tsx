// src/app/(dashboard)/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 flex items-center gap-3 mb-6">
        <div className="h-5 w-32 bg-gray-200 rounded-md" />
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
}
