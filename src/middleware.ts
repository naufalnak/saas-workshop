// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Route operator dashboard
  const isOperatorRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/customers") ||
    path.startsWith("/vehicles") ||
    path.startsWith("/services") ||
    path.startsWith("/invoices") ||
    path.startsWith("/bookings") ||
    path.startsWith("/settings");

  // Route auth operator
  const isOperatorAuthRoute =
    path.startsWith("/login") || path.startsWith("/register");

  // Cek operator session via JWT (edge-compatible)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isOperatorLoggedIn = !!token;

  // Proteksi operator dashboard
  if (isOperatorRoute && !isOperatorLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect operator yang sudah login dari auth page
  if (isOperatorAuthRoute && isOperatorLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Customer routes (/akun) — handle di page level via server component
  // Tidak perlu cek di middleware karena pakai cookie httpOnly biasa

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
