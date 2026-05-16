// src/components/public-navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu, X, User } from "lucide-react";
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";

interface Props {
  session?: { name: string; email: string } | null;
}

export default function PublicNavbar({ session }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">BengkelKu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/bengkel"
            className={`text-sm transition ${
              pathname.startsWith("/bengkel")
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            Cari Bengkel
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/akun"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              {session.name.split(" ")[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/masuk"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                Daftar Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 pb-4">
          <Link
            href="/bengkel"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm text-gray-700">
            Cari Bengkel
          </Link>
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
            {session ? (
              <Link
                href="/akun"
                className="text-sm font-medium text-center py-2 bg-blue-600 text-white rounded-lg">
                Akun Saya
              </Link>
            ) : (
              <>
                <Link
                  href="/masuk"
                  className="text-sm font-medium text-center py-2 border border-gray-300 rounded-lg">
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="text-sm font-medium text-center py-2 bg-blue-600 text-white rounded-lg">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
