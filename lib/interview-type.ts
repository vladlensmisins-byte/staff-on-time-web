export const INTERVIEW_TYPES = ["online", "live"] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export function isInterviewType(value: string): value is InterviewType {
  return value === "online" || value === "live";
}
