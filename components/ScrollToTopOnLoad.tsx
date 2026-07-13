"use client";

import { useEffect } from "react";

/**
 * Prevents the browser from restoring the previous scroll position on refresh
 * (especially common on mobile). Deep links with a hash still work on first open.
 */
export default function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = nav?.type === "reload";

    function goTop() {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    if (isReload || !window.location.hash) {
      if (isReload && window.location.hash) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      goTop();
      requestAnimationFrame(goTop);
      const t1 = window.setTimeout(goTop, 0);
      const t2 = window.setTimeout(goTop, 50);

      function onPageShow(event: PageTransitionEvent) {
        if (event.persisted || isReload) goTop();
      }
      window.addEventListener("pageshow", onPageShow);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener("pageshow", onPageShow);
      };
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) goTop();
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
