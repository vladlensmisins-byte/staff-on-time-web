function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInterviewDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export function buildPhoneInterviewInviteEmail(params: {
  firstName: string;
  lastName: string;
  interviewDate: string;
  interviewTime: string;
  phone: string;
}): { subject: string; html: string } {
  const subject = "Your first interview call — Staff on Time";
  const fullName = `${params.firstName} ${params.lastName}`.trim();
  const greeting = escapeHtml(`Hi ${params.firstName},`);
  const formattedDate = formatInterviewDate(params.interviewDate);

  const html = `<!DOCTYPE html>
<html lang="en">
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
      .detail-value { text-align: left !important; padding-top: 4px !important; }
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

              <h1 style="margin:0 0 16px 0;font-family:'Manrope','Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:700;color:#0E141C;letter-spacing:-0.02em;line-height:1.25;text-align:left;">
                Your first interview call
              </h1>

              <p style="margin:0 0 12px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#0E141C;">
                ${greeting}
              </p>

              <p style="margin:0 0 16px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#6B7685;">
                Thank you for your application — we have received it and are pleased to invite you to the first stage of our recruitment process: a brief introductory phone call with our recruitment manager.
              </p>

              <p style="margin:0 0 24px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#6B7685;">
                Our recruitment manager will contact you at the scheduled time using the phone number you provided in your application.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E2DED6;border-radius:2px;background-color:#FFFFFF;border-collapse:separate;">
                ${detailRow("Name", fullName)}
                ${detailRow("Date", formattedDate)}
                ${detailRow("Time", params.interviewTime)}
                ${detailRow("Phone number", params.phone, true)}
              </table>

              <p style="margin:24px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B7685;">
                If this phone number is incorrect, unreachable, or you are unable to take the call at the scheduled time, please let us know as soon as possible by replying to this email.
              </p>

              <p style="margin:16px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B7685;">
                If you have any questions, we are happy to help — simply reply to this message.
              </p>

              <p style="margin:28px 0 0 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#0E141C;font-weight:600;">
                Best regards,<br />
                Staff on Time Recruitment Team
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px;background-color:#F0EEEA;border-top:1px solid #E2DED6;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0E141C;letter-spacing:0.02em;">
                Staff on Time · Berlin
              </p>
              <p style="margin:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.5;color:#93A0AC;">
                This is an automated message. Please do not share sensitive information in a reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
