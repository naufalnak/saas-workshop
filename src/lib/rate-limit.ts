// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

// Sliding window: max 5 requests per 10 menit
const rateLimiters: Record<string, Ratelimit> = {};

function getRateLimiter(max: number, windowMinutes: number): Ratelimit {
  const key = `${max}_${windowMinutes}`;
  if (!rateLimiters[key]) {
    rateLimiters[key] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowMinutes} m`),
      prefix: "ratelimit",
    });
  }
  return rateLimiters[key];
}

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  max = 5,
  windowMinutes = 10,
): Promise<{ success: boolean }> {
  const limiter = getRateLimiter(max, windowMinutes);
  const identifier = `${endpoint}:${ip}`;
  const { success } = await limiter.limit(identifier);
  return { success };
}
