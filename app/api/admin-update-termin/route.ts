import { NextRequest, NextResponse } from "next/server";
import { isValidTerminKind } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapTerminRow } from "@/lib/supabase-termins";

export const runtime = "edge";

type UpdateBody = {
  id?: string;
  title?: string;
  terminDate?: string;
  terminTime?: string | null;
  kind?: string;
  contactPerson?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateBody;
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = body.title.trim();
      if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
      updates.title = title;
    }

    if (body.terminDate !== undefined) {
      const terminDate = body.terminDate.trim();
      if (!terminDate) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
      }
      updates.termin_date = terminDate;
    }

    if (body.terminTime !== undefined) {
      const terminTime = typeof body.terminTime === "string" ? body.terminTime.trim() : "";
      updates.termin_time = terminTime || null;
    }

    if (body.kind !== undefined) {
      const kind = body.kind.trim();
      if (!isValidTerminKind(kind)) {
        return NextResponse.json({ error: "Invalid termin kind" }, { status: 400 });
      }
      updates.kind = kind;
    }

    if (body.contactPerson !== undefined) {
      updates.contact_person = body.contactPerson.trim();
    }

    if (body.phone !== undefined) {
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      updates.phone = phone || null;
    }

    if (body.email !== undefined) {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      updates.email = email || null;
    }

    if (body.notes !== undefined) {
      const notes = typeof body.notes === "string" ? body.notes.trim() : "";
      updates.notes = notes || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("termins")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Termin update failed:", error.message);
      return NextResponse.json({ error: "Could not update termin" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Termin not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, termin: mapTerminRow(data) });
  } catch (err) {
    console.error("POST /api/admin-update-termin error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
