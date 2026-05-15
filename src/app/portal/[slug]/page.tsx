// src/app/portal/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Wrench, ClipboardList, FileText, ArrowRight } from "lucide-react";
import { getWorkshopBySlug } from "./actions";
import { getCustomerSession } from "@/lib/customer-auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PortalPage({ params }: Props) {
  const { slug } = await params;
  const [workshop, session] = await Promise.all([
    getWorkshopBySlug(slug),
    getCustomerSession(),
  ]);

  if (!workshop) notFound();

  // Kalau sudah login, redirect ke dashboard
  if (session && session.workshopId === workshop.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Selamat datang kembali, <strong>{session.name}</strong>
          </p>
          <Link
            href={`/portal/${slug}/dashboard`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Buka Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Workshop header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{workshop.name}</h1>
        {workshop.city && (
          <p className="text-gray-500 text-sm mt-1">{workshop.city}</p>
        )}
        <p className="text-gray-400 text-sm mt-0.5">Portal Pelanggan</p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-3 max-w-sm w-full mb-8">
        {[
          { icon: ClipboardList, label: "Cek status servis" },
          { icon: FileText, label: "Lihat invoice" },
          { icon: ArrowRight, label: "Riwayat kendaraan" },
        ].map((f) => (
          <div
            key={f.label}
            className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <f.icon className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
            <p className="text-xs text-gray-600">{f.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href={`/portal/${slug}/login`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm text-center transition">
          Masuk
        </Link>
        <Link
          href={`/portal/${slug}/register`}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl text-sm text-center transition">
          Daftar Akun
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Portal khusus pelanggan {workshop.name}
      </p>
    </div>
  );
}
