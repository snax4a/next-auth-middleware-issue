import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/*
 * This middleware never runs on /api/auth/signin page
 * I would like to redirect from sign in page if user is authenticated.
 * Same happens with custom sign in page - middleware skips it.
 */
export default withAuth(
  function middleware(req) {
    console.log("[MIDDLEWARE]: custom middleware runs...");

    const hasToken = req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname === "/api/auth/signin";

    if (isLoginPage && hasToken) {
      req.nextUrl.pathname = "/me";
      // redirect to /me page because user is already logged in
      return NextResponse.redirect(new URL("/me", req.nextUrl));
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        console.log("[MIDDLEWARE]: authorized callback runs...");

        // `/admin` requires admin role
        if (req.nextUrl.pathname === "/admin") {
          return token?.userRole === "admin";
        }
        // `/me` only requires the user to be logged in
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/admin", "/me", "/api/auth/signin"] };
