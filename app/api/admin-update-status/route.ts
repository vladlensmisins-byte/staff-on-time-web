import { NextRequest, NextResponse } from "next/server";
import { isValidSubmissionStatus } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; status?: string };
    const id = body.id?.trim();
    const status = body.status?.trim();

    if (!id || !status || !isValidSubmissionStatus(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("submissions").update({ status }).eq("id", id);

    if (error) {
      console.error("Status update failed:", error.message);
      return NextResponse.json({ error: "Could not update status" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, status });
  } catch (err) {
    console.error("POST /api/admin-update-status error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
