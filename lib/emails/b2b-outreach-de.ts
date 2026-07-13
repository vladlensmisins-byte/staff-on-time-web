function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#6B7685;">${text}</p>`;
}

function bulletItem(text: string): string {
  return `<li style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.55;color:#0E141C;">${text}</li>`;
}

export function buildB2bOutreachEmailDe(params: {
  contactName?: string;
  companyName?: string;
  industry?: string;
  senderName?: string;
}): { subject: string; html: string; plainText: string } {
  const contactName = params.contactName?.trim() || "[Ansprechpartner/in]";
  const companyName = params.companyName?.trim() || "[Firmenname]";
  const industry = params.industry?.trim();
  const senderName = params.senderName?.trim() || "Staff on Time Team";

  const subject = `Personalvermittlung für ${companyName} — Staff on Time`;
  const greeting = `Sehr geehrte/r ${escapeHtml(contactName)},`;
  const industryLine = industry
    ? `Gerade im Bereich <strong>${escapeHtml(industry)}</strong> unterstützen wir Unternehmen dabei, kurzfristig zuverlässige Arbeitskräfte zu finden — ohne langwierige Einstellungsprozesse.`
    : "Gerade in Logistik, Produktion, Hotellerie und Reinigung & Fabrik unterstützen wir Unternehmen dabei, kurzfristig zuverlässige Arbeitskräfte zu finden — ohne langwierige Einstellungsprozesse.";

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
              <span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#EDEAE3;letter-spacing:-0.02em;line-height:1.2;">staffontime</span><span style="font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:#D9A441;line-height:1.2;position:relative;top:1px;">.</span>
            </td>
          </tr>

          <tr>
            <td class="email-body-pad" style="padding:48px 40px 32px;background-color:#FAF9F7;">

              <h1 style="margin:0 0 20px 0;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:#0E141C;letter-spacing:-0.02em;line-height:1.3;">
                Qualifiziertes Personal — pünktlich und geprüft
              </h1>

              <p style="margin:0 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#0E141C;">
                ${greeting}
              </p>

              ${paragraph(
                `mein Name ist von <strong>Staff on Time</strong> — wir vermitteln qualifizierte Arbeitskräfte an Unternehmen in Berlin und Umgebung. Ich wende mich an Sie, weil wir <strong>${escapeHtml(companyName)}</strong> bei der Personalbeschaffung unterstützen möchten.`,
              )}

              ${paragraph(industryLine)}

              ${paragraph("<strong>Was wir bieten:</strong>")}

              <ul style="margin:0 0 20px 0;padding-left:20px;">
                ${bulletItem("Geprüfte und motivierte Arbeitskräfte — vorab interviewt und qualifiziert")}
                ${bulletItem("Schnelle Vermittlung — oft innerhalb weniger Tage")}
                ${bulletItem("Branchen: Logistik, Produktion, Lager, Hotellerie, Gastronomie, Reinigung, Bau")}
                ${bulletItem("Flexible Einsatzmodelle — kurzfristig, projektbezogen oder langfristig")}
                ${bulletItem("Transparente Konditionen — keine versteckten Kosten")}
              </ul>

              ${paragraph(
                "Hätten Sie in den nächsten Tagen 15–20 Minuten für ein kurzes Gespräch? Gerne stelle ich Ihnen unser Konzept vor und bespreche, wie wir Ihren Personalbedarf konkret abdecken können.",
              )}

              ${paragraph(
                'Antworten Sie einfach auf diese E-Mail oder schreiben Sie uns an <a href="mailto:kontakt@staffontime.de" style="color:#D9A441;text-decoration:none;font-weight:600;">kontakt@staffontime.de</a>.',
              )}

              <p style="margin:28px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#0E141C;font-weight:600;">
                Mit freundlichen Grüßen<br />
                ${escapeHtml(senderName)}<br />
                <span style="font-weight:400;color:#6B7685;">Staff on Time · Berlin</span>
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px;background-color:#F0EEEA;border-top:1px solid #E2DED6;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0E141C;letter-spacing:0.02em;">
                Staff on Time · Berlin
              </p>
              <p style="margin:0 0 4px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.5;color:#93A0AC;">
                kontakt@staffontime.de · staffontime.de
              </p>
              <p style="margin:8px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:11px;line-height:1.5;color:#B0BAC4;">
                Vorlage für B2B-Kundenansprache — Platzhalter in eckigen Klammern vor dem Versand ersetzen.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainText = `Sehr geehrte/r ${contactName},

mein Name ist von Staff on Time — wir vermitteln qualifizierte Arbeitskräfte an Unternehmen in Berlin und Umgebung. Ich wende mich an Sie, weil wir ${companyName} bei der Personalbeschaffung unterstützen möchten.

${industry ? `Gerade im Bereich ${industry} unterstützen wir Unternehmen dabei, kurzfristig zuverlässige Arbeitskräfte zu finden.` : "Gerade in Logistik, Produktion, Hotellerie und Reinigung & Fabrik unterstützen wir Unternehmen dabei, kurzfristig zuverlässige Arbeitskräfte zu finden."}

Was wir bieten:
- Geprüfte und motivierte Arbeitskräfte — vorab interviewt und qualifiziert
- Schnelle Vermittlung — oft innerhalb weniger Tage
- Branchen: Logistik, Produktion, Lager, Hotellerie, Gastronomie, Reinigung, Bau
- Flexible Einsatzmodelle — kurzfristig, projektbezogen oder langfristig
- Transparente Konditionen — keine versteckten Kosten

Hätten Sie in den nächsten Tagen 15–20 Minuten für ein kurzes Gespräch? Gerne stelle ich Ihnen unser Konzept vor und bespreche, wie wir Ihren Personalbedarf konkret abdecken können.

Antworten Sie einfach auf diese E-Mail oder schreiben Sie uns an kontakt@staffontime.de.

Mit freundlichen Grüßen
${senderName}
Staff on Time · Berlin`;

  return { subject, html, plainText };
}
