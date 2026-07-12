import { NextResponse } from "next/server";
import { countPushSubscriptions } from "@/lib/push-subscriptions";
import { isPushConfigured } from "@/lib/push-config";

export const runtime = "nodejs";

export async function GET() {
  const enabled = isPushConfigured();
  let subscriptionCount = 0;

  if (enabled) {
    try {
      subscriptionCount = await countPushSubscriptions();
    } catch {
      subscriptionCount = 0;
    }
  }

  return NextResponse.json({
    enabled,
    subscriptionCount,
    startUrl: "/admin",
  });
}
