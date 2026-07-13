"use client";

import { useEffect } from "react";

function goTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function isReloadNavigation(): boolean {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "reload") return true;
  // Legacy Safari fallback
  const legacy = (performance as Performance & { navigation?: { type?: number } }).navigation;
  return legacy?.type === 1;
}

/**
 * Force scroll to top on refresh (especially iOS Safari), and disable automatic
 * scroll restoration. Hash deep-links still work on first open / navigation.
 */
export default function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const reload = isReloadNavigation();
    const hasHash = Boolean(window.location.hash);

    if (reload && hasHash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    const shouldReset = reload || !hasHash;
    if (!shouldReset) return;

    goTop();

    const timers = [0, 16, 50, 100, 200, 400, 700, 1000].map((ms) =>
      window.setTimeout(goTop, ms),
    );

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted || reload) goTop();
    }

    function onLoad() {
      goTop();
    }

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("load", onLoad);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
