import { NextRequest, NextResponse } from "next/server";
import type { NewLeadPushPayload } from "@/lib/web-push-server";
import { sendNewLeadPush } from "@/lib/web-push-server";

export const runtime = "nodejs";

function getNotifySecret(): string | null {
  return process.env.INTERNAL_NOTIFY_SECRET?.trim() || null;
}

export async function POST(request: NextRequest) {
  const secret = getNotifySecret();
  if (secret) {
    const provided = request.headers.get("x-notify-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = (await request.json()) as NewLeadPushPayload;
    await sendNewLeadPush(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/notify-new-lead error:", err);
    return NextResponse.json({ error: "Push notification failed" }, { status: 500 });
  }
}
