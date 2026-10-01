"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { exhibits } from "@/content/exhibits";
import { featured } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";

/** Concise introduction for the focused exhibit, with its parts and actions. */
export default function ExhibitPanel({
  slug,
  part,
  onPart,
  onReplay,
  onClose,
  headingId,
}: {
  slug: ProjectSlug;
  part: string | null;
  onPart: (p: string) => void;
  onReplay: () => void;
  onClose?: () => void;
  headingId: string;
}) {
  const p = featured[slug];
  const ex = exhibits[slug];
  const activePart = ex.parts.find((x) => x.id === part);

  return (
    <div className="rounded-panel border border-rule bg-surface p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{ex.object}</p>
          <h2 id={headingId} className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            {p.name}
          </h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to the whole bench"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-rule text-ink-2 hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.outcome}</p>
      <p className="mt-1 text-sm text-ink-3">{p.role}</p>

      <div className="mt-4">
        <p className="label mb-1.5">Inspect a part</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${p.name} parts`}>
          {ex.parts.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={part === x.id}
              onClick={() => onPart(x.id)}
              className={`min-h-9 rounded-control border px-2.5 text-[13px] transition-colors ${
                part === x.id ? "border-accent bg-accent text-on-accent" : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p className="mt-2 min-h-[3.75rem] text-sm leading-relaxed text-ink" aria-live="polite">
          {activePart ? activePart.role : ex.motion}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href={`/work/${slug}#demo`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-control bg-ink px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Open the demo <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        <Link
          href={`/work/${slug}`}
          className="inline-flex min-h-11 items-center rounded-control border border-rule-strong px-3.5 text-sm font-medium text-ink hover:border-ink"
        >
          Case study
        </Link>
        <button type="button" onClick={onReplay} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
          <RotateCcw aria-hidden className="h-3.5 w-3.5" />
          {ex.motionAction}
        </button>
      </div>
      <p className="mt-3 border-t border-rule pt-3 text-xs leading-relaxed text-ink-3">{ex.disclosure}</p>
    </div>
  );
}
