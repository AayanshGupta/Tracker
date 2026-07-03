/**
 * middleware.ts — Edge-layer route protection for Task Tracker
 *
 * Runs on every request before it reaches the Next.js application.
 * Unauthenticated users hitting any protected route are redirected to /login.
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Routes that are always public — no authentication required. */
const PUBLIC_ROUTES = ["/login", "/forgot-password"];

/** Prefix for Next.js API routes and static assets — always allowed. */
const ALWAYS_ALLOWED_PREFIXES = [
  "/api/auth", // NextAuth callback & CSRF endpoints
  "/_next/",   // Next.js static assets
  "/favicon",
  "/icons",
  "/images",
];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Allow static assets and auth API routes unconditionally
  if (ALWAYS_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // If the user has a session, allow through
  if (req.auth) {
    return NextResponse.next();
  }

  // No session — redirect to login, preserving the intended destination
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
});

/** Middleware matcher — run on all routes except Next.js internals */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
