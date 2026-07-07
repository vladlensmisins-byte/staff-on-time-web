export const INTERVIEW_FIRST_SATURDAY = "2026-07-11";
export const INTERVIEW_SATURDAY_COUNT = 16;

const SLOT_START_MINUTES = 11 * 60;
const SLOT_END_MINUTES = 20 * 60;
const SLOT_INTERVAL_MINUTES = 30;

export function buildInterviewTimeSlots(): string[] {
  const slots: string[] = [];
  for (let total = SLOT_START_MINUTES; total <= SLOT_END_MINUTES; total += SLOT_INTERVAL_MINUTES) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  return slots;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function fmtDateKey(date: Date): string {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export function getUpcomingInterviewSaturdays(
  count = INTERVIEW_SATURDAY_COUNT,
  now = new Date(),
): Date[] {
  const dates: Date[] = [];
  const start = parseDateKey(INTERVIEW_FIRST_SATURDAY);
  start.setHours(0, 0, 0, 0);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let cursor = new Date(Math.max(start.getTime(), today.getTime()));
  while (cursor.getDay() !== 6) {
    cursor.setDate(cursor.getDate() + 1);
  }

  for (let i = 0; i < count; i++) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }

  return dates;
}

export function isValidInterviewDate(dateKey: string, now = new Date()): boolean {
  const date = parseDateKey(dateKey);
  if (Number.isNaN(date.getTime())) return false;
  if (date.getDay() !== 6) return false;

  const start = parseDateKey(INTERVIEW_FIRST_SATURDAY);
  start.setHours(0, 0, 0, 0);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (date < start || date < today) return false;

  const offered = new Set(
    getUpcomingInterviewSaturdays(INTERVIEW_SATURDAY_COUNT, now).map(fmtDateKey),
  );
  return offered.has(dateKey);
}

export function isValidInterviewTime(time: string): boolean {
  return buildInterviewTimeSlots().includes(time.trim());
}
