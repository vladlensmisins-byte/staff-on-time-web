import { fmtDateKey } from "@/lib/interview-slots";
import type { SubmissionRow } from "@/lib/supabase-admin";

const COMPLETED_STATUSES = new Set(["contacted", "hired", "rejected"]);

function isCompletedStatus(status: string): boolean {
  return COMPLETED_STATUSES.has(status);
}

function normalizeTime(time: string | null): string {
  if (!time) return "99:99";
  return time.slice(0, 5);
}

function compareInterviewSchedule(a: SubmissionRow, b: SubmissionRow, today: string): number {
  const aDate = a.interviewDate ?? "9999-12-31";
  const bDate = b.interviewDate ?? "9999-12-31";

  const aToday = aDate === today ? 0 : 1;
  const bToday = bDate === today ? 0 : 1;
  if (aToday !== bToday) return aToday - bToday;

  if (aDate !== bDate) return aDate.localeCompare(bDate);

  const timeCmp = normalizeTime(a.interviewTime).localeCompare(normalizeTime(b.interviewTime));
  if (timeCmp !== 0) return timeCmp;

  return a.submittedAt.localeCompare(b.submittedAt);
}

export function sortLeadsForAdmin(
  rows: SubmissionRow[],
  dateFilter: string = "all",
  now = new Date(),
): SubmissionRow[] {
  const today = fmtDateKey(now);

  return [...rows].sort((a, b) => {
    const aDone = isCompletedStatus(a.status);
    const bDone = isCompletedStatus(b.status);
    if (aDone !== bDone) return aDone ? 1 : -1;

    if (dateFilter !== "all") {
      const timeCmp = normalizeTime(a.interviewTime).localeCompare(normalizeTime(b.interviewTime));
      if (timeCmp !== 0) return timeCmp;
      return a.submittedAt.localeCompare(b.submittedAt);
    }

    return compareInterviewSchedule(a, b, today);
  });
}

export function isCompletedLeadStatus(status: string): boolean {
  return COMPLETED_STATUSES.has(status);
}
