import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapCompanyRow } from "@/lib/supabase-companies";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load companies:", error.message);
      return NextResponse.json({ error: "Could not load companies" }, { status: 500 });
    }

    const companies = (data ?? []).map((row) => mapCompanyRow(row));
    return NextResponse.json({ companies });
  } catch (err) {
    console.error("GET /api/admin-companies error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
