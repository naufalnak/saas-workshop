// src/app/(dashboard)/laporan/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getWorkshopId } from "@/lib/session";

const TRANSACTIONS_PER_PAGE = 20;

export async function getLaporanData(month: number, year: number) {
  const workshopId = await getWorkshopId();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const sixMonthsAgo = new Date(year, month - 7, 1);

  const [
    totalPendapatan,
    totalServis,
    totalInvoice,
    invoiceLunas,
    invoiceBelumLunas,
    monthlyData,
    serviceItemBreakdown,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { workshopId, paidAt: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    }),
    prisma.service.count({
      where: { workshopId, createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.invoice.count({
      where: { workshopId, createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.invoice.count({
      where: {
        workshopId,
        status: "PAID",
        createdAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.invoice.aggregate({
      where: { workshopId, status: { in: ["UNPAID", "PARTIAL"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.payment.groupBy({
      by: ["paidAt"],
      where: { workshopId, paidAt: { gte: sixMonthsAgo, lte: endDate } },
      _sum: { amount: true },
    }),
    prisma.serviceItem.groupBy({
      by: ["name"],
      where: {
        service: { workshopId, createdAt: { gte: startDate, lte: endDate } },
      },
      _sum: { total: true, qty: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 8,
    }),
  ]);

  // Proses chart data
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }
  monthlyData.forEach((item) => {
    const d = new Date(item.paidAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(
      key,
      (monthlyMap.get(key) ?? 0) + Number(item._sum.amount ?? 0),
    );
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
    serviceItemBreakdown: serviceItemBreakdown.map((item) => ({
      name: item.name,
      total: Number(item._sum.total ?? 0),
      qty: Number(item._sum.qty ?? 0),
      count: item._count,
    })),
  };
}

// Query transaksi dipisah — support search & pagination server-side
export async function getTransactions(
  month: number,
  year: number,
  search?: string,
  page = 1,
) {
  const workshopId = await getWorkshopId();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const skip = (page - 1) * TRANSACTIONS_PER_PAGE;

  const where = {
    workshopId,
    paidAt: { gte: startDate, lte: endDate },
    ...(search
      ? {
          OR: [
            {
              invoice: {
                service: {
                  vehicle: {
                    customer: {
                      name: { contains: search, mode: "insensitive" as const },
                    },
                  },
                },
              },
            },
            {
              invoice: {
                service: {
                  vehicle: {
                    plateNumber: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
            {
              invoice: {
                invoiceNo: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        invoice: {
          include: {
            service: {
              include: {
                vehicle: {
                  include: { customer: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: TRANSACTIONS_PER_PAGE,
      skip,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments: payments.map((p) => ({
      ...p,
      amount: p.amount.toNumber(),
    })),
    total,
    totalPages: Math.ceil(total / TRANSACTIONS_PER_PAGE),
    page,
  };
}

export type LaporanData = Awaited<ReturnType<typeof getLaporanData>>;
export type TransactionsData = Awaited<ReturnType<typeof getTransactions>>;
