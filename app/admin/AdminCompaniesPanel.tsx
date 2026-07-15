"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { COMPANY_STATUSES } from "@/lib/admin-auth";
import { COMPANY_STATUS_LABELS } from "@/lib/admin-i18n";
import type { AdminComment } from "@/lib/admin-comments";
import { getCommentPreviewText } from "@/lib/admin-comments";
import type { CompanyRow } from "@/lib/supabase-companies";
import AdminCallButton from "./AdminCallButton";
import {
  buildTerminPayloadFromCompany,
  submitAdminTermin,
  type TerminRow,
} from "@/lib/supabase-termins";
import { getTodayDateKey } from "@/lib/admin-lead-sort";
import { normalizeTerminDate } from "@/lib/termin-date";

type CompanyDraft = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string;
};

const EMPTY_CREATE: CompanyDraft & { notes: string } = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  notes: "",
  status: "new",
};

function toDraft(row: CompanyRow): CompanyDraft {
  return {
    companyName: row.companyName,
    contactPerson: row.contactPerson,
    email: row.email,
    phone: row.phone ?? "",
    status: row.status,
  };
}

function formatDateDe(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

type Props = {
  companies: CompanyRow[];
  onCompaniesChange: (companies: CompanyRow[]) => void;
  onTerminsChange: (termins: TerminRow[]) => void;
  termins: TerminRow[];
  onTerminCreated?: (date: string) => void;
  onReloadSchedule: () => Promise<void>;
  initialOpenId?: string | null;
  onInitialOpenHandled?: () => void;
};

export default function AdminCompaniesPanel({
  companies,
  onCompaniesChange,
  onTerminsChange,
  termins,
  onTerminCreated,
  onReloadSchedule,
  initialOpenId,
  onInitialOpenHandled,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createDraft, setCreateDraft] = useState(EMPTY_CREATE);
  const [creating, setCreating] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editDrafts, setEditDrafts] = useState<Record<string, CompanyDraft>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [terminCompanyId, setTerminCompanyId] = useState<string | null>(null);
  const [terminDate, setTerminDate] = useState("");
  const [terminTime, setTerminTime] = useState("");
  const [terminPhone, setTerminPhone] = useState("");
  const [savingTerminId, setSavingTerminId] = useState<string | null>(null);
  const [terminError, setTerminError] = useState("");
  const [newCommentDrafts, setNewCommentDrafts] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<{ companyId: string; commentId: string } | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-companies");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      onCompaniesChange(data.companies ?? []);
      await onReloadSchedule();
    } catch {
      setError("Unternehmen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [router, onCompaniesChange, onReloadSchedule]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (!initialOpenId || loading) return;

    const row = companies.find((company) => company.id === initialOpenId);
    if (!row) return;

    setExpandedIds((prev) => new Set(prev).add(initialOpenId));
    setEditDrafts((prev) => ({ ...prev, [initialOpenId]: toDraft(row) }));
    requestAnimationFrame(() => {
      document
        .getElementById(`admin-company-${initialOpenId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    onInitialOpenHandled?.();
  }, [initialOpenId, loading, companies, onInitialOpenHandled]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return companies.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!query) return true;
      const haystack =
        `${row.companyName} ${row.contactPerson} ${row.email} ${row.phone ?? ""} ${row.adminComments.map((c) => c.text).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [companies, search, statusFilter]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const row = companies.find((c) => c.id === id);
        if (row && !editDrafts[id]) {
          setEditDrafts((drafts) => ({ ...drafts, [id]: toDraft(row) }));
        }
      }
      return next;
    });
  }

  function updateCreateField<K extends keyof typeof EMPTY_CREATE>(key: K, value: (typeof EMPTY_CREATE)[K]) {
    setCreateDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditField(id: string, key: keyof CompanyDraft, value: string) {
    setEditDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_CREATE), [key]: value },
    }));
  }

  async function onCreate() {
    const companyName = createDraft.companyName.trim();
    if (!companyName) {
      setError("Bitte einen Firmennamen eingeben.");
      return;
    }

    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin-create-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson: createDraft.contactPerson.trim(),
          email: createDraft.email.trim(),
          phone: createDraft.phone.trim() || undefined,
          notes: createDraft.notes.trim() || undefined,
          status: createDraft.status,
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      const company = data.company as CompanyRow;
      onCompaniesChange([company, ...companies]);
      setCreateDraft(EMPTY_CREATE);
      setShowCreate(false);
      setExpandedIds((prev) => new Set(prev).add(company.id));
      setEditDrafts((prev) => ({ ...prev, [company.id]: toDraft(company) }));
    } catch {
      setError("Unternehmen konnte nicht angelegt werden.");
    } finally {
      setCreating(false);
    }
  }

  async function onStatusChange(id: string, status: string) {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin-update-company-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      onCompaniesChange(companies.map((row) => (row.id === id ? { ...row, status } : row)));
      setEditDrafts((prev) =>
        prev[id] ? { ...prev, [id]: { ...prev[id], status } } : prev,
      );
    } catch {
      setError("Status konnte nicht aktualisiert werden.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function onSave(id: string) {
    const draft = editDrafts[id];
    if (!draft) return;

    const companyName = draft.companyName.trim();
    if (!companyName) {
      setError("Bitte einen Firmennamen eingeben.");
      return;
    }

    setSavingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin-update-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          companyName,
          contactPerson: draft.contactPerson.trim(),
          email: draft.email.trim(),
          phone: draft.phone.trim() || null,
          status: draft.status,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      const company = data.company as CompanyRow;
      onCompaniesChange(companies.map((row) => (row.id === id ? company : row)));
      setEditDrafts((prev) => ({ ...prev, [id]: toDraft(company) }));
    } catch {
      setError("Änderungen konnten nicht gespeichert werden.");
    } finally {
      setSavingId(null);
    }
  }

  function openCompanyTerminForm(companyId: string) {
    const company = companies.find((row) => row.id === companyId);
    setExpandedIds((prev) => new Set(prev).add(companyId));
    setTerminCompanyId(companyId);
    setTerminDate(getTodayDateKey());
    setTerminTime("");
    setTerminPhone(company?.phone ?? "");
    setTerminError("");
    requestAnimationFrame(() => {
      document
        .getElementById(`admin-company-termin-${companyId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function closeCompanyTerminForm() {
    setTerminCompanyId(null);
    setTerminDate("");
    setTerminTime("");
    setTerminPhone("");
    setTerminError("");
  }

  function companyTermins(companyId: string): TerminRow[] {
    return termins
      .filter((termin) => termin.companyId === companyId)
      .sort((a, b) => a.terminDate.localeCompare(b.terminDate));
  }

  async function saveCompanyTermin(company: CompanyRow) {
    const date = normalizeTerminDate(terminDate);
    if (!date) {
      setTerminError("Bitte Datum wählen.");
      return;
    }

    setSavingTerminId(company.id);
    setTerminError("");
    try {
      const payload = buildTerminPayloadFromCompany(
        company,
        date,
        terminTime.trim() || undefined,
        terminPhone.trim() || undefined,
      );
      const saved = await submitAdminTermin(payload);
      onTerminsChange([...termins, saved].sort((a, b) => a.terminDate.localeCompare(b.terminDate)));

      const phone = terminPhone.trim();
      if (phone && phone !== (company.phone ?? "")) {
        onCompaniesChange(
          companies.map((row) => (row.id === company.id ? { ...row, phone } : row)),
        );
        try {
          await fetch("/api/admin-update-company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: company.id, phone }),
          });
        } catch {
          // Termin saved; phone sync is best-effort.
        }
      }

      closeCompanyTerminForm();
      onTerminCreated?.(saved.terminDate);
    } catch (err) {
      setTerminError(err instanceof Error ? err.message : "Termin konnte nicht gespeichert werden.");
    } finally {
      setSavingTerminId(null);
    }
  }

  function updateCompanyComments(companyId: string, adminComments: AdminComment[]) {
    onCompaniesChange(
      companies.map((row) => (row.id === companyId ? { ...row, adminComments } : row)),
    );
  }

  async function mutateCompanyComment(
    companyId: string,
    payload: { action: "add" | "update" | "delete"; text?: string; commentId?: string },
  ) {
    setSavingNoteId(companyId);
    setError("");
    try {
      const res = await fetch("/api/admin-update-company-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: companyId, ...payload }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        adminComments?: AdminComment[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Comment update failed");
      if (data.adminComments) {
        updateCompanyComments(companyId, data.adminComments);
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

  async function onAddComment(companyId: string) {
    const text = (newCommentDrafts[companyId] ?? "").trim();
    if (!text) return;
    const ok = await mutateCompanyComment(companyId, { action: "add", text });
    if (ok) {
      setNewCommentDrafts((prev) => ({ ...prev, [companyId]: "" }));
    }
  }

  function onStartEditComment(companyId: string, comment: AdminComment) {
    setEditingComment({ companyId, commentId: comment.id });
    setEditingDraft(comment.text);
  }

  function onCancelEditComment() {
    setEditingComment(null);
    setEditingDraft("");
  }

  async function onSaveEditedComment(companyId: string, commentId: string) {
    const text = editingDraft.trim();
    if (!text) return;
    const ok = await mutateCompanyComment(companyId, { action: "update", commentId, text });
    if (ok) onCancelEditComment();
  }

  async function onDeleteComment(companyId: string, commentId: string) {
    const confirmed = window.confirm("Diesen Kommentar löschen?");
    if (!confirmed) return;
    const ok = await mutateCompanyComment(companyId, { action: "delete", commentId });
    if (ok && editingComment?.commentId === commentId) {
      onCancelEditComment();
    }
  }

  async function onDelete(id: string, label: string) {
    const confirmed = window.confirm(`„${label}" wirklich löschen?`);
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin-delete-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      onCompaniesChange(companies.filter((row) => row.id !== id));
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setEditDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      setError("Unternehmen konnte nicht gelöscht werden.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-panel-section">
      <div className="admin-section-head">
        <p className="admin-muted admin-section-lead">
          Partner und Unternehmen verwalten — Kontaktstatus, Notizen und Ansprechpartner auf einen Blick.
        </p>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? "Formular schließen" : "+ Neues Unternehmen"}
        </button>
      </div>

      {showCreate ? (
        <section className="admin-create-form">
          <h2>Neues Unternehmen anlegen</h2>
          <div className="admin-form-grid">
            <label>
              <span>Firmenname *</span>
              <input
                type="text"
                value={createDraft.companyName}
                onChange={(e) => updateCreateField("companyName", e.target.value)}
                placeholder="z. B. Logistik GmbH"
              />
            </label>
            <label>
              <span>Ansprechpartner</span>
              <input
                type="text"
                value={createDraft.contactPerson}
                onChange={(e) => updateCreateField("contactPerson", e.target.value)}
                placeholder="Name der Kontaktperson"
              />
            </label>
            <label>
              <span>E-Mail</span>
              <input
                type="email"
                value={createDraft.email}
                onChange={(e) => updateCreateField("email", e.target.value)}
                placeholder="kontakt@firma.de"
              />
            </label>
            <label>
              <span>Telefon</span>
              <div className="admin-phone-row">
                <input
                  type="tel"
                  value={createDraft.phone}
                  onChange={(e) => updateCreateField("phone", e.target.value)}
                  placeholder="+49 …"
                />
                <AdminCallButton phone={createDraft.phone} compact />
              </div>
            </label>
            <label className="admin-form-wide">
              <span>Status</span>
              <select
                value={createDraft.status}
                onChange={(e) => updateCreateField("status", e.target.value)}
              >
                {COMPANY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {COMPANY_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-form-wide">
              <span>Kommentar / Notizen</span>
              <textarea
                className="admin-note-input"
                value={createDraft.notes}
                onChange={(e) => updateCreateField("notes", e.target.value)}
                placeholder="Kontaktverlauf, Notizen…"
              />
            </label>
          </div>
          <div className="admin-note-actions">
            <button
              type="button"
              className="admin-btn-secondary"
              disabled={creating}
              onClick={onCreate}
            >
              {creating ? "Wird angelegt…" : "Unternehmen speichern"}
            </button>
          </div>
        </section>
      ) : null}

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Firma, Ansprechpartner oder E-Mail suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Alle Status</option>
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COMPANY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button type="button" className="admin-btn-secondary" onClick={loadCompanies}>
          Aktualisieren
        </button>
      </div>

      {loading ? <p className="admin-muted">Unternehmen werden geladen…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {!loading && filtered.length === 0 ? (
        <p className="admin-muted">Keine Unternehmen gefunden.</p>
      ) : null}

      <div className="admin-list">
        {filtered.map((row) => {
          const expanded = expandedIds.has(row.id);
          const draft = editDrafts[row.id] ?? toDraft(row);
          const isWaiting = row.status === "waiting_reply";
          const isActive = row.status === "active";
          const isClosed = row.status === "no_interest";

          return (
            <article
              key={row.id}
              id={`admin-company-${row.id}`}
              className={`admin-card${expanded ? " is-expanded" : ""}${isWaiting ? " is-waiting" : ""}${isActive ? " is-active-partner" : ""}${isClosed ? " is-closed" : ""}`}
            >
              <div className="admin-card-summary">
                <button
                  type="button"
                  className="admin-card-toggle"
                  onClick={() => toggleExpanded(row.id)}
                  aria-expanded={expanded}
                >
                  <span className="admin-card-name">{row.companyName}</span>
                  <span className="admin-card-meta">
                    {row.contactPerson ? <span>{row.contactPerson}</span> : null}
                    {row.email ? <span>{row.email}</span> : null}
                    {row.phone ? <span>{row.phone}</span> : null}
                    <span className={`admin-status-pill status-${row.status}`}>
                      {COMPANY_STATUS_LABELS[row.status] || row.status}
                    </span>
                    {getCommentPreviewText(row.adminComments) ? (
                      <span>{getCommentPreviewText(row.adminComments)}</span>
                    ) : null}
                    <span>Aktualisiert {formatDateDe(row.updatedAt)}</span>
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
                    {COMPANY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {COMPANY_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <AdminCallButton phone={row.phone} compact />
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => toggleExpanded(row.id)}
                  >
                    {expanded ? "Schließen" : "Bearbeiten"}
                  </button>
                  {expanded ? (
                    <button
                      type="button"
                      className="admin-btn-termin"
                      onClick={() => openCompanyTerminForm(row.id)}
                    >
                      + Termin
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="admin-btn-danger"
                    disabled={deletingId === row.id}
                    onClick={() => onDelete(row.id, row.companyName)}
                  >
                    {deletingId === row.id ? "Wird gelöscht…" : "Löschen"}
                  </button>
                </div>
              </div>

              {expanded ? (
                <div className="admin-card-details">
                  <div
                    id={`admin-company-termin-${row.id}`}
                    className="admin-company-termin-block admin-company-termin-block-top"
                  >
                    <div className="admin-company-termin-head">
                      <h3>Kalender-Termin</h3>
                      {terminCompanyId !== row.id ? (
                        <button
                          type="button"
                          className="admin-btn-termin"
                          onClick={() => openCompanyTerminForm(row.id)}
                        >
                          + Termin hinzufügen
                        </button>
                      ) : null}
                    </div>

                    {companyTermins(row.id).length > 0 ? (
                      <ul className="admin-company-termin-list">
                        {companyTermins(row.id).map((termin) => (
                          <li key={termin.id}>
                            {termin.terminDate.split("-").reverse().join(".")}
                            {termin.terminTime ? ` · ${termin.terminTime}` : ""}
                            <span className="admin-schedule-badge is-business">Business</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="admin-muted">Noch kein Termin — Datum und Uhrzeit unten eintragen.</p>
                    )}

                    {terminCompanyId === row.id ? (
                      <div className="admin-company-termin-form">
                        <div className="admin-form-grid">
                          <label>
                            <span>Datum *</span>
                            <input
                              type="date"
                              value={terminDate}
                              onChange={(e) => setTerminDate(e.target.value)}
                            />
                          </label>
                          <label>
                            <span>Uhrzeit</span>
                            <input
                              type="time"
                              value={terminTime}
                              onChange={(e) => setTerminTime(e.target.value)}
                            />
                          </label>
                          <label className="admin-form-wide">
                            <span>Telefon (für Termin & Anruf)</span>
                            <div className="admin-phone-row">
                              <input
                                type="tel"
                                value={terminPhone}
                                onChange={(e) => setTerminPhone(e.target.value)}
                                placeholder="+49 …"
                              />
                              <AdminCallButton phone={terminPhone} compact />
                            </div>
                          </label>
                        </div>
                        <p className="admin-muted admin-company-termin-hint">
                          <strong>{row.companyName}</strong> wird automatisch in den Terminplan eingetragen.
                        </p>
                        {terminError ? <p className="admin-error">{terminError}</p> : null}
                        <div className="admin-note-actions">
                          <button
                            type="button"
                            className="admin-btn-termin"
                            disabled={savingTerminId === row.id}
                            onClick={() => saveCompanyTermin(row)}
                          >
                            {savingTerminId === row.id ? "Speichert…" : "In Kalender speichern"}
                          </button>
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={closeCompanyTerminForm}
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="admin-form-grid">
                    <label>
                      <span>Firmenname *</span>
                      <input
                        type="text"
                        value={draft.companyName}
                        onChange={(e) => updateEditField(row.id, "companyName", e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Ansprechpartner</span>
                      <input
                        type="text"
                        value={draft.contactPerson}
                        onChange={(e) => updateEditField(row.id, "contactPerson", e.target.value)}
                      />
                    </label>
                    <label>
                      <span>E-Mail</span>
                      <input
                        type="email"
                        value={draft.email}
                        onChange={(e) => updateEditField(row.id, "email", e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Telefon</span>
                      <div className="admin-phone-row">
                        <input
                          type="tel"
                          value={draft.phone}
                          onChange={(e) => updateEditField(row.id, "phone", e.target.value)}
                        />
                        <AdminCallButton phone={draft.phone} compact />
                      </div>
                    </label>
                    <label className="admin-form-wide">
                      <span>Status</span>
                      <select
                        value={draft.status}
                        onChange={(e) => updateEditField(row.id, "status", e.target.value)}
                      >
                        {COMPANY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {COMPANY_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="admin-form-wide">
                      <span>Kommentare</span>
                      <div className="admin-comments">
                        {row.adminComments.length === 0 ? (
                          <p className="admin-muted">Noch keine Kommentare.</p>
                        ) : (
                          <ul className="admin-comment-list">
                            {row.adminComments.map((comment) => {
                              const isEditing =
                                editingComment?.companyId === row.id &&
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
                                          {savingNoteId === row.id ? "Speichert…" : "Speichern"}
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
                          placeholder="Neuen Kommentar hinzufügen…"
                          onChange={(e) =>
                            setNewCommentDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                        />
                        <div className="admin-note-actions">
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            disabled={
                              savingNoteId === row.id || !(newCommentDrafts[row.id] ?? "").trim()
                            }
                            onClick={() => onAddComment(row.id)}
                          >
                            {savingNoteId === row.id ? "Speichert…" : "Kommentar hinzufügen"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-company-meta">
                    <span>Angelegt: {formatDateDe(row.createdAt)}</span>
                    <span>Zuletzt geändert: {formatDateDe(row.updatedAt)}</span>
                    {draft.email ? (
                      <a href={`mailto:${draft.email}`}>E-Mail senden</a>
                    ) : null}
                    <AdminCallButton phone={draft.phone} />
                  </div>

                  <div className="admin-note-actions">
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      disabled={savingId === row.id}
                      onClick={() => onSave(row.id)}
                    >
                      {savingId === row.id ? "Speichert…" : "Änderungen speichern"}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
