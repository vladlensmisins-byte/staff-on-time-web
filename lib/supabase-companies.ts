import { parseAdminComments, type AdminComment } from "@/lib/admin-comments";

export type CompanyRow = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  status: string;
  adminComments: AdminComment[];
  createdAt: string;
  updatedAt: string;
};

export function mapCompanyRow(row: Record<string, unknown>): CompanyRow {
  const createdAt = String(row.created_at ?? "");
  const adminComments = parseAdminComments(
    row.notes ? String(row.notes) : null,
    createdAt || null,
  );

  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ""),
    contactPerson: String(row.contact_person ?? ""),
    email: String(row.email ?? ""),
    phone: row.phone ? String(row.phone) : null,
    status: row.status ? String(row.status) : "new",
    adminComments,
    createdAt,
    updatedAt: String(row.updated_at ?? ""),
  };
}
