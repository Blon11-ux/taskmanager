// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const sessionCookie = request.cookies.get("session_user_id");
  const isLoggedIn = !!sessionCookie?.value;

  const { pathname } = request.nextUrl;

  // If logged in and trying to visit /auth, redirect home
  if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to visit /, redirect to /auth
  if (!isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

// Tell Next.js which routes this middleware runs on
export const config = {
  matcher: ["/", "/auth"],
};