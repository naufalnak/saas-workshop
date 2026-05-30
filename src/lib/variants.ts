// src/lib/variants.ts
export const btn = {
  primary:
    "bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-sm",
  secondary:
    "bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white font-medium transition",
  outline:
    "border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition",
  ghost: "hover:bg-gray-100 text-gray-700 transition",
} as const;
