// src/lib/global-customer-auth.ts
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
const SECRET = new TextEncoder().encode(secret);

export interface GlobalCustomerSession {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export async function createGlobalCustomerSession(data: GlobalCustomerSession) {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("gc_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getGlobalCustomerSession(): Promise<GlobalCustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gc_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as GlobalCustomerSession;
  } catch {
    return null;
  }
}

export async function clearGlobalCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete("gc_token");
}
