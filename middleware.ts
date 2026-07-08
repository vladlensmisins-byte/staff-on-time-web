import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let authenticated = false;
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    authenticated = await verifyAdminSessionToken(token);
  } catch {
    authenticated = false;
  }

  if (pathname.startsWith("/api/admin-")) {
    if (pathname === "/api/admin-login") {
      return NextResponse.next();
    }
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    if (!authenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin-login",
    "/api/admin-logout",
    "/api/admin-submissions",
    "/api/admin-update-status",
    "/api/admin-update-note",
    "/api/admin-delete-submission",
  ],
};
