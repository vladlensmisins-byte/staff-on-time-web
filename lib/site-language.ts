export type SiteLang = "de" | "en";

let currentSiteLang: SiteLang = "de";
const listeners = new Set<(lang: SiteLang) => void>();

export function getSiteLang(): SiteLang {
  return currentSiteLang;
}

export function setSiteLang(lang: SiteLang): void {
  if (currentSiteLang === lang) return;
  currentSiteLang = lang;
  listeners.forEach((fn) => fn(lang));
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export function subscribeSiteLang(fn: (lang: SiteLang) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
