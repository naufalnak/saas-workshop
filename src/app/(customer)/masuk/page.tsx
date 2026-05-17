// src/app/(customer)/masuk/page.tsx
import { Suspense } from "react";
import { MasukForm } from "../_components/masuk-form";

export default function MasukPage() {
  return (
    <Suspense fallback={null}>
      <MasukForm />
    </Suspense>
  );
}
