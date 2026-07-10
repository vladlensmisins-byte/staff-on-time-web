import { NextRequest, NextResponse } from "next/server";
import {
  addAdminComment,
  deleteAdminComment,
  parseAdminComments,
  serializeAdminComments,
  updateAdminComment,
} from "@/lib/admin-comments";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "edge";

type NoteAction = "add" | "update" | "delete";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      id?: string;
      action?: NoteAction;
      text?: string;
      commentId?: string;
    };

    const id = body.id?.trim();
    const action = body.action;

    if (!id || !action || !["add", "update", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: row, error: fetchError } = await supabase
      .from("submissions")
      .select("admin_note, submitted_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Admin note fetch failed:", fetchError.message);
      return NextResponse.json({ error: "Could not load comments" }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const comments = parseAdminComments(
      row.admin_note ? String(row.admin_note) : null,
      row.submitted_at ? String(row.submitted_at) : null,
    );

    let nextComments = comments;

    try {
      if (action === "add") {
        if (typeof body.text !== "string") {
          return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
        }
        nextComments = addAdminComment(comments, body.text);
      } else if (action === "update") {
        const commentId = body.commentId?.trim();
        if (!commentId || typeof body.text !== "string") {
          return NextResponse.json({ error: "Invalid update request" }, { status: 400 });
        }
        nextComments = updateAdminComment(comments, commentId, body.text);
      } else {
        const commentId = body.commentId?.trim();
        if (!commentId) {
          return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
        }
        nextComments = deleteAdminComment(comments, commentId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid comment action";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const adminNote = serializeAdminComments(nextComments);
    const { error } = await supabase.from("submissions").update({ admin_note: adminNote }).eq("id", id);

    if (error) {
      console.error("Admin note update failed:", error.message);
      return NextResponse.json({ error: "Could not update comments" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, adminComments: nextComments });
  } catch (err) {
    console.error("POST /api/admin-update-note error:", err);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
