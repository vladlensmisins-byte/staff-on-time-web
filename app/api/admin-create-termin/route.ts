import { NextRequest, NextResponse } from "next/server";
import { isValidTerminKind } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapTerminRow } from "@/lib/supabase-termins";
import { defaultTerminTitle, mapTerminDbError, normalizeTerminDate } from "@/lib/termin-date";

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
  companyId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBody;
    const kind = body.kind?.trim() || "business";
    const terminDate = normalizeTerminDate(body.terminDate);
    const terminTime = body.terminTime?.trim() || null;
    const contactPerson = body.contactPerson?.trim() ?? "";
    const phone = body.phone?.trim() || null;
    const email = body.email?.trim() || null;
    const notes = body.notes?.trim() || null;
    const title = defaultTerminTitle(kind, body.title);
    const companyId = body.companyId?.trim() || null;

    if (!terminDate) {
      return NextResponse.json({ error: "Bitte ein gültiges Datum angeben." }, { status: 400 });
    }

    if (!isValidTerminKind(kind)) {
      return NextResponse.json({ error: "Ungültige Termin-Art." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const baseRow = {
      title,
      termin_date: terminDate,
      termin_time: terminTime,
      kind,
      contact_person: contactPerson,
      phone,
      email,
      notes,
    };

    let result = await supabase
      .from("termins")
      .insert(companyId ? { ...baseRow, company_id: companyId } : baseRow)
      .select("*")
      .single();

    if (result.error && companyId && result.error.message.toLowerCase().includes("company_id")) {
      result = await supabase.from("termins").insert(baseRow).select("*").single();
    }

    const { data, error } = result;

    if (error) {
      console.error("Termin create failed:", error.message);
      return NextResponse.json(
        { error: mapTerminDbError(error.message) },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, termin: mapTerminRow(data) });
  } catch (err) {
    console.error("POST /api/admin-create-termin error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
