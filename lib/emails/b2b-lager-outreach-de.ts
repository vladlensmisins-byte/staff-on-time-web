function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#0E141C;">${text}</p>`;
}

function bulletItem(text: string): string {
  return `<li style="margin:0 0 10px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.55;color:#0E141C;">${text}</li>`;
}

const DEFAULT_SITE_URL = "https://www.staffontime.de";

export const B2B_VISITENKARTE_CID = "visitenkarte-fatih-mitu";

export function buildB2bLagerOutreachEmailDe(params?: {
  siteUrl?: string;
  visitenkarteSrc?: string;
}): { subject: string; html: string; plainText: string } {
  const siteUrl = (params?.siteUrl?.trim() || DEFAULT_SITE_URL).replace(/\/$/, "");
  const siteHost = siteUrl.replace(/^https?:\/\//, "");
  const visitenkarteSrc = params?.visitenkarteSrc?.trim() || `cid:${B2B_VISITENKARTE_CID}`;

  const subject = "Lagerpersonal in Berlin — geprüft, fair & schnell verfügbar";

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(subject)}</title>
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
      .visitenkarte-img { width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#E8E6E1;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#E8E6E1;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#FFFFFF;border-collapse:collapse;">

          <tr>
            <td class="email-header-pad" style="background-color:#0E141C;padding:28px 40px;">
              <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
                <span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#EDEAE3;letter-spacing:-0.02em;line-height:1.2;">staffontime</span><span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:#D9A441;line-height:1.2;position:relative;top:1px;">.</span>
              </a>
            </td>
          </tr>

          <tr>
            <td class="email-body-pad" style="padding:48px 40px 32px;background-color:#FAF9F7;">

              <p style="margin:0 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#0E141C;">
                Sehr geehrte Damen und Herren,
              </p>

              ${paragraph(
                "kurzfristige Personalengpässe im Lager kosten Zeit, Geld und Nerven – meistens genau dann, wenn man es sich am wenigsten leisten kann.",
              )}

              ${paragraph(
                "Mit <strong>staffontime</strong> vermitteln wir geprüftes, zuverlässiges Lagerpersonal in Berlin – zu Start-Konditionen von <strong>25–26&nbsp;€/Std</strong>, spürbar unter dem Marktdurchschnitt von <strong>27–32&nbsp;€/Std</strong>. Was uns darüber hinaus unterscheidet:",
              )}

              <ul style="margin:0 0 20px 0;padding-left:20px;">
                ${bulletItem("Jede Kandidatin und jeder Kandidat wird von mir persönlich im Interview ausgewählt, bevor ein Einsatz zustande kommt")}
                ${bulletItem("Persönliche Einweisung direkt vor Ort, nicht nur am Telefon")}
                ${bulletItem("Tarifgebundene, faire Bezahlung nach GVP/DGB")}
                ${bulletItem("Direkter Draht zur Geschäftsführung statt anonymem Callcenter")}
                ${bulletItem("Schnelle Nachbesetzung bei Ausfall, ohne Wartezeit für Sie")}
              </ul>

              ${paragraph(
                "Im Anhang finden Sie unsere kurze Verkaufspräsentation mit allen Details zu Konditionen, Ablauf und unserem Auswahlprozess.",
              )}

              ${paragraph(
                "Gerne testen Sie die erste Schicht unverbindlich – ganz ohne Risiko für Sie. Ich melde mich in den nächsten Tagen telefonisch bei Ihnen, oder Sie erreichen mich direkt unter den unten stehenden Kontaktdaten.",
              )}

              <p style="margin:28px 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#0E141C;">
                Mit freundlichen Grüßen<br />
                <strong>Fatih Mitu</strong><br />
                <span style="color:#6B7685;">Geschäftsführer, staffontime</span>
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 24px 0;">
                <tr>
                  <td>
                    <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
                      <img
                        class="visitenkarte-img"
                        src="${escapeHtml(visitenkarteSrc)}"
                        alt="Fatih Mitu — Geschäftsführer, staffontime · kontakt@staffontime.de · +49 163 679 1216"
                        width="520"
                        style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:8px;"
                      />
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#D9A441;">
                    <a href="${escapeHtml(siteUrl)}" style="display:inline-block;padding:14px 28px;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:#0E141C;text-decoration:none;">
                      staffontime.de besuchen →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px;background-color:#F0EEEA;border-top:1px solid #E2DED6;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0E141C;letter-spacing:0.02em;">
                staffontime · Personalvermittlung · Berlin
              </p>
              <p style="margin:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.5;color:#93A0AC;">
                <a href="mailto:kontakt@staffontime.de" style="color:#6B7685;text-decoration:none;">kontakt@staffontime.de</a>
                ·
                <a href="${escapeHtml(siteUrl)}" style="color:#6B7685;text-decoration:none;">${escapeHtml(siteHost)}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `Sehr geehrte Damen und Herren,

kurzfristige Personalengpässe im Lager kosten Zeit, Geld und Nerven – meistens genau dann, wenn man es sich am wenigsten leisten kann.

Mit staffontime vermitteln wir geprüftes, zuverlässiges Lagerpersonal in Berlin – zu Start-Konditionen von 25–26 €/Std, spürbar unter dem Marktdurchschnitt von 27–32 €/Std. Was uns darüber hinaus unterscheidet:

– Jede Kandidatin und jeder Kandidat wird von mir persönlich im Interview ausgewählt, bevor ein Einsatz zustande kommt
– Persönliche Einweisung direkt vor Ort, nicht nur am Telefon
– Tarifgebundene, faire Bezahlung nach GVP/DGB
– Direkter Draht zur Geschäftsführung statt anonymem Callcenter
– Schnelle Nachbesetzung bei Ausfall, ohne Wartezeit für Sie

Im Anhang finden Sie unsere kurze Verkaufspräsentation mit allen Details zu Konditionen, Ablauf und unserem Auswahlprozess.

Gerne testen Sie die erste Schicht unverbindlich – ganz ohne Risiko für Sie. Ich melde mich in den nächsten Tagen telefonisch bei Ihnen, oder Sie erreichen mich direkt unter den unten stehenden Kontaktdaten.

Mit freundlichen Grüßen
Fatih Mitu
Geschäftsführer, staffontime

+49 163 679 1216
kontakt@staffontime.de
${siteHost}`;

  return { subject, html, plainText };
}
