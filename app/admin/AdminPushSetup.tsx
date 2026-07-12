"use client";

import { useEffect, useState } from "react";
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

export default function AdminPushSetup() {
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
      setMessage("Benachrichtigungen sind aktiv.");
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
      setMessage("Test-Benachrichtigung gesendet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test-Benachrichtigung konnte nicht gesendet werden.");
    } finally {
      setTesting(false);
    }
  }

  if (!config) return null;

  if (!config.enabled) {
    return (
      <section className="admin-push">
        <h2 className="admin-push-title">iPhone-Benachrichtigungen</h2>
        <p className="admin-muted">
          Push ist noch nicht eingerichtet. Trage <code>VAPID_PUBLIC_KEY</code>,{" "}
          <code>VAPID_PRIVATE_KEY</code> und <code>VAPID_SUBJECT</code> in den Server-Umgebungsvariablen
          ein.
        </p>
      </section>
    );
  }

  const canActivate = support?.canSubscribe ?? false;

  return (
    <section className="admin-push">
      <div className="admin-push-head">
        <h2 className="admin-push-title">iPhone-Benachrichtigungen</h2>
        <p className="admin-push-sub">Als App auf dem Home-Bildschirm — Push bei jedem neuen Lead</p>
      </div>

      <ol className="admin-push-steps">
        <li>
          Öffne <strong>staffontime.de/admin</strong> in <strong>Safari</strong> (nicht Chrome).
        </li>
        <li>
          Tippe auf <strong>Teilen</strong> → <strong>Zum Home-Bildschirm</strong> und füge die App
          hinzu.
        </li>
        <li>
          Öffne die App <strong>über das Icon auf dem Home-Bildschirm</strong> (nicht über Safari).
        </li>
        <li>
          Tippe unten auf <strong>Benachrichtigungen aktivieren</strong> und erlaube Mitteilungen.
        </li>
      </ol>

      {support && !canActivate && support.message ? (
        <p className="admin-push-warning">{support.message}</p>
      ) : null}

      {support?.ios && support.standalone && !subscribed ? (
        <p className="admin-push-meta">
          App-Modus erkannt{support.serviceWorker ? " · Service Worker bereit" : " · Service Worker fehlt"}
          {support.pushManager ? " · Push bereit" : " · Push nicht verfügbar"}
        </p>
      ) : null}

      <div className="admin-push-actions">
        <button
          type="button"
          className="admin-btn-primary admin-push-activate"
          disabled={activating || subscribed || !canActivate}
          onClick={onActivatePush}
        >
          {activating
            ? "Aktiviert..."
            : subscribed
              ? "Benachrichtigungen aktiv"
              : "Benachrichtigungen aktivieren"}
        </button>
        <button
          type="button"
          className="admin-btn-secondary"
          disabled={testing || !subscribed}
          onClick={onTestPush}
        >
          {testing ? "Sendet..." : "Test senden"}
        </button>
      </div>

      <p className="admin-push-meta">
        {subscribed
          ? "Dieses Gerät ist für Push angemeldet."
          : "Noch kein Push-Abonnement auf diesem Gerät."}
        {config.subscriptionCount > 0 ? ` · ${config.subscriptionCount} Gerät(e) gesamt` : ""}
      </p>

      {message ? <p className="admin-push-ok">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </section>
  );
}
