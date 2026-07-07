import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";
import { buildCandidateConfirmationEmail } from "../lib/emails/candidate-confirmation";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* .env.local optional */
  }
}

async function main() {
  loadEnvLocal();

  const sample = {
    firstName: "Anna",
    lastName: "Müller",
    interviewDate: "2026-07-15",
    interviewTime: "10:00",
  };

  const previewDir = resolve("preview");
  mkdirSync(previewDir, { recursive: true });

  for (const lang of ["en", "de", "hi"] as const) {
    const mail = buildCandidateConfirmationEmail({ lang, ...sample });
    const file = resolve(previewDir, `candidate-confirmation-${lang}.html`);
    writeFileSync(file, mail.html, "utf8");
    console.log(`Wrote ${file}`);
  }

  const enMail = buildCandidateConfirmationEmail({ lang: "en", ...sample });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_ADMIN_NOTIFY ?? process.env.TEST_EMAIL_TO;

  if (!apiKey || !from || !to) {
    console.error("Missing RESEND_API_KEY, EMAIL_FROM, or EMAIL_ADMIN_NOTIFY for send test.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: from,
    subject: `[TEST] ${enMail.subject}`,
    html: enMail.html,
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(1);
  }

  console.log(`Test email sent to ${to} (id: ${data?.id})`);
  console.log("\nPreview via curl (dev server must be running):");
  console.log(
    'curl "http://localhost:3000/api/submit?previewCandidateEmail=en&firstName=Anna&lastName=M%C3%BCller&date=2026-07-15&time=10:00" -o preview/candidate-confirmation-curl.html',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
