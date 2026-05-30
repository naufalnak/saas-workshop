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
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[var(--navy)] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/30">
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-sm block leading-none">
            BengkelKu
          </span>
          <span className="text-blue-400 text-xs leading-none">Dashboard</span>
        </div>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                  : "text-blue-200 hover:bg-white/10 hover:text-white",
              )}>
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive
                    ? "text-white"
                    : "text-blue-300 group-hover:text-white",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-red-200" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-red-600/20 hover:text-red-300 transition-all group">
          <LogOut className="w-4 h-4 text-blue-300 group-hover:text-red-300" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
