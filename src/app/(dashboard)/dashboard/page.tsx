// src/app/(dashboard)/dashboard/page.tsx
import Header from "@/components/layout/header";
import { getWorkshopId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Users, Car, Wrench, FileText } from "lucide-react";

async function getStats(workshopId: string) {
  const [customers, vehicles, services, invoices] = await Promise.all([
    prisma.customer.count({ where: { workshopId } }),
    prisma.vehicle.count({ where: { workshopId } }),
    prisma.service.count({ where: { workshopId } }),
    prisma.invoice.count({ where: { workshopId } }),
  ]);
  return { customers, vehicles, services, invoices };
}

export default async function DashboardPage() {
  const [session, workshopId] = await Promise.all([auth(), getWorkshopId()]);
  const stats = await getStats(workshopId);

  const cards = [
    {
      label: "Total Pelanggan",
      value: stats.customers,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Kendaraan",
      value: stats.vehicles,
      icon: Car,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Total Servis",
      value: stats.services,
      icon: Wrench,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Invoice",
      value: stats.invoices,
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Selamat datang, ${session?.user?.name}`}
      />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
