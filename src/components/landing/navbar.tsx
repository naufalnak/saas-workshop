// src/components/landing/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu, X, User, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlobalCustomerSession } from "@/lib/global-customer-auth";

interface Props {
  session?: GlobalCustomerSession | null;
}

export default function Navbar({ session }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#hero" },
    { label: "Layanan", href: "#layanan" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Bengkel", href: "/bengkel" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--navy)]/98 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-lg leading-none block">
              BengkelHub
            </span>
            <span className="text-blue-300 text-xs leading-none">
              Platform Bengkel Indonesia
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-blue-200 hover:text-white transition font-medium">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/akun"
              className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              <User className="w-4 h-4" />
              {session.name.split(" ")[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/masuk"
                className="text-sm font-medium text-blue-200 hover:text-white transition px-4 py-2">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-red-900/30">
                Daftar Gratis
              </Link>
            </>
          )}
          <Link
            href="/register"
            className="text-sm font-medium border border-blue-400/30 text-blue-200 hover:border-blue-300 hover:text-white px-4 py-2.5 rounded-xl transition">
            Daftar Bengkel
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--navy)] border-t border-white/10 px-6 pb-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm text-blue-200 border-b border-white/5">
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link
                href="/masuk"
                className="text-sm text-center py-2.5 border border-white/20 text-white rounded-xl">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="text-sm text-center py-2.5 bg-red-600 text-white rounded-xl font-semibold">
                Daftar Gratis
              </Link>
              <Link
                href="/register"
                className="text-sm text-center py-2.5 bg-white/10 text-white rounded-xl">
                Daftar Bengkel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
