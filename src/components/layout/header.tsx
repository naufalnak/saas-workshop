// src/components/layout/header.tsx
import { auth } from "@/lib/auth";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default async function Header({ title, subtitle }: HeaderProps) {
  const session = await auth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
          <Bell className="w-4.5 h-4.5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
