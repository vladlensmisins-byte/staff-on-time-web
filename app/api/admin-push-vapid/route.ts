import { NextResponse } from "next/server";
import { getVapidPublicKeyForClient, isPushConfigured } from "@/lib/push-config";

export const runtime = "edge";

export async function GET() {
  if (!isPushConfigured()) {
    return NextResponse.json({ enabled: false, publicKey: null });
  }

  return NextResponse.json({
    enabled: true,
    publicKey: getVapidPublicKeyForClient(),
  });
}
