export type TerminKind = "business" | "applicant";

export type TerminRow = {
  id: string;
  title: string;
  terminDate: string;
  terminTime: string | null;
  kind: TerminKind;
  contactPerson: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapTerminRow(row: Record<string, unknown>): TerminRow {
  const kind = row.kind === "applicant" ? "applicant" : "business";
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    terminDate: String(row.termin_date ?? ""),
    terminTime: row.termin_time ? String(row.termin_time).slice(0, 5) : null,
    kind,
    contactPerson: String(row.contact_person ?? ""),
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    notes: row.notes ? String(row.notes) : null,
    companyId: row.company_id ? String(row.company_id) : null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export type CreateTerminPayload = {
  title?: string;
  terminDate: string;
  terminTime?: string;
  kind?: TerminKind;
  contactPerson?: string;
  phone?: string;
  email?: string;
  notes?: string;
  companyId?: string;
};

export async function submitAdminTermin(
  payload: CreateTerminPayload,
  editingId?: string | null,
): Promise<TerminRow> {
  const endpoint = editingId ? "/api/admin-update-termin" : "/api/admin-create-termin";
  const body = editingId ? { id: editingId, ...payload } : payload;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    termin?: TerminRow;
    error?: string;
  };
  if (!res.ok || !data.termin) {
    throw new Error(data.error || "Termin konnte nicht gespeichert werden.");
  }
  return data.termin;
}

export function buildTerminPayloadFromCompany(
  company: {
    id: string;
    companyName: string;
    contactPerson: string;
    phone: string | null;
    email: string;
  },
  terminDate: string,
  terminTime?: string,
): CreateTerminPayload {
  return {
    title: company.companyName,
    terminDate,
    terminTime,
    kind: "business",
    contactPerson: company.contactPerson || undefined,
    phone: company.phone || undefined,
    email: company.email || undefined,
    companyId: company.id,
  };
}
