export type CompanyTermin = {
  date: string;
  time: string | null;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function hasTerminKeyword(notes: string | null): boolean {
  if (!notes) return false;
  return /\btermin\b/i.test(notes);
}

export function parseCompanyTermin(notes: string | null): CompanyTermin | null {
  if (!hasTerminKeyword(notes)) return null;

  const text = notes ?? "";
  let date: string | null = null;

  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) {
    date = `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  if (!date) {
    const german = text.match(/\b(\d{1,2})\.(\d{1,2})\.(20\d{2}|\d{2})\b/);
    if (german) {
      const day = Number(german[1]);
      const month = Number(german[2]);
      let year = Number(german[3]);
      if (year < 100) year += 2000;
      date = toIsoDate(year, month, day);
    }
  }

  if (!date) return null;

  let time: string | null = null;
  const clock = text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (clock) {
    const hours = Number(clock[1]);
    const minutes = Number(clock[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      time = `${pad2(hours)}:${pad2(minutes)}`;
    }
  } else {
    const hourOnly = text.match(/\b(\d{1,2})\s*uhr\b/i);
    if (hourOnly) {
      const hours = Number(hourOnly[1]);
      if (hours >= 0 && hours <= 23) {
        time = `${pad2(hours)}:00`;
      }
    }
  }

  return { date, time };
}
