// src/components/landing/footer.tsx
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">BengkelKu</span>
          </div>

          <p className="text-sm">
            © {new Date().getFullYear()} BengkelKu. Sistem manajemen bengkel
            kendaraan.
          </p>

          <div className="flex gap-5 text-sm">
            <Link href="/login" className="hover:text-white transition">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-white transition">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
