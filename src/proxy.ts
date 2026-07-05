import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isTargetAdmin = token?.email === "mdragib.mth2005@gmail.com";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginRoute = req.nextUrl.pathname === "/login";

    // 1. If logged in and trying to access /login, redirect to home
    if (token && isLoginRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. If trying to access admin routes and NOT the admin, redirect to home
    if (isAdminRoute && !isTargetAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This protects the defined routes in the matcher.
      // If authorized returns false, NextAuth automatically redirects to /login.
      authorized: ({ token, req }) => {
        const isLoginRoute = req.nextUrl.pathname === "/login";
        
        // If it's the login page, always allow access (so they can sign in)
        if (isLoginRoute) return true;
        
        // For everything else (including /admin), they MUST be logged in
        return !!token;
      },
    },
  }
);

export const config = {
  // Apply this middleware to admin routes AND the login page
  matcher: ["/admin/:path*", "/login"],
};