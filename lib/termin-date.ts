export function normalizeTerminDate(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const german = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(20\d{2})$/);
  if (german) {
    const year = german[3];
    const month = german[2].padStart(2, "0");
    const day = german[1].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}

export function defaultTerminTitle(kind: string, title?: string | null): string {
  const trimmed = title?.trim();
  if (trimmed) return trimmed;
  return kind === "applicant" ? "Interview-Termin" : "Business-Termin";
}

export function mapTerminDbError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("termins") && (lower.includes("does not exist") || lower.includes("relation"))) {
    return "Tabelle „termins“ fehlt in Supabase. Bitte supabase/termins.sql im SQL Editor ausführen.";
  }
  return message;
}
