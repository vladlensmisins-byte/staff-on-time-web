import { NextRequest, NextResponse } from "next/server";
import {
  addAdminComment,
  parseAdminComments,
  serializeAdminComments,
} from "@/lib/admin-comments";
import { isValidCompanyStatus } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapCompanyRow } from "@/lib/supabase-companies";

export const runtime = "edge";

type CreateBody = {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  notes?: string;
  status?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBody;
    const companyName = body.companyName?.trim();
    const contactPerson = body.contactPerson?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() || null;
    const initialNote = body.notes?.trim() || null;
    const status = body.status?.trim() || "new";

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    if (!isValidCompanyStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const notes = initialNote
      ? serializeAdminComments(addAdminComment([], initialNote))
      : null;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("companies")
      .insert({
        company_name: companyName,
        contact_person: contactPerson,
        email,
        phone,
        notes,
        status,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Company create failed:", error.message);
      return NextResponse.json({ error: "Could not create company" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, company: mapCompanyRow(data) });
  } catch (err) {
    console.error("POST /api/admin-create-company error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
