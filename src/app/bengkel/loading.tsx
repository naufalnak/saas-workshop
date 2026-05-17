// src/app/bengkel/loading.tsx
export default function BengkelLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pt-24 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-8" />
      <div className="h-12 bg-gray-200 rounded-xl mb-4" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
