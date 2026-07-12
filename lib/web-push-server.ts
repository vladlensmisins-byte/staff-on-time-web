import webpush from "web-push";
import {
  getAllPushSubscriptions,
  removePushSubscription,
  type StoredPushSubscription,
} from "@/lib/push-subscriptions";

export type NewLeadPushPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: "online" | "live";
};

function getVapidPublicKey(): string | null {
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

function adminUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return "/admin";
  return `${siteUrl.replace(/\/$/, "")}/admin`;
}

function formatDateDe(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return year && month && day ? `${day}.${month}.${year}` : isoDate;
}

function interviewTypeLabel(type: string): string {
  return type === "online" ? "Online-Gespräch" : "Live-Termin";
}

function buildLeadMessage(payload: NewLeadPushPayload): { title: string; body: string } {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const time = payload.interviewTime.slice(0, 5);
  return {
    title: `Neuer Lead — ${fullName}`,
    body: [
      `${formatDateDe(payload.interviewDate)} · ${time} Uhr`,
      `Tel: ${payload.phone}`,
      interviewTypeLabel(payload.interviewType),
    ].join("\n"),
  };
}

function configureWebPush(): void {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!.trim(),
    process.env.VAPID_PUBLIC_KEY!.trim(),
    process.env.VAPID_PRIVATE_KEY!.trim(),
  );
}

async function sendToSubscription(
  subscription: StoredPushSubscription,
  payload: { title: string; body: string; url: string },
): Promise<void> {
  configureWebPush();

  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    JSON.stringify(payload),
  );
}

export async function sendNewLeadPush(payload: NewLeadPushPayload): Promise<void> {
  if (!isPushConfigured()) return;

  const message = buildLeadMessage(payload);
  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) return;

  const pushPayload = {
    title: message.title,
    body: message.body,
    url: adminUrl(),
  };

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await sendToSubscription(subscription, pushPayload);
      } catch (error) {
        const statusCode =
          error && typeof error === "object" && "statusCode" in error
            ? Number((error as { statusCode?: number }).statusCode)
            : null;

        if (statusCode === 404 || statusCode === 410) {
          await removePushSubscription(subscription.endpoint);
        } else {
          console.error("Web push failed:", error);
        }
      }
    }),
  );
}

export async function sendTestPush(): Promise<void> {
  if (!isPushConfigured()) return;

  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) {
    throw new Error("No active push subscriptions");
  }

  const pushPayload = {
    title: "Test — staffontime",
    body: "Push-Benachrichtigungen funktionieren. Du erhältst eine Meldung bei jedem neuen Lead.",
    url: adminUrl(),
  };

  await Promise.all(subscriptions.map((subscription) => sendToSubscription(subscription, pushPayload)));
}
