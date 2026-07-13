export const ADMIN_SW_URL = "/sw-admin.js";
export const ADMIN_SW_SCOPE = "/admin/";

export type PushSupportInfo = {
  serviceWorker: boolean;
  pushManager: boolean;
  notification: boolean;
  standalone: boolean;
  ios: boolean;
  iosNonSafari: boolean;
  secureContext: boolean;
  canSubscribe: boolean;
  message: string | null;
};

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function isIosNonSafariBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && /crios|fxios|edgios|opios|duckduckgo/i.test(ua);
}

export function getPushSupportInfo(): PushSupportInfo {
  const serviceWorker = typeof navigator !== "undefined" && "serviceWorker" in navigator;
  const pushManager = typeof window !== "undefined" && "PushManager" in window;
  const notification = typeof window !== "undefined" && "Notification" in window;
  const standalone = isStandalonePwa();
  const ios = isIosDevice();
  const iosNonSafari = isIosNonSafariBrowser();
  const secureContext = typeof window !== "undefined" ? window.isSecureContext : false;

  let message: string | null = null;
  let canSubscribe = serviceWorker && pushManager && notification && secureContext;

  if (ios && iosNonSafari) {
    canSubscribe = false;
    message =
      "Bitte Safari verwenden: Zum Home-Bildschirm nur über Safari hinzufügen, nicht Chrome oder Firefox.";
  } else if (ios && !standalone) {
    canSubscribe = false;
    message =
      "Öffne die App über das Icon auf dem Home-Bildschirm (nicht über Safari).";
  } else if (!secureContext) {
    canSubscribe = false;
    message = "Push funktioniert nur über HTTPS.";
  } else if (!serviceWorker) {
    canSubscribe = false;
    message = ios
      ? "Service Worker fehlt. Oft hilft: Home-Bildschirm-Icon löschen → Safari öffnen → staffontime.de/admin → Teilen → Zum Home-Bildschirm → App nur über neues Icon öffnen (iOS 16.4+)."
      : "Service Worker wird nicht unterstützt.";
  } else if (!pushManager) {
    canSubscribe = false;
    message = ios
      ? "Push wird auf diesem iPhone nicht unterstützt. iOS 16.4 oder neuer erforderlich."
      : "Push-Benachrichtigungen werden in diesem Browser nicht unterstützt.";
  } else if (!notification) {
    canSubscribe = false;
    message = "Benachrichtigungen werden in diesem Browser nicht unterstützt.";
  }

  return {
    serviceWorker,
    pushManager,
    notification,
    standalone,
    ios,
    iosNonSafari,
    secureContext,
    canSubscribe,
    message,
  };
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export async function registerAdminServiceWorker(): Promise<ServiceWorkerRegistration> {
  const support = getPushSupportInfo();
  if (!support.canSubscribe && support.message) {
    throw new Error(support.message);
  }

  const registration = await navigator.serviceWorker.register(ADMIN_SW_URL, {
    scope: ADMIN_SW_SCOPE,
    updateViaCache: "none",
  });
  await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribeToAdminPush(): Promise<PushSubscription> {
  const registration = await registerAdminServiceWorker();

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Benachrichtigungen wurden nicht erlaubt.");
  }

  const vapidRes = await fetch("/api/admin-push-vapid");
  if (!vapidRes.ok) {
    throw new Error("Push-Konfiguration konnte nicht geladen werden.");
  }

  const { publicKey } = (await vapidRes.json()) as { publicKey?: string };
  if (!publicKey) {
    throw new Error("VAPID-Schlüssel fehlt auf dem Server.");
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });
  }

  const saveRes = await fetch("/api/admin-push-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  if (!saveRes.ok) {
    throw new Error("Push-Abonnement konnte nicht gespeichert werden.");
  }

  return subscription;
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  const registration = await navigator.serviceWorker.getRegistration(ADMIN_SW_SCOPE);
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}
