import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; adminNote?: string | null };
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const adminNote =
      typeof body.adminNote === "string" ? body.adminNote.trim().slice(0, 2000) : null;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("submissions").update({ admin_note: adminNote }).eq("id", id);

    if (error) {
      console.error("Admin note update failed:", error.message);
      return NextResponse.json({ error: "Could not update note" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, adminNote });
  } catch (err) {
    console.error("POST /api/admin-update-note error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
