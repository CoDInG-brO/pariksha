import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/student/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname === "/student" || pathname === "/student/") {
    const url = req.nextUrl.clone();
    url.pathname = "/student/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/student")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/student/, "") || "/";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*"],
};
