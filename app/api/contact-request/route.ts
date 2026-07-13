import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildContactAdminEmail,
  buildContactConfirmationEmail,
  type ContactRequestPayload,
} from "@/lib/emails/contact-request";

export const runtime = "edge";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parsePayload(body: unknown): ContactRequestPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const type = data.type;
  const language = data.language;
  const company = typeof data.company === "string" ? data.company.trim() : "";
  const contact = typeof data.contact === "string" ? data.contact.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";

  if (type !== "staff" && type !== "partnership") return null;
  if (language !== "de" && language !== "en") return null;
  if (!company || !contact || !email || !isEmail(email)) return null;

  if (type === "staff") {
    const industry = typeof data.industry === "string" ? data.industry.trim() : "";
    const needDesc = typeof data.needDesc === "string" ? data.needDesc.trim() : "";
    if (!needDesc) return null;
    return {
      type,
      language,
      company,
      contact,
      email,
      industry: industry || "andere",
      needDesc,
    };
  }

  const partnershipType =
    typeof data.partnershipType === "string" ? data.partnershipType.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!message) return null;

  return {
    type,
    language,
    company,
    contact,
    email,
    partnershipType: partnershipType || "sonstiges",
    message,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = parsePayload(body);
    if (!payload) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const resend = new Resend(getEnv("RESEND_API_KEY"));
    const emailFrom = getEnv("EMAIL_FROM");
    const emailAdmin = getEnv("EMAIL_ADMIN_NOTIFY");

    const confirmation = buildContactConfirmationEmail(payload);
    const { error: userEmailError } = await resend.emails.send({
      from: emailFrom,
      to: payload.email,
      replyTo: emailAdmin,
      subject: confirmation.subject,
      html: confirmation.html,
    });

    if (userEmailError) {
      console.error("Contact confirmation email failed:", userEmailError.message);
      return NextResponse.json({ error: "Could not send confirmation email" }, { status: 500 });
    }

    const adminMail = buildContactAdminEmail(payload);
    const { error: adminEmailError } = await resend.emails.send({
      from: emailFrom,
      to: emailAdmin,
      replyTo: payload.email,
      subject: adminMail.subject,
      html: adminMail.html,
    });

    if (adminEmailError) {
      console.error("Contact admin email failed:", adminEmailError.message);
      return NextResponse.json({ error: "Could not send admin notification" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact-request error:", err);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
