"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import AdminCompaniesPanel from "./AdminCompaniesPanel";
import AdminPushSetup from "./AdminPushSetup";
import AdminSchedulePanel from "./AdminSchedulePanel";
import type { SubmissionRow } from "@/lib/supabase-admin";
import type { CompanyRow } from "@/lib/supabase-companies";
import type { TerminRow } from "@/lib/supabase-termins";

type AdminTab = "bewerbungen" | "partner";

export default function AdminApp() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("bewerbungen");
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [termins, setTermins] = useState<TerminRow[]>([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [openCompanyId, setOpenCompanyId] = useState<string | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  const loadScheduleData = useCallback(async () => {
    try {
      const [submissionsRes, companiesRes, terminsRes] = await Promise.all([
        fetch("/api/admin-submissions"),
        fetch("/api/admin-companies"),
        fetch("/api/admin-termins"),
      ]);

      if (submissionsRes.status === 401 || companiesRes.status === 401 || terminsRes.status === 401) {
        router.refresh();
        return;
      }

      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        setSubmissions(data.submissions ?? []);
      }

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(data.companies ?? []);
      }

      if (terminsRes.ok) {
        const data = await terminsRes.json();
        setTermins(data.termins ?? []);
      }
    } catch {
      // Child panels show their own errors on refresh.
    }
  }, [router]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  async function onLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.refresh();
  }

  function handleOpenCompany(id: string) {
    setTab("partner");
    setOpenCompanyId(id);
  }

  function handleOpenLead(id: string) {
    setTab("bewerbungen");
    setOpenLeadId(id);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-brand">
            staffontime<span className="dot">.</span>
          </div>
          <nav className="admin-tabs" aria-label="Admin-Bereiche">
            <button
              type="button"
              className={`admin-tab${tab === "bewerbungen" ? " is-active" : ""}`}
              onClick={() => setTab("bewerbungen")}
            >
              Bewerbungen
            </button>
            <button
              type="button"
              className={`admin-tab${tab === "partner" ? " is-active" : ""}`}
              onClick={() => setTab("partner")}
            >
              Partner & Unternehmen
            </button>
          </nav>
        </div>
        <div className="admin-header-actions">
          <AdminPushSetup />
          <button type="button" className="admin-btn-secondary" onClick={onLogout}>
            Abmelden
          </button>
        </div>
      </header>

      <main className="admin-main">
        <AdminSchedulePanel
          submissions={submissions}
          companies={companies}
          termins={termins}
          selectedDate={dateFilter}
          onSelectDate={setDateFilter}
          onOpenLead={handleOpenLead}
          onOpenCompany={handleOpenCompany}
          onTerminsChange={setTermins}
        />

        {tab === "bewerbungen" ? (
          <AdminDashboard
            submissions={submissions}
            onSubmissionsChange={setSubmissions}
            companies={companies}
            termins={termins}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onReloadSchedule={loadScheduleData}
            initialOpenLeadId={openLeadId}
            onInitialOpenLeadHandled={() => setOpenLeadId(null)}
          />
        ) : (
          <AdminCompaniesPanel
            companies={companies}
            onCompaniesChange={setCompanies}
            onReloadSchedule={loadScheduleData}
            initialOpenId={openCompanyId}
            onInitialOpenHandled={() => setOpenCompanyId(null)}
          />
        )}
      </main>
    </div>
  );
}
