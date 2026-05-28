// src/app/bengkel/actions.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getPublishedWorkshops(
  search?: string,
  specialty?: string,
) {
  return prisma.workshop.findMany({
    where: {
      isPublished: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
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
}

export async function getWorkshopBySlugPublic(slug: string) {
  return prisma.workshop.findUnique({
    where: { slug, isPublished: true },
    include: { workshopServices: { orderBy: { createdAt: "asc" } } },
  });
}
