// src/app/api/workshops/route.ts
import { getPublishedWorkshops } from "@/app/bengkel/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ✅ Pastikan tidak di-cache statically

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const specialty = searchParams.get("specialty") ?? undefined;

  const data = await getPublishedWorkshops(q, specialty);
  return NextResponse.json(data);
}
