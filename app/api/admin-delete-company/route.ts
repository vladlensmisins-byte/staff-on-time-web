import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) {
      console.error("Company delete failed:", error.message);
      return NextResponse.json({ error: "Could not delete company" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/admin-delete-company error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
