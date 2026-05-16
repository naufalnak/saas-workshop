import { prisma } from "@/lib/prisma";

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  max = 5,
  windowMinutes = 10,
): Promise<{ success: boolean }> {
  const now = new Date();

  const record = await prisma.rateLimit.findUnique({
    where: { ip_endpoint: { ip, endpoint } },
  });

  // Belum ada record / window sudah expired → reset
  if (!record || record.resetAt < now) {
    await prisma.rateLimit.upsert({
      where: { ip_endpoint: { ip, endpoint } },
      update: {
        attempts: 1,
        resetAt: new Date(now.getTime() + windowMinutes * 60 * 1000),
      },
      create: {
        ip,
        endpoint,
        attempts: 1,
        resetAt: new Date(now.getTime() + windowMinutes * 60 * 1000),
      },
    });
    return { success: true };
  }

  // Sudah melebihi limit
  if (record.attempts >= max) {
    return { success: false };
  }

  // Tambah counter
  await prisma.rateLimit.update({
    where: { ip_endpoint: { ip, endpoint } },
    data: { attempts: { increment: 1 } },
  });

  return { success: true };
}
