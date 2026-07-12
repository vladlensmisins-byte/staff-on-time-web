import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function main() {
  loadEnvLocal();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_ADMIN_NOTIFY ?? process.env.EMAIL_FROM;
  const interviewDate = process.argv[2] ?? "2026-07-13";

  if (!supabaseUrl || !supabaseKey || !apiKey || !from || !replyTo) {
    throw new Error("Missing required environment variables.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(apiKey);

  const { data, error } = await supabase
    .from("submissions")
    .select("first_name,last_name,email,phone,interview_date,interview_time")
    .eq("interview_date", interviewDate)
    .order("interview_time");

  if (error) throw new Error(error.message);
  if (!data?.length) {
    console.log(`No submissions found for ${interviewDate}.`);
    return;
  }

  const previewDir = resolve("preview");
  mkdirSync(previewDir, { recursive: true });

  let exampleSaved = false;
  const results: string[] = [];

  for (const row of data) {
    const firstName = String(row.first_name ?? "").trim();
    const lastName = String(row.last_name ?? "").trim();
    const email = String(row.email ?? "").trim();
    const phone = String(row.phone ?? "").trim();
    const time = String(row.interview_time ?? "").trim().slice(0, 5);

    if (!isValidEmail(email)) {
      results.push(`SKIP  ${firstName} ${lastName} — invalid email: ${email}`);
      continue;
    }

    const mail = buildPhoneInterviewInviteEmail({
      firstName,
      lastName,
      interviewDate,
      interviewTime: time,
      phone,
    });

    if (!exampleSaved) {
      const examplePath = resolve(previewDir, "phone-interview-invite-example.html");
      writeFileSync(examplePath, mail.html, "utf8");
      exampleSaved = true;
      console.log(`Saved example preview: ${examplePath}`);
    }

    const { data: sent, error: sendError } = await resend.emails.send({
      from,
      to: email,
      replyTo,
      subject: mail.subject,
      html: mail.html,
    });

    if (sendError) {
      results.push(`FAIL  ${firstName} ${lastName} <${email}> — ${sendError.message}`);
      continue;
    }

    results.push(`SENT  ${firstName} ${lastName} <${email}> at ${time} (id: ${sent?.id ?? "n/a"})`);
  }

  console.log("\nResults:");
  for (const line of results) console.log(line);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
