"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBMISSION_STATUSES } from "@/lib/admin-auth";
import {
  ADMIN_STATUS_LABELS,
  formatInterviewDe,
  labelForklift,
  labelIndustry,
  labelInterviewType,
  labelLevel,
  labelLicense,
  labelVisa,
} from "@/lib/admin-i18n";
import type { AdminComment } from "@/lib/admin-comments";
import type { SubmissionRow } from "@/lib/supabase-admin";
import { getTodayDateKey, isCompletedLeadStatus, sortLeadsForAdmin } from "@/lib/admin-lead-sort";
import AdminSchedulePanel from "./AdminSchedulePanel";

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [newCommentDrafts, setNewCommentDrafts] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<{ submissionId: string; commentId: string } | null>(null);
  const [editingDraft, setEditingDraft] = useState("");

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-submissions");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
    } catch {
      setError("Bewerbungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const interviewDates = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of submissions) {
      if (!row.interviewDate) continue;
      counts.set(row.interviewDate, (counts.get(row.interviewDate) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [submissions]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = submissions.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (dateFilter !== "all" && row.interviewDate !== dateFilter) return false;
      if (!query) return true;
      const haystack = `${row.firstName} ${row.lastName} ${row.email} ${row.phone}`.toLowerCase();
      return haystack.includes(query);
    });
    return sortLeadsForAdmin(rows, dateFilter);
  }, [submissions, search, statusFilter, dateFilter]);

  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  function openLead(id: string) {
    setExpandedIds((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      document.getElementById(`admin-lead-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function formatDateFilterLabel(isoDate: string, count: number): string {
    const [year, month, day] = isoDate.split("-");
    const label = year && month && day ? `${day}.${month}.${year}` : isoDate;
    const todaySuffix = isoDate === todayDateKey ? " · Heute" : "";
    return `${label}${todaySuffix} (${count})`;
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onStatusChange(id: string, status: string) {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin-update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setSubmissions((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch {
      setError("Status konnte nicht aktualisiert werden. Bitte erneut versuchen.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function onDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Bewerbung von ${name} löschen? Dies kann nicht rückgängig gemacht werden.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin-delete-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setSubmissions((rows) => rows.filter((row) => row.id !== id));
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch {
      setError("Bewerbung konnte nicht gelöscht werden. Bitte erneut versuchen.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatCommentTimestamp(comment: AdminComment): string {
    const created = new Date(comment.createdAt).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!comment.updatedAt) return created;
    const updated = new Date(comment.updatedAt).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${created} · bearbeitet ${updated}`;
  }

  function onNewCommentInput(submissionId: string, text: string) {
    setNewCommentDrafts((prev) => ({ ...prev, [submissionId]: text }));
  }

  function updateSubmissionComments(submissionId: string, adminComments: AdminComment[]) {
    setSubmissions((rows) =>
      rows.map((row) => (row.id === submissionId ? { ...row, adminComments } : row)),
    );
  }

  async function mutateComment(
    submissionId: string,
    payload: { action: "add" | "update" | "delete"; text?: string; commentId?: string },
  ) {
    setSavingNoteId(submissionId);
    setError("");
    try {
      const res = await fetch("/api/admin-update-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId, ...payload }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        adminComments?: AdminComment[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Comment update failed");
      if (data.adminComments) {
        updateSubmissionComments(submissionId, data.adminComments);
      }
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Kommentar konnte nicht gespeichert werden.";
      setError(message);
      return false;
    } finally {
      setSavingNoteId(null);
    }
  }

  async function onAddComment(submissionId: string) {
    const text = (newCommentDrafts[submissionId] ?? "").trim();
    if (!text) return;
    const ok = await mutateComment(submissionId, { action: "add", text });
    if (ok) {
      setNewCommentDrafts((prev) => ({ ...prev, [submissionId]: "" }));
    }
  }

  function onStartEditComment(submissionId: string, comment: AdminComment) {
    setEditingComment({ submissionId, commentId: comment.id });
    setEditingDraft(comment.text);
  }

  function onCancelEditComment() {
    setEditingComment(null);
    setEditingDraft("");
  }

  async function onSaveEditedComment(submissionId: string, commentId: string) {
    const text = editingDraft.trim();
    if (!text) return;
    const ok = await mutateComment(submissionId, { action: "update", commentId, text });
    if (ok) onCancelEditComment();
  }

  async function onDeleteComment(submissionId: string, commentId: string) {
    const confirmed = window.confirm("Diesen Kommentar löschen?");
    if (!confirmed) return;
    const ok = await mutateComment(submissionId, { action: "delete", commentId });
    if (ok && editingComment?.commentId === commentId) {
      onCancelEditComment();
    }
  }

  function getCommentPreview(comments: AdminComment[]): string | null {
    if (comments.length === 0) return null;
    const latest = comments[comments.length - 1];
    const prefix = comments.length > 1 ? `${comments.length} Kommentare · ` : "Kommentar · ";
    return `${prefix}${latest.text}`;
  }

  return (
    <main className="admin-main">
        <AdminSchedulePanel
          submissions={submissions}
          selectedDate={dateFilter}
          onSelectDate={setDateFilter}
          onOpenLead={openLead}
        />

        <div className="admin-toolbar">
          <input
            type="search"
            placeholder="Name oder E-Mail suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Alle Status</option>
            {SUBMISSION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ADMIN_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">Alle Interview-Tage</option>
            {interviewDates.map(([date, count]) => (
              <option key={date} value={date}>
                {formatDateFilterLabel(date, count)}
              </option>
            ))}
          </select>
          <button type="button" className="admin-btn-secondary" onClick={loadSubmissions}>
            Aktualisieren
          </button>
        </div>

        {loading ? <p className="admin-muted">Bewerbungen werden geladen...</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="admin-muted">Keine Bewerbungen gefunden.</p>
        ) : null}

        <div className="admin-list">
          {filtered.map((row) => {
            const expanded = expandedIds.has(row.id);
            const fullName = `${row.firstName} ${row.lastName}`.trim();

            const isCompleted = isCompletedLeadStatus(row.status);

            return (
              <article
                key={row.id}
                id={`admin-lead-${row.id}`}
                className={`admin-card${expanded ? " is-expanded" : ""}${isCompleted ? " is-completed" : ""}`}
              >
                <div className="admin-card-summary">
                  <button
                    type="button"
                    className="admin-card-toggle"
                    onClick={() => toggleExpanded(row.id)}
                    aria-expanded={expanded}
                  >
                    <span className="admin-card-name">{fullName}</span>
                    <span className="admin-card-meta">
                      <span>{formatInterviewDe(row.interviewDate, row.interviewTime)}</span>
                      <span className={`admin-status-pill status-${row.status}`}>
                        {ADMIN_STATUS_LABELS[row.status] || row.status}
                      </span>
                      {getCommentPreview(row.adminComments) ? (
                        <span>{getCommentPreview(row.adminComments)}</span>
                      ) : null}
                      <span>
                        Eingegangen am{" "}
                        {new Date(row.submittedAt).toLocaleDateString("de-DE")}
                      </span>
                    </span>
                  </button>

                  <div className="admin-card-actions">
                    <select
                      value={row.status}
                      disabled={updatingId === row.id || deletingId === row.id}
                      onChange={(e) => onStatusChange(row.id, e.target.value)}
                      className="admin-status-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {SUBMISSION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {ADMIN_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => toggleExpanded(row.id)}
                    >
                      {expanded ? "Schließen" : "Details"}
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      disabled={deletingId === row.id}
                      onClick={() => onDelete(row.id, fullName)}
                    >
                      {deletingId === row.id ? "Wird gelöscht..." : "Löschen"}
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <div className="admin-card-details">
                    <div className="admin-grid">
                      <div>
                        <span>E-Mail</span>
                        <strong>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </strong>
                      </div>
                      <div>
                        <span>Telefon</span>
                        <strong>
                          <a href={`tel:${row.phone}`}>{row.phone}</a>
                        </strong>
                      </div>
                      <div>
                        <span>Geburtsdatum</span>
                        <strong>{row.birthDate || "—"}</strong>
                      </div>
                      <div>
                        <span>Terminart</span>
                        <strong>{labelInterviewType(row.interviewType)}</strong>
                      </div>
                      <div>
                        <span>Online-Gespräch</span>
                        <strong>{formatInterviewDe(row.interviewDate, row.interviewTime)}</strong>
                      </div>
                      <div>
                        <span>Visum</span>
                        <strong>{labelVisa(row.visaType)}</strong>
                      </div>
                      <div>
                        <span>Branchen</span>
                        <strong>
                          {row.industries.map(labelIndustry).join(", ") || "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Führerschein</span>
                        <strong>
                          {row.licenses.map(labelLicense).join(", ") || "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Gabelstapler-Schein</span>
                        <strong>{labelForklift(row.forklift)}</strong>
                      </div>
                      <div className="admin-grid-wide">
                        <span>Sprachen</span>
                        <strong>
                          Deutsch {labelLevel(row.langSkills?.german)}, Englisch{" "}
                          {labelLevel(row.langSkills?.english)}
                          {row.otherLang ? `, ${row.otherLang}` : ""}
                        </strong>
                      </div>
                      {row.fieldOfStudy ? (
                        <div className="admin-grid-wide">
                          <span>Qualifikation</span>
                          <strong>{row.fieldOfStudy}</strong>
                        </div>
                      ) : null}
                      {row.workExp ? (
                        <div className="admin-grid-wide">
                          <span>Berufserfahrung</span>
                          <strong>{row.workExp}</strong>
                        </div>
                      ) : null}
                      <div className="admin-grid-wide">
                        <span>Kommentare</span>
                        <div className="admin-comments">
                          {row.adminComments.length === 0 ? (
                            <p className="admin-muted">Noch keine Kommentare.</p>
                          ) : (
                            <ul className="admin-comment-list">
                              {row.adminComments.map((comment) => {
                                const isEditing =
                                  editingComment?.submissionId === row.id &&
                                  editingComment.commentId === comment.id;

                                return (
                                  <li key={comment.id} className="admin-comment-item">
                                    <div className="admin-comment-meta">
                                      {formatCommentTimestamp(comment)}
                                    </div>
                                    {isEditing ? (
                                      <>
                                        <textarea
                                          className="admin-note-input"
                                          value={editingDraft}
                                          onChange={(e) => setEditingDraft(e.target.value)}
                                        />
                                        <div className="admin-note-actions">
                                          <button
                                            type="button"
                                            className="admin-btn-secondary"
                                            disabled={savingNoteId === row.id}
                                            onClick={() => onSaveEditedComment(row.id, comment.id)}
                                          >
                                            {savingNoteId === row.id ? "Speichert..." : "Speichern"}
                                          </button>
                                          <button
                                            type="button"
                                            className="admin-btn-secondary"
                                            disabled={savingNoteId === row.id}
                                            onClick={onCancelEditComment}
                                          >
                                            Abbrechen
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <p className="admin-comment-text">{comment.text}</p>
                                        <div className="admin-note-actions">
                                          <button
                                            type="button"
                                            className="admin-btn-secondary"
                                            disabled={savingNoteId === row.id}
                                            onClick={() => onStartEditComment(row.id, comment)}
                                          >
                                            Bearbeiten
                                          </button>
                                          <button
                                            type="button"
                                            className="admin-btn-danger"
                                            disabled={savingNoteId === row.id}
                                            onClick={() => onDeleteComment(row.id, comment.id)}
                                          >
                                            Löschen
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}

                          <textarea
                            className="admin-note-input"
                            value={newCommentDrafts[row.id] ?? ""}
                            placeholder="Neuen Kommentar hinzufügen..."
                            onChange={(e) => onNewCommentInput(row.id, e.target.value)}
                          />
                          <div className="admin-note-actions">
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              disabled={savingNoteId === row.id || !(newCommentDrafts[row.id] ?? "").trim()}
                              onClick={() => onAddComment(row.id)}
                            >
                              {savingNoteId === row.id ? "Speichert..." : "Kommentar hinzufügen"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {row.cvFiles.length > 0 ? (
                      <div className="admin-cv-links">
                        {row.cvFiles.map((file) => (
                          <a
                            key={file.downloadUrl}
                            className="admin-cv-link"
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lebenslauf herunterladen ({file.name})
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="admin-muted">Kein Lebenslauf hochgeladen</p>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
    </main>
  );
}
