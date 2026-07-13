import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";
import { buildB2bOutreachEmailDe } from "../lib/emails/b2b-outreach-de";

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
  const to = "kontakt@staffontime.de";

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or EMAIL_FROM.");
  }

  const mail = buildB2bOutreachEmailDe({
    contactName: "Frau Müller",
    companyName: "Muster GmbH",
    industry: "Logistik",
    senderName: "Staff on Time Team",
  });

  const previewDir = resolve("preview");
  mkdirSync(previewDir, { recursive: true });
  const previewPath = resolve(previewDir, "b2b-outreach-de-example.html");
  writeFileSync(previewPath, mail.html, "utf8");
  console.log(`Saved preview: ${previewPath}`);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: to,
    subject: `[Vorlage] ${mail.subject}`,
    html: mail.html,
    text: mail.plainText,
  });

  if (error) throw new Error(error.message);
  console.log(`SENT B2B template to ${to} (id: ${data?.id ?? "n/a"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
