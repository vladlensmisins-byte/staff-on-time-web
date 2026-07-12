"use client";

import { useMemo, useState } from "react";
import { labelInterviewType } from "@/lib/admin-i18n";
import { getTodayDateKey } from "@/lib/admin-lead-sort";
import type { SubmissionRow } from "@/lib/supabase-admin";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

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

function groupByInterviewDate(submissions: SubmissionRow[]): Map<string, SubmissionRow[]> {
  const map = new Map<string, SubmissionRow[]>();
  for (const row of submissions) {
    if (!row.interviewDate) continue;
    const existing = map.get(row.interviewDate) ?? [];
    existing.push(row);
    map.set(row.interviewDate, existing);
  }
  for (const rows of map.values()) {
    rows.sort((a, b) => normalizeTime(a.interviewTime).localeCompare(normalizeTime(b.interviewTime)));
  }
  return map;
}

type Props = {
  submissions: SubmissionRow[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenLead: (id: string) => void;
};

export default function AdminSchedulePanel({
  submissions,
  selectedDate,
  onSelectDate,
  onOpenLead,
}: Props) {
  const today = getTodayDateKey();
  const scheduleMap = useMemo(() => groupByInterviewDate(submissions), [submissions]);

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

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ key: string | null; day: number | null; count: number }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: null, day: null, count: 0 });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const key = toDateKey(viewYear, viewMonth, day);
      cells.push({ key, day, count: scheduleMap.get(key)?.length ?? 0 });
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

  function renderTimeline(rows: SubmissionRow[]) {
    if (rows.length === 0) {
      return <p className="admin-muted">Keine Termine an diesem Tag.</p>;
    }

    return (
      <ul className="admin-schedule-timeline">
        {rows.map((row) => {
          const fullName = `${row.firstName} ${row.lastName}`.trim();
          return (
            <li key={row.id} className="admin-schedule-slot">
              <span className="admin-schedule-time">{normalizeTime(row.interviewTime)}</span>
              <div className="admin-schedule-slot-body">
                <button type="button" className="admin-schedule-name" onClick={() => onOpenLead(row.id)}>
                  {fullName}
                </button>
                <a className="admin-schedule-phone" href={`tel:${row.phone}`}>
                  {row.phone}
                </a>
                <span className="admin-schedule-type">{labelInterviewType(row.interviewType)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (scheduleMap.size === 0) {
    return (
      <section className="admin-schedule">
        <h2 className="admin-schedule-title">Interview-Terminplan</h2>
        <p className="admin-muted">Noch keine gebuchten Interview-Termine.</p>
      </section>
    );
  }

  const selectedLabel =
    selectedDate === "all"
      ? "Alle Interview-Tage"
      : `${formatDateKeyDe(selectedDate)}${selectedDate === today ? " · Heute" : ""}`;

  return (
    <section className={`admin-schedule${expanded ? " is-expanded" : " is-collapsed"}`}>
      <div className="admin-schedule-head">
        <div>
          <h2 className="admin-schedule-title">Interview-Terminplan</h2>
          <p className="admin-schedule-sub">
            {selectedLabel}
            {selectedDate !== "all" && selectedRows.length > 0
              ? ` · ${selectedRows.length} Termin${selectedRows.length === 1 ? "" : "e"}`
              : ` · ${upcomingDates.length} Tag${upcomingDates.length === 1 ? "" : "e"} mit Terminen`}
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary admin-schedule-toggle"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Kalender schließen" : "Kalender öffnen"}
        </button>
      </div>

      {!expanded ? (
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
              return (
                <button
                  key={date}
                  type="button"
                  className={`admin-schedule-chip${selectedDate === date ? " is-selected" : ""}`}
                  onClick={() => selectDate(date)}
                >
                  {formatDateKeyDe(date)} ({rows.length})
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
      ) : (
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

                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`admin-calendar-day${hasBookings ? " has-bookings" : ""}${isSelected ? " is-selected" : ""}${isToday ? " is-today" : ""}`}
                    onClick={() => selectDate(cell.key!)}
                    disabled={!hasBookings}
                    title={
                      hasBookings
                        ? `${cell.count} Termin${cell.count === 1 ? "" : "e"}`
                        : "Keine Termine"
                    }
                  >
                    <span className="admin-calendar-day-num">{cell.day}</span>
                    {hasBookings ? (
                      <span className="admin-calendar-day-badge">{cell.count}</span>
                    ) : null}
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
                <h3 className="admin-schedule-day-title">Alle Interview-Tage</h3>
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
                        </span>
                        <span className="admin-schedule-overview-meta">
                          {rows.length} Termin{rows.length === 1 ? "" : "e"} ·{" "}
                          {rows.map((r) => normalizeTime(r.interviewTime)).join(", ")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
