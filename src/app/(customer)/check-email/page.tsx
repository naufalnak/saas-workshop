// src/app/(customer)/check-email/page.tsx
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CheckEmailContent } from "./content";

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }>
      <CheckEmailContent />
    </Suspense>
  );
}
