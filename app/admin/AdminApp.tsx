"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import AdminCompaniesPanel from "./AdminCompaniesPanel";
import AdminPushSetup from "./AdminPushSetup";

type AdminTab = "bewerbungen" | "partner";

export default function AdminApp() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("bewerbungen");

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

      {tab === "bewerbungen" ? <AdminDashboard /> : <AdminCompaniesPanel />}
    </div>
  );
}
