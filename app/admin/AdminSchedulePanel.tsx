"use client";

import { useMemo, useState } from "react";
import {
  buildScheduleEntries,
  groupScheduleByDate,
  scheduleEntryKey,
  type ScheduleEntry,
} from "@/lib/admin-schedule";
import { labelInterviewType } from "@/lib/admin-i18n";
import { getTodayDateKey } from "@/lib/admin-lead-sort";
import type { CompanyRow } from "@/lib/supabase-companies";
import type { SubmissionRow } from "@/lib/supabase-admin";
import type { TerminKind, TerminRow } from "@/lib/supabase-termins";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

type TerminDraft = {
  title: string;
  terminDate: string;
  terminTime: string;
  kind: TerminKind;
  contactPerson: string;
  phone: string;
  email: string;
  notes: string;
};

const EMPTY_TERMIN: TerminDraft = {
  title: "",
  terminDate: "",
  terminTime: "",
  kind: "business",
  contactPerson: "",
  phone: "",
  email: "",
  notes: "",
};

function normalizeTime(time: string | null): string {
  if (!time) return "—";
  return time.slice(0, 5);
}

function formatDateKeyDe(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function countBusinessOnDate(rows: ScheduleEntry[]): number {
  return rows.filter((row) => row.kind === "business").length;
}

function terminToDraft(termin: TerminRow): TerminDraft {
  return {
    title: termin.title,
    terminDate: termin.terminDate,
    terminTime: termin.terminTime ?? "",
    kind: termin.kind,
    contactPerson: termin.contactPerson,
    phone: termin.phone ?? "",
    email: termin.email ?? "",
    notes: termin.notes ?? "",
  };
}

type Props = {
  submissions: SubmissionRow[];
  companies: CompanyRow[];
  termins: TerminRow[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenLead: (id: string) => void;
  onOpenCompany: (id: string) => void;
  onTerminsChange: (termins: TerminRow[]) => void;
};

export default function AdminSchedulePanel({
  submissions,
  companies,
  termins,
  selectedDate,
  onSelectDate,
  onOpenLead,
  onOpenCompany,
  onTerminsChange,
}: Props) {
  const today = getTodayDateKey();
  const scheduleEntries = useMemo(
    () => buildScheduleEntries(submissions, companies, termins),
    [submissions, companies, termins],
  );
  const scheduleMap = useMemo(() => groupScheduleByDate(scheduleEntries), [scheduleEntries]);

  const initialMonth = useMemo(() => {
    if (selectedDate && selectedDate !== "all") {
      const [y, m] = selectedDate.split("-").map(Number);
      if (y && m) return { year: y, month: m - 1 };
    }
    const firstDate = [...scheduleMap.keys()].sort()[0];
    if (firstDate) {
      const [y, m] = firstDate.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [scheduleMap, selectedDate]);

  const [expanded, setExpanded] = useState(false);
  const [viewYear, setViewYear] = useState(initialMonth.year);
  const [viewMonth, setViewMonth] = useState(initialMonth.month);
  const [showTerminForm, setShowTerminForm] = useState(false);
  const [terminDraft, setTerminDraft] = useState<TerminDraft>(EMPTY_TERMIN);
  const [editingTerminId, setEditingTerminId] = useState<string | null>(null);
  const [savingTermin, setSavingTermin] = useState(false);
  const [deletingTerminId, setDeletingTerminId] = useState<string | null>(null);
  const [terminError, setTerminError] = useState("");

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{
      key: string | null;
      day: number | null;
      count: number;
      businessCount: number;
    }> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: null, day: null, count: 0, businessCount: 0 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = toDateKey(viewYear, viewMonth, day);
      const rows = scheduleMap.get(key) ?? [];
      cells.push({
        key,
        day,
        count: rows.length,
        businessCount: countBusinessOnDate(rows),
      });
    }

    return cells;
  }, [viewYear, viewMonth, scheduleMap]);

  const selectedRows = selectedDate !== "all" ? (scheduleMap.get(selectedDate) ?? []) : [];
  const upcomingDates = useMemo(
    () => [...scheduleMap.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [scheduleMap],
  );

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function selectDate(date: string) {
    onSelectDate(date);
    if (date !== "all") {
      const [y, m] = date.split("-").map(Number);
      if (y && m) {
        setViewYear(y);
        setViewMonth(m - 1);
      }
    }
  }

  function openCreateTerminForm(prefillDate?: string) {
    setEditingTerminId(null);
    setTerminDraft({
      ...EMPTY_TERMIN,
      terminDate: prefillDate && prefillDate !== "all" ? prefillDate : today,
    });
    setTerminError("");
    setShowTerminForm(true);
  }

  function openEditTermin(termin: TerminRow) {
    setEditingTerminId(termin.id);
    setTerminDraft(terminToDraft(termin));
    setTerminError("");
    setShowTerminForm(true);
  }

  function closeTerminForm() {
    setShowTerminForm(false);
    setEditingTerminId(null);
    setTerminDraft(EMPTY_TERMIN);
    setTerminError("");
  }

  function updateDraft<K extends keyof TerminDraft>(key: K, value: TerminDraft[K]) {
    setTerminDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function saveTermin() {
    const title = terminDraft.title.trim();
    const terminDate = terminDraft.terminDate.trim();
    if (!title || !terminDate) {
      setTerminError("Bitte Titel und Datum ausfüllen.");
      return;
    }

    setSavingTermin(true);
    setTerminError("");
    try {
      const payload = {
        title,
        terminDate,
        terminTime: terminDraft.terminTime.trim() || undefined,
        kind: terminDraft.kind,
        contactPerson: terminDraft.contactPerson.trim(),
        phone: terminDraft.phone.trim() || undefined,
        email: terminDraft.email.trim() || undefined,
        notes: terminDraft.notes.trim() || undefined,
      };

      const endpoint = editingTerminId ? "/api/admin-update-termin" : "/api/admin-create-termin";
      const body = editingTerminId ? { id: editingTerminId, ...payload } : payload;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      const saved = data.termin as TerminRow;

      if (editingTerminId) {
        onTerminsChange(termins.map((row) => (row.id === saved.id ? saved : row)));
      } else {
        onTerminsChange([...termins, saved].sort((a, b) => a.terminDate.localeCompare(b.terminDate)));
      }

      selectDate(saved.terminDate);
      closeTerminForm();
    } catch {
      setTerminError("Termin konnte nicht gespeichert werden.");
    } finally {
      setSavingTermin(false);
    }
  }

  async function deleteTermin(id: string, label: string) {
    const confirmed = window.confirm(`Termin „${label}" wirklich löschen?`);
    if (!confirmed) return;

    setDeletingTerminId(id);
    setTerminError("");
    try {
      const res = await fetch("/api/admin-delete-termin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      onTerminsChange(termins.filter((row) => row.id !== id));
      if (editingTerminId === id) closeTerminForm();
    } catch {
      setTerminError("Termin konnte nicht gelöscht werden.");
    } finally {
      setDeletingTerminId(null);
    }
  }

  function renderBadge(entry: ScheduleEntry) {
    if (entry.kind === "business") {
      return <span className="admin-schedule-badge is-business">Business</span>;
    }
    return <span className="admin-schedule-badge is-applicant">Bewerbung</span>;
  }

  function renderTimeline(rows: ScheduleEntry[]) {
    if (rows.length === 0) {
      return <p className="admin-muted">Keine Termine an diesem Tag.</p>;
    }

    return (
      <ul className="admin-schedule-timeline">
        {rows.map((row) => {
          const key = scheduleEntryKey(row);

          if (row.source === "manual") {
            const manualTermin = termins.find((termin) => termin.id === row.id);
            return (
              <li
                key={key}
                className={`admin-schedule-slot is-manual${row.kind === "business" ? " is-business" : " is-applicant"}`}
              >
                <span className="admin-schedule-time">{normalizeTime(row.time)}</span>
                <div className="admin-schedule-slot-body">
                  <button
                    type="button"
                    className="admin-schedule-name"
                    onClick={() => manualTermin && openEditTermin(manualTermin)}
                  >
                    {row.title}
                  </button>
                  {row.contactPerson ? (
                    <span className="admin-schedule-contact">{row.contactPerson}</span>
                  ) : null}
                  {row.phone ? (
                    <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                      {row.phone}
                    </a>
                  ) : row.email ? (
                    <a className="admin-schedule-phone" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  ) : null}
                  {renderBadge(row)}
                  <div className="admin-note-actions">
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => manualTermin && openEditTermin(manualTermin)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      disabled={deletingTerminId === row.id}
                      onClick={() => deleteTermin(row.id, row.title)}
                    >
                      {deletingTerminId === row.id ? "Wird gelöscht…" : "Löschen"}
                    </button>
                  </div>
                </div>
              </li>
            );
          }

          if (row.kind === "business") {
            return (
              <li key={key} className="admin-schedule-slot is-business">
                <span className="admin-schedule-time">{normalizeTime(row.time)}</span>
                <div className="admin-schedule-slot-body">
                  <button
                    type="button"
                    className="admin-schedule-name"
                    onClick={() => onOpenCompany(row.id)}
                  >
                    {row.title}
                  </button>
                  {row.contactPerson ? (
                    <span className="admin-schedule-contact">{row.contactPerson}</span>
                  ) : null}
                  {row.phone ? (
                    <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                      {row.phone}
                    </a>
                  ) : row.email ? (
                    <a className="admin-schedule-phone" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  ) : null}
                  {renderBadge(row)}
                </div>
              </li>
            );
          }

          return (
            <li key={key} className="admin-schedule-slot is-applicant">
              <span className="admin-schedule-time">{normalizeTime(row.time)}</span>
              <div className="admin-schedule-slot-body">
                <button type="button" className="admin-schedule-name" onClick={() => onOpenLead(row.id)}>
                  {row.title}
                </button>
                <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                  {row.phone}
                </a>
                <span className="admin-schedule-type">{labelInterviewType(row.interviewType)}</span>
                {renderBadge(row)}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  function formatOverviewMeta(rows: ScheduleEntry[]): string {
    const parts = rows.map((row) => {
      const time = normalizeTime(row.time);
      const typeLabel = row.kind === "business" ? "Business" : "Bewerbung";
      return `${time} ${typeLabel} · ${row.title}`;
    });
    return parts.join(", ");
  }

  const selectedLabel =
    selectedDate === "all"
      ? "Alle Termine"
      : `${formatDateKeyDe(selectedDate)}${selectedDate === today ? " · Heute" : ""}`;

  return (
    <section className={`admin-schedule${expanded ? " is-expanded" : " is-collapsed"}`}>
      <div className="admin-schedule-head">
        <div>
          <h2 className="admin-schedule-title">Terminplan</h2>
          <p className="admin-schedule-sub">
            {scheduleMap.size === 0
              ? "Termine manuell anlegen oder aus Bewerbungen / Partner-Notizen"
              : selectedLabel}
            {scheduleMap.size > 0 && selectedDate !== "all" && selectedRows.length > 0
              ? ` · ${selectedRows.length} Termin${selectedRows.length === 1 ? "" : "e"}`
              : scheduleMap.size > 0
                ? ` · ${upcomingDates.length} Tag${upcomingDates.length === 1 ? "" : "e"} mit Terminen`
                : ""}
            {selectedDate !== "all" && countBusinessOnDate(selectedRows) > 0
              ? ` · ${countBusinessOnDate(selectedRows)} Business`
              : ""}
          </p>
        </div>
        <div className="admin-schedule-head-actions">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => (showTerminForm ? closeTerminForm() : openCreateTerminForm(selectedDate))}
          >
            {showTerminForm ? "Formular schließen" : "+ Termin"}
          </button>
          <button
            type="button"
            className="admin-btn-secondary admin-schedule-toggle"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "Kalender schließen" : "Kalender öffnen"}
          </button>
        </div>
      </div>

      {showTerminForm ? (
        <section className="admin-create-form admin-termin-form">
          <h2>{editingTerminId ? "Termin bearbeiten" : "Neuen Termin anlegen"}</h2>
          <div className="admin-form-grid">
            <label>
              <span>Titel / Name *</span>
              <input
                type="text"
                value={terminDraft.title}
                onChange={(e) => updateDraft("title", e.target.value)}
                placeholder="Firma oder Bewerber"
              />
            </label>
            <label>
              <span>Art *</span>
              <select
                value={terminDraft.kind}
                onChange={(e) => updateDraft("kind", e.target.value as TerminKind)}
              >
                <option value="business">Business</option>
                <option value="applicant">Bewerbung / Interview</option>
              </select>
            </label>
            <label>
              <span>Datum *</span>
              <input
                type="date"
                value={terminDraft.terminDate}
                onChange={(e) => updateDraft("terminDate", e.target.value)}
              />
            </label>
            <label>
              <span>Uhrzeit</span>
              <input
                type="time"
                value={terminDraft.terminTime}
                onChange={(e) => updateDraft("terminTime", e.target.value)}
              />
            </label>
            <label>
              <span>Ansprechpartner</span>
              <input
                type="text"
                value={terminDraft.contactPerson}
                onChange={(e) => updateDraft("contactPerson", e.target.value)}
              />
            </label>
            <label>
              <span>Telefon</span>
              <input
                type="tel"
                value={terminDraft.phone}
                onChange={(e) => updateDraft("phone", e.target.value)}
              />
            </label>
            <label className="admin-form-wide">
              <span>E-Mail</span>
              <input
                type="email"
                value={terminDraft.email}
                onChange={(e) => updateDraft("email", e.target.value)}
              />
            </label>
            <label className="admin-form-wide">
              <span>Notizen</span>
              <textarea
                className="admin-note-input"
                value={terminDraft.notes}
                onChange={(e) => updateDraft("notes", e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>
          {terminError ? <p className="admin-error">{terminError}</p> : null}
          <div className="admin-note-actions">
            <button
              type="button"
              className="admin-btn-secondary"
              disabled={savingTermin}
              onClick={saveTermin}
            >
              {savingTermin ? "Speichert…" : editingTerminId ? "Änderungen speichern" : "Termin speichern"}
            </button>
            {editingTerminId ? (
              <button
                type="button"
                className="admin-btn-danger"
                disabled={savingTermin || deletingTerminId === editingTerminId}
                onClick={() => deleteTermin(editingTerminId, terminDraft.title)}
              >
                Löschen
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {scheduleMap.size === 0 ? (
        <p className="admin-muted">
          Noch keine Termine. Klicke auf „+ Termin“, um Business oder Bewerbung manuell einzutragen.
        </p>
      ) : null}

      {scheduleMap.size > 0 && !expanded ? (
        <div className="admin-schedule-mini">
          <div className="admin-schedule-mini-filters">
            <button
              type="button"
              className={`admin-schedule-chip${selectedDate === "all" ? " is-selected" : ""}`}
              onClick={() => selectDate("all")}
            >
              Alle
            </button>
            {scheduleMap.has(today) ? (
              <button
                type="button"
                className={`admin-schedule-chip${selectedDate === today ? " is-selected" : ""}`}
                onClick={() => selectDate(today)}
              >
                Heute ({scheduleMap.get(today)?.length ?? 0})
              </button>
            ) : null}
            {upcomingDates.map(([date, rows]) => {
              if (date === today) return null;
              const businessCount = countBusinessOnDate(rows);
              return (
                <button
                  key={date}
                  type="button"
                  className={`admin-schedule-chip${selectedDate === date ? " is-selected" : ""}`}
                  onClick={() => selectDate(date)}
                >
                  {formatDateKeyDe(date)} ({rows.length}
                  {businessCount > 0 ? ` · ${businessCount} Business` : ""})
                </button>
              );
            })}
          </div>

          {selectedDate !== "all" ? (
            <div className="admin-schedule-mini-day">
              <h3 className="admin-schedule-day-title">{selectedLabel}</h3>
              {renderTimeline(selectedRows)}
            </div>
          ) : null}
        </div>
      ) : null}

      {scheduleMap.size > 0 && expanded ? (
        <div className="admin-schedule-layout">
          <div className="admin-calendar">
            <div className="admin-calendar-nav">
              <button type="button" className="admin-btn-secondary" onClick={() => shiftMonth(-1)}>
                ←
              </button>
              <span className="admin-calendar-month">{formatMonthYear(viewYear, viewMonth)}</span>
              <button type="button" className="admin-btn-secondary" onClick={() => shiftMonth(1)}>
                →
              </button>
            </div>

            <div className="admin-calendar-weekdays">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="admin-calendar-grid">
              {calendarCells.map((cell, index) => {
                if (!cell.key || cell.day === null) {
                  return <span key={`empty-${index}`} className="admin-calendar-day is-empty" />;
                }

                const isSelected = cell.key === selectedDate;
                const hasBookings = cell.count > 0;
                const isToday = cell.key === today;
                const hasBusiness = cell.businessCount > 0;

                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`admin-calendar-day${hasBookings ? " has-bookings" : ""}${hasBusiness ? " has-business" : ""}${isSelected ? " is-selected" : ""}${isToday ? " is-today" : ""}`}
                    onClick={() => selectDate(cell.key!)}
                    disabled={!hasBookings}
                    title={
                      hasBookings
                        ? `${cell.count} Termin${cell.count === 1 ? "" : "e"}${hasBusiness ? ` · ${cell.businessCount} Business` : ""}`
                        : "Keine Termine"
                    }
                  >
                    <span className="admin-calendar-day-num">{cell.day}</span>
                    {hasBookings ? (
                      <span className="admin-calendar-day-badge">{cell.count}</span>
                    ) : null}
                    {hasBusiness ? <span className="admin-calendar-day-business">B</span> : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="admin-btn-secondary admin-schedule-clear"
              onClick={() => selectDate("all")}
            >
              Alle Termine anzeigen
            </button>
          </div>

          <div className="admin-schedule-day">
            {selectedDate !== "all" ? (
              <>
                <h3 className="admin-schedule-day-title">
                  {formatDateKeyDe(selectedDate)}
                  {selectedDate === today ? (
                    <span className="admin-schedule-day-count">Heute</span>
                  ) : null}
                  <span className="admin-schedule-day-count">
                    {selectedRows.length} Termin{selectedRows.length === 1 ? "" : "e"}
                  </span>
                </h3>
                {renderTimeline(selectedRows)}
              </>
            ) : (
              <>
                <h3 className="admin-schedule-day-title">Alle Termine</h3>
                <ul className="admin-schedule-overview">
                  {upcomingDates.map(([date, rows]) => (
                    <li key={date}>
                      <button
                        type="button"
                        className="admin-schedule-overview-btn"
                        onClick={() => selectDate(date)}
                      >
                        <span className="admin-schedule-overview-date">
                          {formatDateKeyDe(date)}
                          {date === today ? " · Heute" : ""}
                          {countBusinessOnDate(rows) > 0 ? (
                            <span className="admin-schedule-overview-business">
                              {" "}
                              · {countBusinessOnDate(rows)} Business
                            </span>
                          ) : null}
                        </span>
                        <span className="admin-schedule-overview-meta">{formatOverviewMeta(rows)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
