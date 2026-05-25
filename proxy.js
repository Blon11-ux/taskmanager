import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionCookie = request.cookies.get("session_user_id");
  const isLoggedIn = !!sessionCookie?.value;

  const { pathname } = request.nextUrl;

  if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth"],
};