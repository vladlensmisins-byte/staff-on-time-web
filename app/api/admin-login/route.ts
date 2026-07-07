import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  signAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim() ?? "";

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const token = await signAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("POST /api/admin-login error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
