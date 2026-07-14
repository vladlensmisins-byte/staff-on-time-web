import { NextRequest, NextResponse } from "next/server";
import { isValidCompanyStatus } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapCompanyRow } from "@/lib/supabase-companies";

export const runtime = "edge";

type UpdateBody = {
  id?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string | null;
  notes?: string | null;
  status?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateBody;
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (body.companyName !== undefined) {
      const companyName = body.companyName.trim();
      if (!companyName) {
        return NextResponse.json({ error: "Company name is required" }, { status: 400 });
      }
      updates.company_name = companyName;
    }

    if (body.contactPerson !== undefined) {
      updates.contact_person = body.contactPerson.trim();
    }

    if (body.email !== undefined) {
      updates.email = body.email.trim();
    }

    if (body.phone !== undefined) {
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      updates.phone = phone || null;
    }

    if (body.notes !== undefined) {
      const notes = typeof body.notes === "string" ? body.notes.trim() : "";
      updates.notes = notes || null;
    }

    if (body.status !== undefined) {
      const status = body.status.trim();
      if (!isValidCompanyStatus(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Company update failed:", error.message);
      return NextResponse.json({ error: "Could not update company" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, company: mapCompanyRow(data) });
  } catch (err) {
    console.error("POST /api/admin-update-company error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
