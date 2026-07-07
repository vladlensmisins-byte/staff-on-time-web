import { NextResponse } from "next/server";
import { ADMIN_CV_SIGNED_TTL } from "@/lib/admin-auth";
import { getSupabaseAdmin, mapSubmissionRow } from "@/lib/supabase-admin";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Failed to load submissions:", error.message);
      return NextResponse.json({ error: "Could not load submissions" }, { status: 500 });
    }

    const submissions = await Promise.all(
      (data ?? []).map((row) => mapSubmissionRow(supabase, row, ADMIN_CV_SIGNED_TTL)),
    );

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("GET /api/admin-submissions error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
