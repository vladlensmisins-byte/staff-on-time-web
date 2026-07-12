import { NextResponse } from "next/server";
import { isPushConfigured } from "@/lib/push-config";
import { sendTestPush } from "@/lib/web-push-server";

export const runtime = "nodejs";

export async function POST() {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Push notifications are not configured (missing VAPID keys)." },
      { status: 503 },
    );
  }

  try {
    await sendTestPush();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin-test-push error:", err);
    const message =
      err instanceof Error && err.message === "No active push subscriptions"
        ? "Kein aktives Push-Abonnement. Bitte zuerst Benachrichtigungen aktivieren."
        : "Test push could not be sent.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
