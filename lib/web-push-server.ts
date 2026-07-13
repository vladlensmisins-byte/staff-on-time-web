import webpush from "web-push";
import type { NewLeadPushPayload } from "@/lib/push-config";
import { getAdminUrl, isPushConfigured } from "@/lib/push-config";
import {
  getAllPushSubscriptions,
  removePushSubscription,
  type StoredPushSubscription,
} from "@/lib/push-subscriptions";

export type { NewLeadPushPayload } from "@/lib/push-config";

export type InterviewReminderPushPayload = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
};

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

function buildReminderMessage(payload: InterviewReminderPushPayload): {
  title: string;
  body: string;
  tag: string;
} {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const time = payload.interviewTime.slice(0, 5);
  return {
    title: `Erinnerung in 30 Min — ${fullName}`,
    body: [
      `${formatDateDe(payload.interviewDate)} · ${time} Uhr`,
      `Tel: ${payload.phone}`,
      interviewTypeLabel(payload.interviewType),
    ].join("\n"),
    tag: `staffontime-reminder-${payload.id}`,
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
  payload: { title: string; body: string; url: string; tag?: string },
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

async function broadcastPush(payload: {
  title: string;
  body: string;
  url: string;
  tag?: string;
}): Promise<void> {
  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await sendToSubscription(subscription, payload);
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

export async function sendNewLeadPush(payload: NewLeadPushPayload): Promise<void> {
  if (!isPushConfigured()) return;

  const message = buildLeadMessage(payload);
  await broadcastPush({
    title: message.title,
    body: message.body,
    url: getAdminUrl(),
    tag: "staffontime-new-lead",
  });
}

export async function sendInterviewReminderPush(
  payload: InterviewReminderPushPayload,
): Promise<void> {
  if (!isPushConfigured()) return;

  const message = buildReminderMessage(payload);
  await broadcastPush({
    title: message.title,
    body: message.body,
    url: `${getAdminUrl()}?lead=${encodeURIComponent(payload.id)}`,
    tag: message.tag,
  });
}

export async function sendTestPush(): Promise<void> {
  if (!isPushConfigured()) return;

  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) {
    throw new Error("No active push subscriptions");
  }

  await broadcastPush({
    title: "Test — staffontime",
    body: "Push funktioniert. Du erhältst Meldungen bei neuen Leads und 30 Minuten vor Interviews.",
    url: getAdminUrl(),
    tag: "staffontime-test",
  });
}
