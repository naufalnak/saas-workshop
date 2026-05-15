// src/app/portal/[slug]/layout.tsx
import { getWorkshopBySlug } from "./actions";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function PortalLayout({ children, params }: Props) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
