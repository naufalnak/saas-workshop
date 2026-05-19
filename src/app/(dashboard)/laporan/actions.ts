// src/app/(dashboard)/laporan/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";

export async function getLaporanData(month: number, year: number) {
  const workshopId = await getWorkshopId();

  // Range tanggal untuk periode yang dipilih
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Range 6 bulan terakhir untuk grafik
  const sixMonthsAgo = new Date(year, month - 7, 1);

  const [
    // Summary bulan ini
    totalPendapatan,
    totalServis,
    totalInvoice,
    invoiceLunas,
    invoiceBelumLunas,

    // Pembayaran bulan ini (tabel transaksi)
    payments,

    // Data 6 bulan untuk grafik
    monthlyData,

    // Breakdown per item servis
    serviceItemBreakdown,
  ] = await Promise.all([
    // Total pendapatan (sum payment bulan ini)
    prisma.payment.aggregate({
      where: {
        workshopId,
        paidAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),

    // Total servis bulan ini
    prisma.service.count({
      where: {
        workshopId,
        createdAt: { gte: startDate, lte: endDate },
      },
    }),

    // Total invoice bulan ini
    prisma.invoice.count({
      where: {
        workshopId,
        createdAt: { gte: startDate, lte: endDate },
      },
    }),

    // Invoice lunas bulan ini
    prisma.invoice.count({
      where: {
        workshopId,
        status: "PAID",
        createdAt: { gte: startDate, lte: endDate },
      },
    }),

    // Invoice belum lunas
    prisma.invoice.aggregate({
      where: {
        workshopId,
        status: { in: ["UNPAID", "PARTIAL"] },
      },
      _sum: { total: true },
      _count: true,
    }),

    // Tabel transaksi bulan ini
    prisma.payment.findMany({
      where: {
        workshopId,
        paidAt: { gte: startDate, lte: endDate },
      },
      include: {
        invoice: {
          include: {
            service: {
              include: {
                vehicle: {
                  include: {
                    customer: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { paidAt: "desc" },
    }),

    // Data per bulan untuk grafik (6 bulan terakhir)
    prisma.payment.groupBy({
      by: ["paidAt"],
      where: {
        workshopId,
        paidAt: { gte: sixMonthsAgo, lte: endDate },
      },
      _sum: { amount: true },
    }),

    // Breakdown item servis terlaris
    prisma.serviceItem.groupBy({
      by: ["name"],
      where: {
        service: {
          workshopId,
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      _sum: { total: true, qty: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 8,
    }),
  ]);

  // Proses data bulanan untuk grafik
  const monthlyMap = new Map<string, number>();

  // Isi 6 bulan dengan 0 dulu
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }

  // Isi dengan data aktual
  monthlyData.forEach((item) => {
    const d = new Date(item.paidAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const current = monthlyMap.get(key) ?? 0;
    monthlyMap.set(key, current + Number(item._sum.amount ?? 0));
  });

  const chartData = Array.from(monthlyMap.entries()).map(([key, amount]) => {
    const [y, m] = key.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return {
      month: date.toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      }),
      pendapatan: amount,
    };
  });

  return {
    summary: {
      totalPendapatan: Number(totalPendapatan._sum.amount ?? 0),
      totalServis,
      totalInvoice,
      invoiceLunas,
      invoiceBelumLunas: invoiceBelumLunas._count,
      outstanding: Number(invoiceBelumLunas._sum.total ?? 0),
    },
    chartData,
    payments,
    serviceItemBreakdown: serviceItemBreakdown.map((item) => ({
      name: item.name,
      total: Number(item._sum.total ?? 0),
      qty: Number(item._sum.qty ?? 0),
      count: item._count,
    })),
  };
}

export type LaporanData = Awaited<ReturnType<typeof getLaporanData>>;
