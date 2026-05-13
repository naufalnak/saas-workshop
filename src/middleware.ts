// src/middleware.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  const isDashboard =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/customers") ||
    nextUrl.pathname.startsWith("/vehicles") ||
    nextUrl.pathname.startsWith("/services") ||
    nextUrl.pathname.startsWith("/invoices");

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
