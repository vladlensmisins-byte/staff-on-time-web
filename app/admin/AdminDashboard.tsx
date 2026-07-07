"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SUBMISSION_STATUSES } from "@/lib/admin-auth";
import type { SubmissionRow } from "@/lib/supabase-admin";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  interview_scheduled: "Interview scheduled",
  hired: "Hired",
  rejected: "Rejected",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      setError("Could not load submissions.");
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

  async function onStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin-update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setSubmissions((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch {
      setError("Could not update status. Please try again.");
    } finally {
      setUpdatingId(null);
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
          <h1>Submissions</h1>
        </div>
        <button type="button" className="admin-btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="admin-main">
        <div className="admin-toolbar">
          <input
            type="search"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {SUBMISSION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <button type="button" className="admin-btn-secondary" onClick={loadSubmissions}>
            Refresh
          </button>
        </div>

        {loading ? <p className="admin-muted">Loading submissions...</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="admin-muted">No submissions found.</p>
        ) : null}

        <div className="admin-list">
          {filtered.map((row) => (
            <article key={row.id} className="admin-card">
              <div className="admin-card-top">
                <div>
                  <h2>
                    {row.firstName} {row.lastName}
                  </h2>
                  <p className="admin-muted">
                    Submitted {new Date(row.submittedAt).toLocaleString("de-DE")}
                  </p>
                </div>
                <select
                  value={row.status}
                  disabled={updatingId === row.id}
                  onChange={(e) => onStatusChange(row.id, e.target.value)}
                  className="admin-status-select"
                >
                  {SUBMISSION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-grid">
                <div>
                  <span>Email</span>
                  <strong>{row.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{row.phone}</strong>
                </div>
                <div>
                  <span>Date of birth</span>
                  <strong>{row.birthDate || "—"}</strong>
                </div>
                <div>
                  <span>Interview</span>
                  <strong>
                    {row.interviewDate || "—"} {row.interviewTime || ""}
                  </strong>
                </div>
                <div>
                  <span>Visa</span>
                  <strong>{row.visaType || "—"}</strong>
                </div>
                <div>
                  <span>Industries</span>
                  <strong>{row.industries.join(", ") || "—"}</strong>
                </div>
                <div>
                  <span>Licenses</span>
                  <strong>{row.licenses.join(", ") || "—"}</strong>
                </div>
                <div>
                  <span>Forklift</span>
                  <strong>{row.forklift || "—"}</strong>
                </div>
                <div className="admin-grid-wide">
                  <span>Languages</span>
                  <strong>
                    DE {row.langSkills?.german || "—"}, EN {row.langSkills?.english || "—"}
                    {row.otherLang ? `, ${row.otherLang}` : ""}
                  </strong>
                </div>
                {row.fieldOfStudy ? (
                  <div className="admin-grid-wide">
                    <span>Qualification</span>
                    <strong>{row.fieldOfStudy}</strong>
                  </div>
                ) : null}
                {row.workExp ? (
                  <div className="admin-grid-wide">
                    <span>Experience</span>
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
                  Download CV{row.cvName ? ` (${row.cvName})` : ""}
                </a>
              ) : (
                <p className="admin-muted">No CV uploaded</p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
