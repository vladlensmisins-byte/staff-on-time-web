export const ADMIN_STATUS_LABELS: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  interview_scheduled: "Interview geplant",
  hired: "Eingestellt",
  rejected: "Abgelehnt",
};

const INDUSTRY_LABELS: Record<string, string> = {
  indWarehouse: "Lager / Logistik",
  indProduction: "Produktion",
  indCleaning: "Reinigung & Fabrik",
  indGastro: "Gastronomie / Hotel",
  indDelivery: "Lieferung",
  indConstruction: "Bau",
  indOther: "Sonstiges",
};

const LICENSE_LABELS: Record<string, string> = {
  licNone: "Kein Führerschein",
  B: "Klasse B",
  BE: "Klasse BE",
  C: "Klasse C",
  C1: "Klasse C1",
  CE: "Klasse CE",
};

const VISA_LABELS: Record<string, string> = {
  eu_citizen: "EU/EWR-Bürger, kein Visum nötig",
  blue_card: "Blaue Karte EU",
  residence_permit_work: "Aufenthaltstitel mit Arbeitserlaubnis",
  work_visa: "Arbeitsvisum",
  student_visa_work: "Studentenvisum mit Arbeitserlaubnis",
  none_yet: "Noch keins / brauche Beratung",
  other: "Sonstiges",
};

const FORKLIFT_LABELS: Record<string, string> = {
  yes: "Ja",
  no: "Nein",
};

const LEVEL_LABELS: Record<string, string> = {
  none: "Kein",
  basic: "Grundkenntnisse",
  intermediate: "Mittelstufe",
  fluent: "Fließend",
  native: "Muttersprache",
};

export function labelIndustry(key: string): string {
  return INDUSTRY_LABELS[key] ?? key;
}

export function labelLicense(key: string): string {
  return LICENSE_LABELS[key] ?? key;
}

export function labelVisa(key: string | null): string {
  if (!key) return "—";
  return VISA_LABELS[key] ?? key;
}

export function labelForklift(key: string | null): string {
  if (!key) return "—";
  return FORKLIFT_LABELS[key] ?? key;
}

export function labelLevel(key: string | null | undefined): string {
  if (!key) return "—";
  return LEVEL_LABELS[key] ?? key;
}

export function labelInterviewType(key: string | null): string {
  if (key === "online") return "Online-Gespräch";
  if (key === "live") return "Live-Termin (vor Ort)";
  return "—";
}

export function formatInterviewDe(date: string | null, time: string | null): string {
  if (!date) return "Kein Interview";
  const formattedDate = formatGermanDate(date);
  return time ? `${formattedDate} · ${time} Uhr` : formattedDate;
}

function formatGermanDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
}
