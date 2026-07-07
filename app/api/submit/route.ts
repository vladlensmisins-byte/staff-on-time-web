import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildCandidateConfirmationEmail } from "@/lib/emails/candidate-confirmation";

export const runtime = "edge";

const CV_BUCKET = "cv-uploads";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7;

type LangSkills = {
  german: string;
  english: string;
  hindi: string;
};

type SubmissionPayload = {
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  fieldOfStudy?: string;
  workExp?: string;
  langSkills?: LangSkills;
  otherLang?: string;
  industries?: string[];
  licenses?: string[];
  forklift?: string | null;
  visaType?: string;
  cvName?: string | null;
  cvBase64?: string | null;
  interviewDate?: string;
  interviewTime?: string;
  language?: string;
  submittedAt?: string;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing server configuration: ${name}`);
  }
  return value;
}

function getSupabase(): SupabaseClient {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

function getResend(): Resend {
  return new Resend(getEnv("RESEND_API_KEY"));
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
}

function decodeBase64Cv(base64: string): Buffer {
  const data = base64.includes(",") ? base64.split(",")[1] : base64;
  return Buffer.from(data, "base64");
}

function validatePayload(body: SubmissionPayload): string | null {
  const required: Array<[keyof SubmissionPayload, string]> = [
    ["lastName", "last name"],
    ["firstName", "first name"],
    ["email", "email"],
    ["phone", "phone"],
    ["visaType", "visa type"],
    ["interviewDate", "interview date"],
    ["interviewTime", "interview time"],
  ];

  for (const [field, label] of required) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      return `Missing required field: ${label}`;
    }
  }

  return null;
}

function candidateEmailContent(
  lang: string,
  firstName: string,
  lastName: string,
  interviewDate: string,
  interviewTime: string,
): { subject: string; html: string } {
  return buildCandidateConfirmationEmail({
    lang,
    firstName,
    lastName,
    interviewDate,
    interviewTime,
  });
}

function adminEmailHtml(
  body: SubmissionPayload,
  cvSignedUrl: string | null,
): string {
  const langSkills = body.langSkills ?? { german: "—", english: "—", hindi: "—" };
  const industries = (body.industries ?? []).join(", ") || "—";
  const licenses = (body.licenses ?? []).join(", ") || "—";

  return `
    <h2>New interview booking</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${body.firstName} ${body.lastName}</td></tr>
      <tr><td><strong>Email</strong></td><td>${body.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${body.phone}</td></tr>
      <tr><td><strong>Interview</strong></td><td>${body.interviewDate} ${body.interviewTime}</td></tr>
      <tr><td><strong>Visa</strong></td><td>${body.visaType}</td></tr>
      <tr><td><strong>Field of study</strong></td><td>${body.fieldOfStudy || "—"}</td></tr>
      <tr><td><strong>Work experience</strong></td><td>${body.workExp || "—"}</td></tr>
      <tr><td><strong>Languages</strong></td><td>DE ${langSkills.german}, EN ${langSkills.english}, HI ${langSkills.hindi}${body.otherLang ? `, ${body.otherLang}` : ""}</td></tr>
      <tr><td><strong>Industries</strong></td><td>${industries}</td></tr>
      <tr><td><strong>Licenses</strong></td><td>${licenses}</td></tr>
      <tr><td><strong>Forklift</strong></td><td>${body.forklift || "—"}</td></tr>
      <tr><td><strong>Language (UI)</strong></td><td>${body.language || "en"}</td></tr>
    </table>
    ${
      cvSignedUrl
        ? `<p><strong>CV download (valid 7 days):</strong><br><a href="${cvSignedUrl}">${cvSignedUrl}</a></p>`
        : "<p><em>No CV uploaded.</em></p>"
    }
  `;
}

function mapSubmissionRow(row: Record<string, unknown>, cvDownloadUrl: string | null) {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    fieldOfStudy: row.field_of_study,
    workExp: row.work_exp,
    langSkills: row.lang_skills,
    otherLang: row.other_lang,
    industries: row.industries,
    licenses: row.licenses,
    forklift: row.forklift,
    visaType: row.visa_type,
    interviewDate: row.interview_date,
    interviewTime: row.interview_time,
    submittedAt: row.submitted_at,
    cvName: row.cv_path ? String(row.cv_path).split("/").pop() : null,
    cvDownloadUrl,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const date = request.nextUrl.searchParams.get("date");
    const submissions = request.nextUrl.searchParams.get("submissions");

    const previewLang = request.nextUrl.searchParams.get("previewCandidateEmail");
    if (previewLang && process.env.NODE_ENV === "development") {
      const firstName = request.nextUrl.searchParams.get("firstName") ?? "Anna";
      const lastName = request.nextUrl.searchParams.get("lastName") ?? "Müller";
      const interviewDate = request.nextUrl.searchParams.get("date") ?? "2026-07-15";
      const interviewTime = request.nextUrl.searchParams.get("time") ?? "10:00";
      const mail = buildCandidateConfirmationEmail({
        lang: previewLang,
        firstName,
        lastName,
        interviewDate,
        interviewTime,
      });
      return new NextResponse(mail.html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (submissions === "true") {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Failed to load submissions:", error.message);
        return NextResponse.json({ error: "Could not load submissions" }, { status: 500 });
      }

      const mapped = await Promise.all(
        (data ?? []).map(async (row) => {
          let cvDownloadUrl: string | null = null;
          if (row.cv_path) {
            const { data: signed } = await supabase.storage
              .from(CV_BUCKET)
              .createSignedUrl(row.cv_path, SIGNED_URL_TTL);
            cvDownloadUrl = signed?.signedUrl ?? null;
          }
          return mapSubmissionRow(row, cvDownloadUrl);
        }),
      );

      return NextResponse.json({ submissions: mapped });
    }

    if (date) {
      const { data, error } = await supabase
        .from("slots")
        .select("interview_time")
        .eq("interview_date", date);

      if (error) {
        console.error("Failed to load slots:", error.message);
        return NextResponse.json({ error: "Could not load booked slots" }, { status: 500 });
      }

      const slots = (data ?? []).map((row) => row.interview_time as string);
      return NextResponse.json({ slots });
    }

    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  } catch (err) {
    console.error("GET /api/submit error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let cvPath: string | null = null;
  let supabase: SupabaseClient;

  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as SubmissionPayload;

    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const lastName = body.lastName!.trim();
    const firstName = body.firstName!.trim();
    const email = body.email!.trim();
    const phone = body.phone!.trim();
    const visaType = body.visaType!.trim();
    const interviewDate = body.interviewDate!.trim();
    const interviewTime = body.interviewTime!.trim();
    const bookedBy = `${firstName} ${lastName}`;

    const { data: existingSlot, error: slotCheckError } = await supabase
      .from("slots")
      .select("interview_time")
      .eq("interview_date", interviewDate)
      .eq("interview_time", interviewTime)
      .maybeSingle();

    if (slotCheckError) {
      console.error("Slot check failed:", slotCheckError.message);
      return NextResponse.json({ error: "Could not verify slot availability" }, { status: 500 });
    }

    if (existingSlot) {
      return NextResponse.json({ error: "slot already booked" }, { status: 409 });
    }

    if (body.cvBase64) {
      const cvBuffer = decodeBase64Cv(body.cvBase64);
      const fileName = `${sanitizePathSegment(lastName)}-${sanitizePathSegment(firstName)}-${Date.now()}.pdf`;
      cvPath = `${interviewDate}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(CV_BUCKET)
        .upload(cvPath, cvBuffer, { contentType: "application/pdf", upsert: false });

      if (uploadError) {
        console.error("CV upload failed:", uploadError.message);
        return NextResponse.json({ error: "Could not upload CV" }, { status: 500 });
      }
    }

    const { error: slotInsertError } = await supabase.from("slots").insert({
      interview_date: interviewDate,
      interview_time: interviewTime,
      booked_by: bookedBy,
    });

    if (slotInsertError) {
      console.error("Slot insert failed:", slotInsertError.message);
      if (cvPath) {
        await supabase.storage.from(CV_BUCKET).remove([cvPath]);
      }
      if (slotInsertError.code === "23505") {
        return NextResponse.json({ error: "slot already booked" }, { status: 409 });
      }
      return NextResponse.json({ error: "Could not book interview slot" }, { status: 500 });
    }

    const submittedAt = body.submittedAt ?? new Date().toISOString();

    const { error: submissionError } = await supabase.from("submissions").insert({
      last_name: lastName,
      first_name: firstName,
      email,
      phone,
      field_of_study: body.fieldOfStudy?.trim() || null,
      work_exp: body.workExp?.trim() || null,
      lang_skills: body.langSkills ?? null,
      other_lang: body.otherLang?.trim() || null,
      industries: body.industries ?? [],
      licenses: body.licenses ?? [],
      forklift: body.forklift ?? null,
      visa_type: visaType,
      cv_path: cvPath,
      interview_date: interviewDate,
      interview_time: interviewTime,
      submitted_at: submittedAt,
    });

    if (submissionError) {
      console.error("Submission insert failed:", submissionError.message);
      await supabase
        .from("slots")
        .delete()
        .eq("interview_date", interviewDate)
        .eq("interview_time", interviewTime);
      if (cvPath) {
        await supabase.storage.from(CV_BUCKET).remove([cvPath]);
      }
      return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
    }

    let cvSignedUrl: string | null = null;
    if (cvPath) {
      const { data: signed, error: signedError } = await supabase.storage
        .from(CV_BUCKET)
        .createSignedUrl(cvPath, SIGNED_URL_TTL);

      if (signedError) {
        console.error("Signed URL failed:", signedError.message);
        return NextResponse.json({ error: "Could not prepare CV download link" }, { status: 500 });
      }
      cvSignedUrl = signed.signedUrl;
    }

    const resend = getResend();
    const emailFrom = getEnv("EMAIL_FROM");
    const emailAdmin = getEnv("EMAIL_ADMIN_NOTIFY");
    const lang = body.language ?? "en";

    const candidateMail = candidateEmailContent(
      lang,
      firstName,
      lastName,
      interviewDate,
      interviewTime,
    );

    const { error: candidateEmailError } = await resend.emails.send({
      from: emailFrom,
      to: email,
      replyTo: emailAdmin,
      subject: candidateMail.subject,
      html: candidateMail.html,
    });

    if (candidateEmailError) {
      console.error("Candidate email failed:", candidateEmailError.message);
      return NextResponse.json({ error: "Could not send confirmation email" }, { status: 500 });
    }

    const { error: adminEmailError } = await resend.emails.send({
      from: emailFrom,
      to: emailAdmin,
      replyTo: email,
      subject: `New booking: ${firstName} ${lastName} — ${interviewDate} ${interviewTime}`,
      html: adminEmailHtml(body, cvSignedUrl),
    });

    if (adminEmailError) {
      console.error("Admin email failed:", adminEmailError.message);
      return NextResponse.json({ error: "Could not send admin notification" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/submit error:", err);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
