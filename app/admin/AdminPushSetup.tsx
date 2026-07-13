"use client";

import { useEffect, useRef, useState } from "react";
import {
  getCurrentPushSubscription,
  getPushSupportInfo,
  isStandalonePwa,
  registerAdminServiceWorker,
  subscribeToAdminPush,
  type PushSupportInfo,
} from "@/lib/push-client";

type PushConfig = {
  enabled: boolean;
  subscriptionCount: number;
  startUrl: string;
};

function BellIcon() {
  return (
    <svg className="admin-push-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 22a2.2 2.2 0 0 0 2.18-1.86H9.82A2.2 2.2 0 0 0 12 22Zm6.3-5.5V11a6.3 6.3 0 0 0-5.18-6.2V4a1 1 0 1 0-2 0v.8A6.3 6.3 0 0 0 6 11v5.5L4.5 18v1h15v-1L18.3 16.5Z"
      />
    </svg>
  );
}

export default function AdminPushSetup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<PushConfig | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [activating, setActivating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [support, setSupport] = useState<PushSupportInfo | null>(null);

  useEffect(() => {
    const info = getPushSupportInfo();
    setSupport(info);

    fetch("/api/admin-push-config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig(data as PushConfig);
      })
      .catch(() => setConfig({ enabled: false, subscriptionCount: 0, startUrl: "/admin" }));

    getCurrentPushSubscription()
      .then((sub) => setSubscribed(!!sub))
      .catch(() => setSubscribed(false));

    if (info.canSubscribe && isStandalonePwa()) {
      registerAdminServiceWorker().catch(() => {
        // Pre-registration is best-effort on iOS.
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function onActivatePush() {
    setActivating(true);
    setError("");
    setMessage("");
    try {
      const latestSupport = getPushSupportInfo();
      setSupport(latestSupport);
      if (!latestSupport.canSubscribe && latestSupport.message) {
        throw new Error(latestSupport.message);
      }

      await subscribeToAdminPush();
      setSubscribed(true);
      setMessage("Push ist aktiv.");
      const res = await fetch("/api/admin-push-config");
      if (res.ok) setConfig((await res.json()) as PushConfig);
    } catch (err) {
      const text = err instanceof Error ? err.message : "Aktivierung fehlgeschlagen.";
      setError(text);
    } finally {
      setActivating(false);
    }
  }

  async function onTestPush() {
    setTesting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin-test-push", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Test failed");
      setMessage("Test gesendet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test konnte nicht gesendet werden.");
    } finally {
      setTesting(false);
    }
  }

  if (!config) return null;

  const canActivate = support?.canSubscribe ?? false;

  return (
    <div className="admin-push-header" ref={rootRef}>
      <button
        type="button"
        className={`admin-push-trigger${subscribed ? " is-active" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Push-Benachrichtigungen"
        title={subscribed ? "Push aktiv" : "Push aktivieren"}
      >
        <BellIcon />
        <span className="admin-push-trigger-label">Push</span>
        {subscribed ? <span className="admin-push-dot" aria-hidden="true" /> : null}
      </button>

      {open ? (
        <div className="admin-push-popover" role="dialog" aria-label="Push">
          <p className="admin-push-popover-title">Push</p>
          <p className="admin-push-popover-status">
            {subscribed ? "Aktiv auf diesem Gerät" : "Noch nicht aktiv"}
            {config.subscriptionCount > 0 ? ` · ${config.subscriptionCount} Gerät(e)` : ""}
          </p>

          {!config.enabled ? (
            <p className="admin-push-popover-hint">
              Push ist auf dem Server noch nicht eingerichtet (VAPID-Schlüssel fehlen).
            </p>
          ) : null}

          {config.enabled && support && !canActivate && support.message ? (
            <p className="admin-push-popover-hint">{support.message}</p>
          ) : null}

          {config.enabled ? (
            <div className="admin-push-popover-actions">
              <button
                type="button"
                className="admin-btn-primary"
                disabled={activating || subscribed || !canActivate}
                onClick={onActivatePush}
              >
                {activating ? "Aktiviert..." : subscribed ? "Aktiv" : "Aktivieren"}
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                disabled={testing || !subscribed}
                onClick={onTestPush}
              >
                {testing ? "Sendet..." : "Test"}
              </button>
            </div>
          ) : null}

          {message ? <p className="admin-push-ok">{message}</p> : null}
          {error ? <p className="admin-error">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
