// src/app/(dashboard)/settings/page.tsx
import Header from "@/components/layout/header";
import { getWorkshopId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./_components/settings-client";

export default async function SettingsPage() {
  const workshopId = await getWorkshopId();
  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
  });

  return (
    <>
      <Header title="Pengaturan" subtitle="Kelola profil bengkel" />
      <SettingsClient workshop={workshop!} />
    </>
  );
}
