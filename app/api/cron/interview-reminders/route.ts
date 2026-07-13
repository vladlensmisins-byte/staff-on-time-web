import { NextRequest, NextResponse } from "next/server";
import { runInterviewReminderJob } from "@/lib/interview-reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const notifySecret = process.env.INTERNAL_NOTIFY_SECRET?.trim();
  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const headerSecret = request.headers.get("x-cron-secret")?.trim();
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (cronSecret && (bearer === cronSecret || headerSecret === cronSecret)) return true;
  if (notifySecret && (bearer === notifySecret || headerSecret === notifySecret)) return true;
  if (isVercelCron && (!cronSecret || bearer === cronSecret)) return true;
  if (!cronSecret && !notifySecret && process.env.NODE_ENV !== "production") return true;

  return false;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runInterviewReminderJob();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Interview reminder cron failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reminder job failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
