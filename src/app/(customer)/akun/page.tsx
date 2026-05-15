// src/app/(customer)/akun/page.tsx
import { redirect } from "next/navigation";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import Link from "next/link";
import { Wrench, User, LogOut } from "lucide-react";
import { logoutCustomer } from "../actions";

export default async function AkunPage() {
  const session = await getGlobalCustomerSession();
  if (!session) redirect("/masuk");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">BengkelKu</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {session.name}
              </p>
              <p className="text-xs text-gray-400">{session.email}</p>
            </div>
            <form action={logoutCustomer}>
              <button
                type="submit"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-5 pt-6">
        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Halo, {session.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ini dashboard akun BengkelKu kamu
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{session.name}</p>
              <p className="text-sm text-gray-500">{session.email}</p>
              {session.phone && (
                <p className="text-sm text-gray-500">{session.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              href: "/bengkel",
              label: "Cari Bengkel",
              desc: "Temukan bengkel terdekat",
              icon: "🔍",
            },
            {
              href: "/akun/orders",
              label: "Order Saya",
              desc: "Riwayat booking & servis",
              icon: "📋",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-gray-900">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Coming soon placeholder */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-700 font-medium">
            Tahap 2 & 3 sedang dibangun
          </p>
          <p className="text-xs text-blue-500 mt-1">
            Halaman bengkel dan order akan segera tersedia
          </p>
        </div>
      </div>
    </div>
  );
}
