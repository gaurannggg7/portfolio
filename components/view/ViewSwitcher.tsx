"use client";

import { useEffect, useId, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { VIEWS, VIEW_COOKIE, VIEW_LABELS, VIEW_PARAM, type View } from "@/lib/view";

const SHORT: Record<View, string> = { lab: "Lab", campus: "Campus", notes: "Notes" };
const ANCHOR_KEY = "view-switch-anchor";

/** Saves the preference for pages visited without a ?view= parameter. */
function saveView(view: View) {
  document.cookie = `${VIEW_COOKIE}=${view}; path=/; max-age=31536000; samesite=lax`;
}

/** The section the reader is looking at, so it can be restored after the layout changes. */
function currentAnchor() {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>("main section[id], main article[id], footer[id]"));
  // The innermost section crossing the reading line just below the header.
  let best: { id: string; top: number; height: number } | null = null;
  for (const el of candidates) {
    const r = el.getBoundingClientRect();
    if (r.top <= 120 && r.bottom > 120 && (!best || r.height < best.height)) best = { id: el.id, top: r.top, height: r.height };
  }
  return best && { id: best.id, top: best.top };
}

export default function ViewSwitcher({ view, compact = false }: { view: View; compact?: boolean }) {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  // After a switch re-renders the page, put the same section back where it was.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(ANCHOR_KEY);
      sessionStorage.removeItem(ANCHOR_KEY);
    } catch {}
    if (!saved) return;
    const { id, top } = JSON.parse(saved) as { id: string; top: number };
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - top, behavior: "instant" });
  }, [view]);

  const choose = (next: View) => {
    if (next === view) return;
    saveView(next);
    const anchor = currentAnchor();
    try {
      if (anchor) sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
    } catch {}
    // Read the query at click time instead of via useSearchParams, which would
    // make the header suspend during server rendering and stream in late.
    const params = new URLSearchParams(window.location.search);
    params.set(VIEW_PARAM, next);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}${window.location.hash}`, { scroll: false });
    });
  };

  return (
    <fieldset className={compact ? "" : "w-full"} aria-busy={pending}>
      <legend className={compact ? "sr-only" : "label mb-2"}>View style</legend>
      <div className={`flex rounded-control border border-rule bg-surface p-0.5 ${compact ? "" : "w-full"}`}>
        {VIEWS.map((v) => {
          const selected = v === view;
          return (
            <label
              key={v}
              htmlFor={`${uid}-${v}`}
              className={`relative flex min-h-9 flex-1 cursor-pointer items-center justify-center rounded-control px-2 text-center text-[13px] leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[var(--focus)] ${
                selected ? "bg-ink font-medium text-bg" : "text-ink-2 hover:text-ink"
              } ${compact ? "whitespace-nowrap" : "min-h-11"}`}
            >
              <input
                id={`${uid}-${v}`}
                type="radio"
                name={`${uid}-view`}
                value={v}
                checked={selected}
                onChange={() => choose(v)}
                className="sr-only"
              />
              {compact ? (
                <>
                  <span aria-hidden>{SHORT[v]}</span>
                  <span className="sr-only">{VIEW_LABELS[v]}</span>
                </>
              ) : (
                VIEW_LABELS[v]
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
