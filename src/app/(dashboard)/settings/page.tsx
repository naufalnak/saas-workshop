// src/app/(dashboard)/settings/page.tsx
import Header from "@/components/layout/header";
import { getWorkshopProfile } from "./actions";
import { SettingsClient } from "./_components/settings-client";

export default async function SettingsPage() {
  const workshop = await getWorkshopProfile();
  if (!workshop) return null;

  return (
    <>
      <Header title="Pengaturan" subtitle="Kelola profil bengkel" />
      <SettingsClient workshop={workshop} />
    </>
  );
}
