// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isOperatorRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/customers") ||
    path.startsWith("/vehicles") ||
    path.startsWith("/services") ||
    path.startsWith("/invoices") ||
    path.startsWith("/bookings") ||
    path.startsWith("/laporan") || // ← fix: tambah /laporan
    path.startsWith("/settings");

  const isOperatorAuthRoute =
    path.startsWith("/login") || path.startsWith("/register");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const isOperatorLoggedIn = !!token;

  if (isOperatorRoute && !isOperatorLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isOperatorAuthRoute && isOperatorLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
