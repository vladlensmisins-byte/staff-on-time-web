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
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}
