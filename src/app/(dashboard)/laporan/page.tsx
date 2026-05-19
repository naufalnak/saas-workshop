// src/app/(dashboard)/laporan/page.tsx
import Header from "@/components/layout/header";
import { getLaporanData } from "./actions";
import { LaporanClient } from "./_components/laporan-client";

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function LaporanPage({ searchParams }: Props) {
  const { month, year } = await searchParams;

  const now = new Date();
  const selectedMonth = Number(month) || now.getMonth() + 1;
  const selectedYear = Number(year) || now.getFullYear();

  const data = await getLaporanData(selectedMonth, selectedYear);

  return (
    <>
      <Header
        title="Laporan Keuangan"
        subtitle="Ringkasan pendapatan dan transaksi bengkel"
      />
      <LaporanClient
        data={data}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </>
  );
}
