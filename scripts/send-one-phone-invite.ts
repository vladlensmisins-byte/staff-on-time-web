import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";
import { buildPhoneInterviewInviteEmail } from "../lib/emails/phone-interview-invite";

function loadEnvLocal() {
  const raw = readFileSync(resolve(".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_ADMIN_NOTIFY ?? process.env.EMAIL_FROM;

  if (!apiKey || !from || !replyTo) {
    throw new Error("Missing required environment variables.");
  }

  const resend = new Resend(apiKey);
  const mail = buildPhoneInterviewInviteEmail({
    firstName: "Harmanpreet",
    lastName: "Singh",
    interviewDate: "2026-07-13",
    interviewTime: "15:00",
    phone: "+491784559725",
  });

  const { data, error } = await resend.emails.send({
    from,
    to: "harmanpreetsinghger@gmail.com",
    replyTo,
    subject: mail.subject,
    html: mail.html,
  });

  if (error) throw new Error(error.message);
  console.log(`SENT Harmanpreet Singh <harmanpreetsinghger@gmail.com> (id: ${data?.id ?? "n/a"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
