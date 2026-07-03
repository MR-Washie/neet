import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isTargetAdmin = token?.email === "mdragib.mth2005@gmail.com";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // If they are attempting to view admin pages but the account doesn't match
    if (isAdminRoute && !isTargetAdmin) {
      // Redirect them cleanly to an unauthenticated landing page or main page
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Blocks users immediately if they aren't signed into any profile at all
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect everything inside the admin folder explicitly
export const config = {
  matcher: ["/admin/:path*"],
};