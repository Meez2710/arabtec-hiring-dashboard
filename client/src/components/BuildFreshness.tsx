import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

/* Injected at build time by vite.config.ts `define`. */
declare const __BUILD_TIME__: string;
declare const __BUILD_VERSION__: string;

export const BUILD_TIME = typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : "";
export const BUILD_VERSION = typeof __BUILD_VERSION__ !== "undefined" ? __BUILD_VERSION__ : "dev";

/** "Build 2026-08-06 · v1.3 · Data as of 31 July 2026" */
export const APP_VERSION = "1.3";
export const DATA_AS_OF = "31 July 2026";
export function buildStamp() {
  const day = BUILD_TIME ? BUILD_TIME.slice(0, 10) : "dev";
  return `Build ${day} · v${APP_VERSION} · Data as of ${DATA_AS_OF}`;
}

/**
 * Detects that a newer build has been deployed while this tab stayed open.
 *
 * Compares the hashed entry bundle referenced by the *currently running* page
 * against the one in a freshly fetched copy of index.html. Vite emits
 * content-hashed filenames, so any redeploy changes the hash. This needs no
 * build-time coordination with the host, so it works on Manus or anywhere else.
 */
function useStaleBuild(intervalMs = 5 * 60 * 1000) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const entryOf = (html: string) => html.match(/\/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0] ?? null;
    const current =
      Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]"))
        .map((s) => s.getAttribute("src") ?? "")
        .find((s) => /\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(s)) ?? null;

    // Dev server serves unhashed modules — nothing to compare against.
    if (!current) return;

    let cancelled = false;
    const check = async () => {
      if (cancelled || document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}?_=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const deployed = entryOf(await res.text());
        if (!cancelled && deployed && deployed !== current) setStale(true);
      } catch {
        /* offline or blocked — stay silent rather than nag */
      }
    };

    check();
    const id = window.setInterval(check, intervalMs);
    const onVisible = () => check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs]);

  return stale;
}

/**
 * Banner shown when the open tab is running an outdated build. Without this a
 * stale tab silently shows old figures — the failure mode that hid four
 * departments from one machine while a colleague saw all fifteen.
 */
export function StaleBuildBanner() {
  const stale = useStaleBuild();
  const [dismissed, setDismissed] = useState(false);
  if (!stale || dismissed) return null;

  return (
    <div
      role="status"
      className="print:hidden sticky top-0 z-50 border-b border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/70 dark:text-amber-50"
    >
      <div className="max-w-[1280px] mx-auto flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5">
        <RefreshCw size={15} className="shrink-0" />
        <p className="text-[13px] leading-snug flex-1">
          A newer version of this dashboard is available — reload to see the latest numbers.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="shrink-0 rounded-md bg-amber-900 px-3 py-1.5 text-[12px] font-semibold text-amber-50 hover:bg-amber-800 dark:bg-amber-100 dark:text-amber-950 dark:hover:bg-white"
        >
          Reload
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md p-1 hover:bg-amber-200/70 dark:hover:bg-amber-800/60"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
