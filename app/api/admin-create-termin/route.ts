import { NextRequest, NextResponse } from "next/server";
import { isValidTerminKind } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapTerminRow } from "@/lib/supabase-termins";

export const runtime = "edge";

type CreateBody = {
  title?: string;
  terminDate?: string;
  terminTime?: string;
  kind?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBody;
    const title = body.title?.trim();
    const terminDate = body.terminDate?.trim();
    const terminTime = body.terminTime?.trim() || null;
    const kind = body.kind?.trim() || "business";
    const contactPerson = body.contactPerson?.trim() ?? "";
    const phone = body.phone?.trim() || null;
    const email = body.email?.trim() || null;
    const notes = body.notes?.trim() || null;

    if (!title || !terminDate) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    if (!isValidTerminKind(kind)) {
      return NextResponse.json({ error: "Invalid termin kind" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("termins")
      .insert({
        title,
        termin_date: terminDate,
        termin_time: terminTime,
        kind,
        contact_person: contactPerson,
        phone,
        email,
        notes,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Termin create failed:", error.message);
      return NextResponse.json({ error: "Could not create termin" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, termin: mapTerminRow(data) });
  } catch (err) {
    console.error("POST /api/admin-create-termin error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
