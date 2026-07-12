export type { NewLeadPushPayload } from "@/lib/push-config";
export { getVapidPublicKeyForClient, isPushConfigured } from "@/lib/push-config";
export { sendNewLeadPush, sendTestPush } from "@/lib/web-push-server";
