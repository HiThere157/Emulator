import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow access to login/logout pages and Next.js files
  if (
    pathname === "/manifest.json" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon_192.png" ||
    pathname === "/maskable_icon_192.png" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  // Allow access to all other pages if the user is logged in
  if (request.cookies.get("login_info")) {
    return NextResponse.next();
  }

  // Redirect to login page if the user is not logged in
  const url = new URL("/auth/login", request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}
