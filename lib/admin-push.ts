export type NewLeadPushPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: "online" | "live";
};

export {
  getVapidPublicKeyForClient,
  isPushConfigured,
  sendNewLeadPush,
  sendTestPush,
} from "@/lib/web-push-server";
