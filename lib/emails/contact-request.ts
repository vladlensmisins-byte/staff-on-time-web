export type ContactRequestType = "staff" | "partnership";
export type ContactRequestLang = "de" | "en";

export type ContactRequestPayload = {
  type: ContactRequestType;
  language: ContactRequestLang;
  company: string;
  contact: string;
  email: string;
  industry?: string;
  needDesc?: string;
  partnershipType?: string;
  message?: string;
};

const INDUSTRY_LABELS: Record<ContactRequestLang, Record<string, string>> = {
  de: {
    logistik: "Logistik / Zustellung",
    hotellerie: "Hotellerie / Gastronomie",
    reinigung: "Reinigung & Fabrik",
    andere: "Andere",
  },
  en: {
    logistik: "Logistics / delivery",
    hotellerie: "Hospitality / gastronomy",
    reinigung: "Cleaning & factory",
    andere: "Other",
  },
};

const PARTNERSHIP_LABELS: Record<ContactRequestLang, Record<string, string>> = {
  de: {
    dauerhaft: "Dauerhafte Personalpartnerschaft",
    projekt: "Projektbezogene Zusammenarbeit",
    sonstiges: "Sonstiges",
  },
  en: {
    dauerhaft: "Ongoing staffing partnership",
    projekt: "Project-based collaboration",
    sonstiges: "Other",
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#6B7685;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#0E141C;vertical-align:top;white-space:pre-wrap;">${escapeHtml(value)}</td>
  </tr>`;
}

function emailShell(title: string, body: string, lang: ContactRequestLang = "de"): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:24px 12px;background:#E8E6E1;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;">
        <tr>
          <td style="background:#0E141C;padding:24px 32px;">
            <span style="font-family:'Manrope',Arial,sans-serif;font-size:22px;font-weight:700;color:#EDEAE3;">staffontime</span><span style="color:#D9A441;font-size:24px;">.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 20px;font-family:'Manrope',Arial,sans-serif;font-size:22px;color:#0E141C;">${escapeHtml(title)}</h1>
            ${body}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function industryLabel(lang: ContactRequestLang, value?: string): string {
  if (!value) return "—";
  return INDUSTRY_LABELS[lang][value] ?? value;
}

function partnershipLabel(lang: ContactRequestLang, value?: string): string {
  if (!value) return "—";
  return PARTNERSHIP_LABELS[lang][value] ?? value;
}

export function buildContactAdminEmail(payload: ContactRequestPayload): { subject: string; html: string } {
  const isStaff = payload.type === "staff";
  const subject = isStaff
    ? `Neue Personalanfrage: ${payload.company} — ${payload.contact}`
    : `Neue Partnerschaftsanfrage: ${payload.company} — ${payload.contact}`;

  const rows = [
    row("Typ", isStaff ? "Personal anfragen" : "Partner werden"),
    row("Unternehmen", payload.company),
    row("Ansprechpartner/in", payload.contact),
    row("E-Mail", payload.email),
  ];

  if (isStaff) {
    rows.push(row("Branche", industryLabel("de", payload.industry)));
    rows.push(row("Bedarf", payload.needDesc ?? "—"));
  } else {
    rows.push(row("Partnerschaft", partnershipLabel("de", payload.partnershipType)));
    rows.push(row("Nachricht", payload.message ?? "—"));
  }

  const html = emailShell(
    isStaff ? "Neue Personalanfrage" : "Neue Partnerschaftsanfrage",
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows.join("")}</table>`,
    "de",
  );

  return { subject, html };
}

export function buildContactConfirmationEmail(payload: ContactRequestPayload): {
  subject: string;
  html: string;
} {
  const isStaff = payload.type === "staff";
  const lang = payload.language;

  const copy = {
    de: {
      staffSubject: "Ihre Personalanfrage bei staffontime",
      partnerSubject: "Ihre Partnerschaftsanfrage bei staffontime",
      greeting: `Guten Tag ${payload.contact},`,
      staffThanks: "vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.",
      partnerThanks:
        "vielen Dank für Ihr Interesse an einer Partnerschaft. Wir prüfen Ihre Anfrage persönlich und melden uns zeitnah bei Ihnen.",
      closing: "Mit freundlichen Grüßen",
      team: "Ihr staffontime Team",
    },
    en: {
      staffSubject: "Your staff request at staffontime",
      partnerSubject: "Your partnership request at staffontime",
      greeting: `Hello ${payload.contact},`,
      staffThanks:
        "thank you for your request. We have received your message and will get back to you within 24 hours.",
      partnerThanks:
        "thank you for your interest in a partnership. We will review your request personally and get back to you soon.",
      closing: "Best regards",
      team: "The staffontime team",
    },
  }[lang];

  const subject = isStaff ? copy.staffSubject : copy.partnerSubject;
  const thanks = isStaff ? copy.staffThanks : copy.partnerThanks;

  const html = emailShell(
    subject,
    `<p style="margin:0 0 16px;font-family:'Inter',Arial,sans-serif;font-size:16px;line-height:1.6;color:#0E141C;">${escapeHtml(copy.greeting)}</p>
     <p style="margin:0 0 16px;font-family:'Inter',Arial,sans-serif;font-size:16px;line-height:1.6;color:#6B7685;">${escapeHtml(thanks)}</p>
     <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:16px;line-height:1.6;color:#6B7685;">${escapeHtml(copy.closing)}<br /><strong style="color:#0E141C;">${escapeHtml(copy.team)}</strong></p>`,
    lang,
  );

  return { subject, html };
}
