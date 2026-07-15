import { parseCompanyTermin } from "@/lib/company-termin";
import type { CompanyRow } from "@/lib/supabase-companies";
import type { SubmissionRow } from "@/lib/supabase-admin";
import type { TerminRow } from "@/lib/supabase-termins";

export type ScheduleEntry =
  | {
      kind: "applicant";
      source: "submission";
      id: string;
      date: string;
      time: string | null;
      title: string;
      phone: string;
      interviewType: string | null;
    }
  | {
      kind: "business";
      source: "company";
      id: string;
      date: string;
      time: string | null;
      title: string;
      contactPerson: string;
      phone: string | null;
      email: string;
      notes: string | null;
    }
  | {
      kind: "applicant" | "business";
      source: "manual";
      id: string;
      date: string;
      time: string | null;
      title: string;
      contactPerson: string;
      phone: string | null;
      email: string;
      notes: string | null;
    };

function sortTime(time: string | null): string {
  return time ? time.slice(0, 5) : "99:99";
}

export function scheduleEntryKey(entry: ScheduleEntry): string {
  return `${entry.source}-${entry.kind}-${entry.id}`;
}

export function buildScheduleEntries(
  submissions: SubmissionRow[],
  companies: CompanyRow[],
  termins: TerminRow[] = [],
): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];

  for (const row of submissions) {
    if (!row.interviewDate) continue;
    entries.push({
      kind: "applicant",
      source: "submission",
      id: row.id,
      date: row.interviewDate,
      time: row.interviewTime ? row.interviewTime.slice(0, 5) : null,
      title: `${row.firstName} ${row.lastName}`.trim(),
      phone: row.phone,
      interviewType: row.interviewType,
    });
  }

  for (const company of companies) {
    const hasLinkedTermin = termins.some((termin) => termin.companyId === company.id);
    if (hasLinkedTermin) continue;

    const notesText = company.adminComments.map((comment) => comment.text).join("\n");
    const parsed = parseCompanyTermin(notesText || null);
    if (!parsed) continue;
    entries.push({
      kind: "business",
      source: "company",
      id: company.id,
      date: parsed.date,
      time: parsed.time,
      title: company.companyName,
      contactPerson: company.contactPerson,
      phone: company.phone,
      email: company.email,
      notes: notesText || null,
    });
  }

  for (const termin of termins) {
    if (!termin.terminDate) continue;
    entries.push({
      kind: termin.kind,
      source: "manual",
      id: termin.id,
      date: termin.terminDate,
      time: termin.terminTime,
      title: termin.title,
      contactPerson: termin.contactPerson,
      phone: termin.phone,
      email: termin.email ?? "",
      notes: termin.notes,
    });
  }

  return entries;
}

export function groupScheduleByDate(entries: ScheduleEntry[]): Map<string, ScheduleEntry[]> {
  const map = new Map<string, ScheduleEntry[]>();

  for (const entry of entries) {
    const existing = map.get(entry.date) ?? [];
    existing.push(entry);
    map.set(entry.date, existing);
  }

  for (const rows of map.values()) {
    rows.sort((a, b) => sortTime(a.time).localeCompare(sortTime(b.time)));
  }

  return map;
}

export function countScheduleDates(
  submissions: SubmissionRow[],
  companies: CompanyRow[],
  termins: TerminRow[] = [],
): Map<string, number> {
  const entries = buildScheduleEntries(submissions, companies, termins);
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.date, (counts.get(entry.date) ?? 0) + 1);
  }

  return counts;
}
