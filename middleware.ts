import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated, allow the request
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect these routes - users must be logged in to access them
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/neet/:path*",
    "/practice/:path*",
    "/analytics/:path*",
    "/profile/:path*",
    "/take-test/:path*",
  ],
};
