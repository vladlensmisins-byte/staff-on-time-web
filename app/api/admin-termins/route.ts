import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapTerminRow } from "@/lib/supabase-termins";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("termins")
      .select("*")
      .order("termin_date", { ascending: true })
      .order("termin_time", { ascending: true, nullsFirst: false });

    if (error) {
      console.error("Failed to load termins:", error.message);
      return NextResponse.json({ error: "Could not load termins" }, { status: 500 });
    }

    const termins = (data ?? []).map((row) => mapTerminRow(row));
    return NextResponse.json({ termins });
  } catch (err) {
    console.error("GET /api/admin-termins error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
