import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";
import {
  B2B_VISITENKARTE_CID,
  buildB2bLagerOutreachEmailDe,
} from "../lib/emails/b2b-lager-outreach-de";

const VISITENKARTE_PATH = resolve("public/assets/visitenkarte-fatih-mitu.png");

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

function readVisitenkarteBase64(): string {
  return readFileSync(VISITENKARTE_PATH).toString("base64");
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = "kontakt@staffontime.de";
  const siteUrl =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://www.staffontime.de";

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or EMAIL_FROM.");
  }

  const visitenkarteBase64 = readVisitenkarteBase64();
  const mail = buildB2bLagerOutreachEmailDe({ siteUrl });
  const previewMail = buildB2bLagerOutreachEmailDe({
    siteUrl,
    visitenkarteSrc: `data:image/png;base64,${visitenkarteBase64}`,
  });

  const previewDir = resolve("preview");
  mkdirSync(previewDir, { recursive: true });
  const previewPath = resolve(previewDir, "b2b-lager-outreach-de.html");
  writeFileSync(previewPath, previewMail.html, "utf8");
  console.log(`Saved preview: ${previewPath}`);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: "kontakt@staffontime.de",
    subject: `[Vorlage] ${mail.subject}`,
    html: mail.html,
    text: mail.plainText,
    attachments: [
      {
        filename: "visitenkarte-fatih-mitu.png",
        content: visitenkarteBase64,
        contentType: "image/png",
        contentId: B2B_VISITENKARTE_CID,
      },
    ],
  });

  if (error) throw new Error(error.message);
  console.log(`SENT B2B Lager template to ${to} (id: ${data?.id ?? "n/a"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
