"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Incorrect password");
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-login-card">
        <div className="admin-brand">
          staffontime<span className="dot">.</span>
        </div>
        <h1>Admin</h1>
        <p className="admin-login-sub">Enter the admin password to view submissions.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
