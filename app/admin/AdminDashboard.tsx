"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBMISSION_STATUSES } from "@/lib/admin-auth";
import {
  ADMIN_STATUS_LABELS,
  formatInterviewDe,
  labelForklift,
  labelIndustry,
  labelLevel,
  labelLicense,
  labelVisa,
} from "@/lib/admin-i18n";
import type { SubmissionRow } from "@/lib/supabase-admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!query) return true;
      const haystack = `${row.firstName} ${row.lastName} ${row.email}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [submissions, search, statusFilter]);

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

  async function onLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-brand">
            staffontime<span className="dot">.</span>
          </div>
          <h1>Bewerbungen</h1>
        </div>
        <button type="button" className="admin-btn-secondary" onClick={onLogout}>
          Abmelden
        </button>
      </header>

      <main className="admin-main">
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

            return (
              <article key={row.id} className={`admin-card${expanded ? " is-expanded" : ""}`}>
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
                        <span>Interview</span>
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
                    </div>

                    {row.cvDownloadUrl ? (
                      <a
                        className="admin-cv-link"
                        href={row.cvDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lebenslauf herunterladen{row.cvName ? ` (${row.cvName})` : ""}
                      </a>
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
    </div>
  );
}
