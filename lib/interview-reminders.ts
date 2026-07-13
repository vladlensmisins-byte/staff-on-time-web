import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  sendInterviewReminderPush,
  type InterviewReminderPushPayload,
} from "@/lib/web-push-server";
import { isPushConfigured } from "@/lib/push-config";

const BERLIN_TZ = "Europe/Berlin";
/** Allow cron drift: remind when interview is 25–35 minutes away. */
const WINDOW_MIN = 25;
const WINDOW_MAX = 35;

function berlinNowParts(date = new Date()): { dateKey: string; minutesOfDay: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BERLIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));

  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutesOfDay: hour * 60 + minute,
  };
}

function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + days));
  return `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
}

function isInReminderWindow(
  interviewDate: string,
  interviewTime: string,
  now: ReturnType<typeof berlinNowParts>,
): boolean {
  const interviewMinutes = parseTimeToMinutes(interviewTime);
  if (interviewMinutes == null) return false;

  let interviewTotal: number | null = null;
  if (interviewDate === now.dateKey) {
    interviewTotal = interviewMinutes;
  } else if (interviewDate === addDaysToDateKey(now.dateKey, 1)) {
    interviewTotal = interviewMinutes + 24 * 60;
  } else if (interviewDate === addDaysToDateKey(now.dateKey, -1)) {
    interviewTotal = interviewMinutes - 24 * 60;
  }

  if (interviewTotal == null) return false;
  const minutesUntil = interviewTotal - now.minutesOfDay;
  return minutesUntil >= WINDOW_MIN && minutesUntil <= WINDOW_MAX;
}

export type ReminderRunResult = {
  checked: number;
  sent: number;
  skipped: number;
  errors: string[];
};

export async function runInterviewReminderJob(): Promise<ReminderRunResult> {
  const result: ReminderRunResult = { checked: 0, sent: 0, skipped: 0, errors: [] };

  if (!isPushConfigured()) {
    result.errors.push("Push is not configured");
    return result;
  }

  const now = berlinNowParts();
  const today = now.dateKey;
  const tomorrow = addDaysToDateKey(today, 1);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id,first_name,last_name,phone,interview_date,interview_time,interview_type,status,interview_reminder_sent_at",
    )
    .in("interview_date", [today, tomorrow])
    .not("interview_time", "is", null)
    .neq("status", "rejected");

  if (error) {
    if (error.message.includes("interview_reminder_sent_at")) {
      const fallback = await supabase
        .from("submissions")
        .select("id,first_name,last_name,phone,interview_date,interview_time,interview_type,status")
        .in("interview_date", [today, tomorrow])
        .not("interview_time", "is", null)
        .neq("status", "rejected");

      if (fallback.error) throw new Error(fallback.error.message);
      return processRows(fallback.data ?? [], now, result, false);
    }
    throw new Error(error.message);
  }

  return processRows(data ?? [], now, result, true);
}

async function processRows(
  rows: Array<Record<string, unknown>>,
  now: ReturnType<typeof berlinNowParts>,
  result: ReminderRunResult,
  canMarkSent: boolean,
): Promise<ReminderRunResult> {
  const supabase = getSupabaseAdmin();
  result.checked = rows.length;

  for (const row of rows) {
    const id = String(row.id ?? "");
    const interviewDate = row.interview_date ? String(row.interview_date) : "";
    const interviewTime = row.interview_time ? String(row.interview_time) : "";
    if (!id || !interviewDate || !interviewTime) {
      result.skipped += 1;
      continue;
    }

    if (row.interview_reminder_sent_at) {
      result.skipped += 1;
      continue;
    }

    if (!isInReminderWindow(interviewDate, interviewTime, now)) {
      result.skipped += 1;
      continue;
    }

    const payload: InterviewReminderPushPayload = {
      id,
      firstName: String(row.first_name ?? ""),
      lastName: String(row.last_name ?? ""),
      phone: String(row.phone ?? ""),
      interviewDate,
      interviewTime,
      interviewType: String(row.interview_type ?? "live"),
    };

    try {
      await sendInterviewReminderPush(payload);
      if (canMarkSent) {
        const { error: updateError } = await supabase
          .from("submissions")
          .update({ interview_reminder_sent_at: new Date().toISOString() })
          .eq("id", id);
        if (updateError) {
          result.errors.push(`mark ${id}: ${updateError.message}`);
        }
      }
      result.sent += 1;
    } catch (err) {
      result.errors.push(`${id}: ${err instanceof Error ? err.message : "send failed"}`);
    }
  }

  return result;
}
