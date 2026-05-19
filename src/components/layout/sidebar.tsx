// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Booking", icon: CalendarDays },
  { href: "/customers", label: "Pelanggan", icon: Users },
  { href: "/vehicles", label: "Kendaraan", icon: Car },
  { href: "/services", label: "Servis", icon: Wrench },
  { href: "/invoices", label: "Invoice", icon: FileText },
  { href: "/laporan", label: "Laporan", icon: BarChart3 }, // ← TAMBAH
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900">BengkelKu</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}>
              <item.icon
                className={cn(
                  "w-4 h-4",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group">
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
