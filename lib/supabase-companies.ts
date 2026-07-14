export type CompanyRow = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function mapCompanyRow(row: Record<string, unknown>): CompanyRow {
  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ""),
    contactPerson: String(row.contact_person ?? ""),
    email: String(row.email ?? ""),
    phone: row.phone ? String(row.phone) : null,
    notes: row.notes ? String(row.notes) : null,
    status: row.status ? String(row.status) : "new",
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}
