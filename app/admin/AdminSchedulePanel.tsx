"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildScheduleEntries,
  groupScheduleByDate,
  scheduleEntryKey,
  type ScheduleEntry,
} from "@/lib/admin-schedule";
import { labelInterviewType } from "@/lib/admin-i18n";
import { getTodayDateKey } from "@/lib/admin-lead-sort";
import { defaultTerminTitle, normalizeTerminDate } from "@/lib/termin-date";
import type { CompanyRow } from "@/lib/supabase-companies";
import type { SubmissionRow } from "@/lib/supabase-admin";
import {
  submitAdminTermin,
  type TerminKind,
  type TerminRow,
} from "@/lib/supabase-termins";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

type TerminDraft = {
  title: string;
  terminDate: string;
  terminTime: string;
  kind: TerminKind;
};

const EMPTY_TERMIN: TerminDraft = {
  title: "",
  terminDate: "",
  terminTime: "",
  kind: "business",
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
  focusDate?: string | null;
  onFocusDateHandled?: () => void;
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
  focusDate,
  onFocusDateHandled,
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

  useEffect(() => {
    if (!focusDate) return;
    setExpanded(true);
    onSelectDate(focusDate);
    const [y, m] = focusDate.split("-").map(Number);
    if (y && m) {
      setViewYear(y);
      setViewMonth(m - 1);
    }
    onFocusDateHandled?.();
  }, [focusDate, onFocusDateHandled, onSelectDate]);

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
      terminDate:
        prefillDate && prefillDate !== "all"
          ? prefillDate
          : selectedDate !== "all"
            ? selectedDate
            : today,
    });
    setTerminError("");
    setShowTerminForm(true);
    if (!expanded) setExpanded(true);
  }

  function openEditTermin(termin: TerminRow) {
    setEditingTerminId(termin.id);
    setTerminDraft(terminToDraft(termin));
    setTerminError("");
    setShowTerminForm(true);
    setExpanded(true);
    selectDate(termin.terminDate);
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
    const terminDate = normalizeTerminDate(terminDraft.terminDate);
    if (!terminDate) {
      setTerminError("Bitte ein gültiges Datum angeben.");
      return;
    }

    setSavingTermin(true);
    setTerminError("");
    try {
      const saved = await submitAdminTermin(
        {
          title: defaultTerminTitle(terminDraft.kind, terminDraft.title),
          terminDate,
          terminTime: terminDraft.terminTime.trim() || undefined,
          kind: terminDraft.kind,
        },
        editingTerminId,
      );

      if (editingTerminId) {
        onTerminsChange(termins.map((row) => (row.id === saved.id ? saved : row)));
      } else {
        onTerminsChange([...termins, saved].sort((a, b) => a.terminDate.localeCompare(b.terminDate)));
      }

      selectDate(saved.terminDate);
      closeTerminForm();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Termin konnte nicht gespeichert werden.";
      setTerminError(message);
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

  function openEntry(entry: ScheduleEntry) {
    if (entry.source === "manual") {
      const manualTermin = termins.find((termin) => termin.id === entry.id);
      if (manualTermin?.companyId) {
        onOpenCompany(manualTermin.companyId);
        return;
      }
      if (manualTermin) openEditTermin(manualTermin);
      return;
    }
    if (entry.kind === "business") {
      onOpenCompany(entry.id);
      return;
    }
    onOpenLead(entry.id);
  }

  function renderTimeline(rows: ScheduleEntry[]) {
    if (rows.length === 0) {
      return <p className="admin-muted">Keine Termine an diesem Tag.</p>;
    }

    return (
      <ul className="admin-schedule-timeline">
        {rows.map((row) => {
          const key = scheduleEntryKey(row);
          const manualTermin = row.source === "manual" ? termins.find((t) => t.id === row.id) : null;

          return (
            <li
              key={key}
              className={`admin-schedule-slot${row.kind === "business" ? " is-business" : " is-applicant"}${row.source === "manual" ? " is-manual" : ""}`}
            >
              <span className="admin-schedule-time">{normalizeTime(row.time)}</span>
              <div className="admin-schedule-slot-body">
                <button type="button" className="admin-schedule-name" onClick={() => openEntry(row)}>
                  {row.title}
                </button>
                {"contactPerson" in row && row.contactPerson ? (
                  <span className="admin-schedule-contact">{row.contactPerson}</span>
                ) : null}
                {row.source === "submission" ? (
                  <>
                    <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                      {row.phone}
                    </a>
                    <span className="admin-schedule-type">{labelInterviewType(row.interviewType)}</span>
                  </>
                ) : null}
                {row.source !== "submission" && row.phone ? (
                  <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                    {row.phone}
                  </a>
                ) : null}
                {row.source !== "submission" && !row.phone && "email" in row && row.email ? (
                  <a className="admin-schedule-phone" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                ) : null}
                {renderBadge(row)}
                {manualTermin ? (
                  <div className="admin-note-actions">
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => openEditTermin(manualTermin)}
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
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  const selectedLabel =
    selectedDate === "all"
      ? "Kein Tag gewählt"
      : `${formatDateKeyDe(selectedDate)}${selectedDate === today ? " · Heute" : ""}`;

  return (
    <section className={`admin-schedule${expanded ? " is-expanded" : " is-collapsed"}`}>
      <div className="admin-schedule-head">
        <div>
          <h2 className="admin-schedule-title">Terminplan</h2>
          <p className="admin-schedule-sub">
            {expanded
              ? selectedDate !== "all"
                ? `${selectedLabel} · ${selectedRows.length} Termin${selectedRows.length === 1 ? "" : "e"}`
                : "Kalender geöffnet — Tag auswählen, um Termine zu sehen"
              : "Kalender öffnen, Tag wählen — Termine erscheinen unten"}
          </p>
        </div>
        <div className="admin-schedule-head-actions">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => (showTerminForm ? closeTerminForm() : openCreateTerminForm())}
          >
            {showTerminForm ? "Abbrechen" : "+ Termin"}
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
        <section className="admin-create-form admin-termin-form admin-termin-form-compact">
          <h2>{editingTerminId ? "Termin bearbeiten" : "Schnell-Termin"}</h2>
          <div className="admin-form-grid">
            <label>
              <span>Art</span>
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
            <label className="admin-form-wide">
              <span>Name (optional)</span>
              <input
                type="text"
                value={terminDraft.title}
                onChange={(e) => updateDraft("title", e.target.value)}
                placeholder="Leer = automatischer Titel"
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
              {savingTermin ? "Speichert…" : editingTerminId ? "Speichern" : "Termin speichern"}
            </button>
          </div>
        </section>
      ) : null}

      {expanded ? (
        <>
          <div className="admin-calendar admin-calendar-standalone">
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
                    title={
                      hasBookings
                        ? `${cell.count} Termin${cell.count === 1 ? "" : "e"}`
                        : "Tag auswählen"
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
          </div>

          {selectedDate !== "all" ? (
            <div className="admin-schedule-day-panel">
              <h3 className="admin-schedule-day-title">
                {formatDateKeyDe(selectedDate)}
                {selectedDate === today ? <span className="admin-schedule-day-count">Heute</span> : null}
                <span className="admin-schedule-day-count">
                  {selectedRows.length} Termin{selectedRows.length === 1 ? "" : "e"}
                </span>
              </h3>
              {renderTimeline(selectedRows)}
            </div>
          ) : (
            <p className="admin-muted admin-schedule-pick-day">
              Wähle einen Tag im Kalender — die Termine des Tages erscheinen hier.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}
