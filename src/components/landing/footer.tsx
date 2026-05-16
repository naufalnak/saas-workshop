// src/components/landing/footer.tsx
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">BengkelKu</span>
            </div>
            <p className="text-xs leading-relaxed">
              Platform bengkel kendaraan yang menghubungkan pelanggan dengan
              bengkel terpercaya.
            </p>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Pelanggan</h4>
            <div className="space-y-2">
              {[
                { label: "Cari Bengkel", href: "/bengkel" },
                { label: "Daftar Akun", href: "/daftar" },
                { label: "Masuk", href: "/masuk" },
                { label: "Akun Saya", href: "/akun" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-xs hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Operator */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Operator Bengkel
            </h4>
            <div className="space-y-2">
              {[
                { label: "Daftarkan Bengkel", href: "/register" },
                { label: "Login Operator", href: "/login" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-xs hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
            <div className="space-y-2">
              {[
                { label: "Fitur", href: "/#features" },
                { label: "Cara Kerja", href: "/#how-it-works" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-xs hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} BengkelKu. All rights reserved.
          </p>
          <p className="text-xs">Platform bengkel kendaraan Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
