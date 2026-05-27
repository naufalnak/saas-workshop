// src/components/layout/header.tsx
import { auth } from "@/lib/auth";
import { Bell, Wrench } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default async function Header({ title, subtitle }: HeaderProps) {
  const session = await auth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-[#0B1C3D]">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition relative">
          <Bell className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-[#0B1C3D] flex items-center justify-center text-white text-sm font-bold shadow-md">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
