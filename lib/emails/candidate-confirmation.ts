import type { InterviewType } from "@/lib/interview-type";

export type CandidateEmailLang = "en" | "de" | "hi";

type EmailCopy = {
  subject: string;
  greeting: (firstName: string) => string;
  headline: string;
  thankYou: string;
  labelName: string;
  labelType: string;
  labelDate: string;
  labelTime: string;
  closing: string;
  footerBrand: string;
  footerAuto: string;
};

const TYPE_LABELS: Record<CandidateEmailLang, Record<InterviewType, string>> = {
  en: {
    online: "Online interview",
    live: "Live interview (in person)",
  },
  de: {
    online: "Online-Gespräch",
    live: "Live-Termin (vor Ort)",
  },
  hi: {
    online: "ऑनलाइन इंटरव्यू",
    live: "लाइव इंटरव्यू (सामने)",
  },
};

const COPY: Record<CandidateEmailLang, Record<InterviewType, Omit<EmailCopy, "labelType">>> = {
  en: {
    online: {
      subject: "Online interview booking confirmed — Staff on Time",
      greeting: (firstName) => `Hi ${firstName},`,
      headline: "You're booked!",
      thankYou: "Thank you — we have received your application.",
      labelName: "Name",
      labelDate: "Interview date",
      labelTime: "Interview time",
      closing:
        "You will receive the online meeting link in a separate email before your interview. If you have questions, just reply to this message.",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "This is an automated message. Please do not share sensitive information in a reply.",
    },
    live: {
      subject: "Live interview booking confirmed — Staff on Time",
      greeting: (firstName) => `Hi ${firstName},`,
      headline: "You're booked!",
      thankYou: "Thank you — we have received your application.",
      labelName: "Name",
      labelDate: "Interview date",
      labelTime: "Interview time",
      closing:
        "The exact interview address will follow in a separate email. If you have questions, just reply to this message.",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "This is an automated message. Please do not share sensitive information in a reply.",
    },
  },
  de: {
    online: {
      subject: "Online-Bewerbungsgespräch bestätigt — Staff on Time",
      greeting: (firstName) => `Hallo ${firstName},`,
      headline: "Termin gebucht!",
      thankYou: "Vielen Dank — wir haben Ihre Bewerbung erhalten.",
      labelName: "Name",
      labelDate: "Termindatum",
      labelTime: "Uhrzeit",
      closing:
        "Den Link zum Online-Gespräch senden wir Ihnen vor dem Termin in einer separaten E-Mail. Bei Fragen antworten Sie einfach auf diese Nachricht.",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "Dies ist eine automatische Nachricht. Bitte teilen Sie keine sensiblen Daten per Antwort.",
    },
    live: {
      subject: "Live-Termin bestätigt — Staff on Time",
      greeting: (firstName) => `Hallo ${firstName},`,
      headline: "Termin gebucht!",
      thankYou: "Vielen Dank — wir haben Ihre Bewerbung erhalten.",
      labelName: "Name",
      labelDate: "Termindatum",
      labelTime: "Uhrzeit",
      closing:
        "Die genaue Adresse senden wir Ihnen in einer separaten E-Mail. Bei Fragen antworten Sie einfach auf diese Nachricht.",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "Dies ist eine automatische Nachricht. Bitte teilen Sie keine sensiblen Daten per Antwort.",
    },
  },
  hi: {
    online: {
      subject: "ऑनलाइन इंटरव्यू की पुष्टि — Staff on Time",
      greeting: (firstName) => `नमस्ते ${firstName},`,
      headline: "आपका बुकिंग हो गया!",
      thankYou: "धन्यवाद — हमें आपका आवेदन मिल गया है।",
      labelName: "नाम",
      labelDate: "इंटरव्यू की तारीख",
      labelTime: "समय",
      closing:
        "ऑनलाइन मीटिंग का लिंक हम आपको इंटरव्यू से पहले अलग ईमेल में भेजेंगे। यदि आपके कोई प्रश्न हैं, तो बस इस संदेश का उत्तर दें।",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "यह एक स्वचालित संदेश है। कृपया उत्तर में संवेदनशील जानकारी साझा न करें।",
    },
    live: {
      subject: "लाइव इंटरव्यू की पुष्टि — Staff on Time",
      greeting: (firstName) => `नमस्ते ${firstName},`,
      headline: "आपका बुकिंग हो गया!",
      thankYou: "धन्यवाद — हमें आपका आवेदन मिल गया है।",
      labelName: "नाम",
      labelDate: "इंटरव्यू की तारीख",
      labelTime: "समय",
      closing:
        "सटीक पता हम अलग ईमेल में भेजेंगे। यदि आपके कोई प्रश्न हैं, तो बस इस संदेश का उत्तर दें।",
      footerBrand: "Staff on Time · Berlin",
      footerAuto: "यह एक स्वचालित संदेश है। कृपया उत्तर में संवेदनशील जानकारी साझा न करें।",
    },
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

function resolveLang(lang: string): CandidateEmailLang {
  if (lang === "de" || lang === "hi") return lang;
  return "en";
}

function detailRow(label: string, value: string, isLast = false): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  const border = isLast ? "border-bottom:none;" : "border-bottom:1px solid #E2DED6;";

  return `
    <tr>
      <td style="padding:14px 20px;${border}font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#6B7685;width:42%;vertical-align:top;">
        ${safeLabel}
      </td>
      <td class="detail-value" style="padding:14px 20px;${border}font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0E141C;font-weight:600;text-align:right;vertical-align:top;">
        ${safeValue}
      </td>
    </tr>`;
}

export function buildCandidateConfirmationEmail(params: {
  lang: string;
  firstName: string;
  lastName: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
}): { subject: string; html: string } {
  const lang = resolveLang(params.lang);
  const copy = COPY[lang][params.interviewType];
  const typeLabel = TYPE_LABELS[lang][params.interviewType];
  const fullName = `${params.firstName} ${params.lastName}`.trim();
  const safeGreeting = escapeHtml(copy.greeting(params.firstName));

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(copy.subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-body-pad { padding: 32px 24px !important; }
      .email-header-pad { padding: 24px !important; }
      .detail-value { text-align: left !important; padding-top: 4px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#E8E6E1;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#E8E6E1;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#FFFFFF;border-collapse:collapse;">

          <!-- Header -->
          <tr>
            <td class="email-header-pad" style="background-color:#0E141C;padding:28px 40px;">
              <span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#EDEAE3;letter-spacing:-0.02em;line-height:1.2;">staffontime</span><span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:#D9A441;line-height:1.2;position:relative;top:1px;">.</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body-pad" style="padding:48px 40px 32px;background-color:#FAF9F7;">

              <!-- Success icon -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 28px auto;">
                <tr>
                  <td align="center" width="64" height="64" style="width:64px;height:64px;background-color:#D9A441;border-radius:50%;text-align:center;vertical-align:middle;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:700;color:#171008;line-height:64px;">
                    &#10003;
                  </td>
                </tr>
              </table>

              <h1 style="margin:0 0 12px 0;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:700;color:#0E141C;letter-spacing:-0.02em;line-height:1.2;text-align:center;">
                ${escapeHtml(copy.headline)}
              </h1>

              <p style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:#0E141C;text-align:center;">
                ${safeGreeting}
              </p>
              <p style="margin:0 0 32px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:#6B7685;text-align:center;">
                ${escapeHtml(copy.thankYou)}
              </p>

              <!-- Details card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E2DED6;border-radius:2px;background-color:#FFFFFF;border-collapse:separate;">
                ${detailRow(copy.labelName, fullName)}
                ${detailRow("Interview type", typeLabel)}
                ${detailRow(copy.labelDate, params.interviewDate)}
                ${detailRow(copy.labelTime, params.interviewTime, true)}
              </table>

              <p style="margin:32px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B7685;text-align:center;">
                ${escapeHtml(copy.closing)}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;background-color:#F0EEEA;border-top:1px solid #E2DED6;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0E141C;letter-spacing:0.02em;">
                ${escapeHtml(copy.footerBrand)}
              </p>
              <p style="margin:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.5;color:#93A0AC;">
                ${escapeHtml(copy.footerAuto)}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: copy.subject, html };
}
