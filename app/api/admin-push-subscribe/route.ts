import { NextRequest, NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/push-subscriptions";

export const runtime = "nodejs";

type PushSubscriptionPayload = {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PushSubscriptionPayload;
    const endpoint = body.endpoint?.trim();
    const p256dh = body.keys?.p256dh?.trim();
    const auth = body.keys?.auth?.trim();

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Invalid push subscription" }, { status: 400 });
    }

    await savePushSubscription(
      { endpoint, p256dh, auth },
      request.headers.get("user-agent") ?? undefined,
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin-push-subscribe error:", err);
    return NextResponse.json({ error: "Could not save push subscription" }, { status: 500 });
  }
}
