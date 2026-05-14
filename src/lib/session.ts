// src/lib/session.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function getWorkshopId(): Promise<string> {
  const session = await getSession();
  const { workshopId } = session.user;
  if (!workshopId) redirect("/login");
  return workshopId;
}
