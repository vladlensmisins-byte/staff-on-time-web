import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export const ADMIN_CV_SIGNED_TTL = 60 * 60;

export const SUBMISSION_STATUSES = [
  "new",
  "contacted",
  "interview_scheduled",
  "hired",
  "rejected",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

function getAdminPassword(): string {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) {
    throw new Error("Missing server configuration: ADMIN_PASSWORD");
  }
  return value;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payload: string, signature: string, secret: string): Promise<boolean> {
  const key = await importSigningKey(secret);
  const sigBytes = new Uint8Array(base64UrlToBytes(signature));
  return crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(payload));
}

export async function signAdminSession(): Promise<string> {
  const payload = JSON.stringify({
    exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  });
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(payload));
  const signature = await signPayload(payloadB64, getAdminPassword());
  return `${payloadB64}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  try {
    const valid = await verifyPayload(payloadB64, signature, getAdminPassword());
    if (!valid) return false;

    const payloadJson = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    if (!payload.exp || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function isValidSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

export function verifyAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}
