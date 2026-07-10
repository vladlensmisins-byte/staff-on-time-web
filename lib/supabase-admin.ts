import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { parseAdminComments, type AdminComment } from "@/lib/admin-comments";
import { parseCvPaths } from "@/lib/cv-paths";

const CV_BUCKET = "cv-uploads";

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(url, key);
}

export { CV_BUCKET };

export type SubmissionRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string | null;
  fieldOfStudy: string | null;
  workExp: string | null;
  langSkills: Record<string, string> | null;
  otherLang: string | null;
  industries: string[];
  licenses: string[];
  forklift: string | null;
  visaType: string | null;
  interviewDate: string | null;
  interviewTime: string | null;
  interviewType: string | null;
  submittedAt: string;
  status: string;
  adminComments: AdminComment[];
  cvName: string | null;
  cvDownloadUrl: string | null;
  cvFiles: Array<{ name: string; downloadUrl: string }>;
};

export async function mapSubmissionRow(
  supabase: SupabaseClient,
  row: Record<string, unknown>,
  cvSignedTtl: number,
): Promise<SubmissionRow> {
  let cvDownloadUrl: string | null = null;
  const cvFiles: Array<{ name: string; downloadUrl: string }> = [];
  const storedCvPaths = parseCvPaths(row.cv_path ? String(row.cv_path) : null);

  for (const storagePath of storedCvPaths) {
    const { data: signed } = await supabase.storage
      .from(CV_BUCKET)
      .createSignedUrl(storagePath, cvSignedTtl);
    if (!signed?.signedUrl) continue;
    const name = storagePath.split("/").pop() ?? "CV";
    cvFiles.push({ name, downloadUrl: signed.signedUrl });
  }

  if (cvFiles.length > 0) {
    cvDownloadUrl = cvFiles[0].downloadUrl;
  }

  const langSkills = row.lang_skills as Record<string, string> | null;
  const submittedAt = String(row.submitted_at ?? "");
  const adminComments = parseAdminComments(
    row.admin_note ? String(row.admin_note) : null,
    submittedAt || null,
  );

  return {
    id: String(row.id),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    birthDate: row.birth_date ? String(row.birth_date) : null,
    fieldOfStudy: row.field_of_study ? String(row.field_of_study) : null,
    workExp: row.work_exp ? String(row.work_exp) : null,
    langSkills,
    otherLang: row.other_lang ? String(row.other_lang) : null,
    industries: Array.isArray(row.industries) ? (row.industries as string[]) : [],
    licenses: Array.isArray(row.licenses) ? (row.licenses as string[]) : [],
    forklift: row.forklift ? String(row.forklift) : null,
    visaType: row.visa_type ? String(row.visa_type) : null,
    interviewDate: row.interview_date ? String(row.interview_date) : null,
    interviewTime: row.interview_time ? String(row.interview_time) : null,
    interviewType: row.interview_type ? String(row.interview_type) : null,
    submittedAt,
    status: row.status ? String(row.status) : "new",
    adminComments,
    cvName: cvFiles[0]?.name ?? null,
    cvDownloadUrl,
    cvFiles,
  };
}
