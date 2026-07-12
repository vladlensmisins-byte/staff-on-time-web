export type NewLeadPushPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: "online" | "live";
};

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY?.trim() || null;
}

export function isPushConfigured(): boolean {
  return !!(
    getVapidPublicKey() &&
    process.env.VAPID_PRIVATE_KEY?.trim() &&
    process.env.VAPID_SUBJECT?.trim()
  );
}

export function getVapidPublicKeyForClient(): string | null {
  return getVapidPublicKey();
}

export function getAdminUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return "/admin";
  return `${siteUrl.replace(/\/$/, "")}/admin`;
}
