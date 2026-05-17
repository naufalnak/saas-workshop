// src/app/bengkel/actions.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getPublishedWorkshops = unstable_cache(
  async (search?: string, specialty?: string) => {
    return prisma.workshop.findMany({
      where: {
        isPublished: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(specialty ? { specialties: { has: specialty } } : {}),
      },
      include: {
        workshopServices: { take: 3 },
        _count: { select: { services: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  ["published-workshops"],
  {
    revalidate: 60, // refresh setiap 60 detik
    tags: ["workshops"], // bisa di-invalidate manual
  },
);

export const getWorkshopBySlugPublic = unstable_cache(
  async (slug: string) => {
    return prisma.workshop.findUnique({
      where: { slug, isPublished: true },
      include: { workshopServices: { orderBy: { createdAt: "asc" } } },
    });
  },
  ["workshop-by-slug"],
  {
    revalidate: 60,
    tags: ["workshops"],
  },
);
