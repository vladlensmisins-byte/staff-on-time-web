import { NextRequest, NextResponse } from "next/server";
import { CV_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";
import { parseCvPaths } from "@/lib/cv-paths";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: row, error: fetchError } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Submission fetch failed:", fetchError.message);
      return NextResponse.json({ error: "Could not find submission" }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const cvPaths = parseCvPaths(row.cv_path ? String(row.cv_path) : null);
    if (cvPaths.length > 0) {
      const { error: storageError } = await supabase.storage.from(CV_BUCKET).remove(cvPaths);
      if (storageError) {
        console.error("CV delete failed:", storageError.message);
      }
    }

    if (row.interview_date && row.interview_time) {
      const { error: slotError } = await supabase
        .from("slots")
        .delete()
        .eq("interview_date", row.interview_date)
        .eq("interview_time", row.interview_time);
      if (slotError) {
        console.error("Slot delete failed:", slotError.message);
      }
    }

    const { error: deleteError } = await supabase.from("submissions").delete().eq("id", id);

    if (deleteError) {
      console.error("Submission delete failed:", deleteError.message);
      return NextResponse.json({ error: "Could not delete submission" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/admin-delete-submission error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
