"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signlink } from "@/content/projects";
import { exampleAtStage, signExamples } from "@/content/signlink-examples";
import { useTabKeys } from "../useTabKeys";
import ClipPlayer from "./ClipPlayer";

// The hosting stage isn't part of a single translation, so the exhibit shows five.
const STAGES = signlink.stages.filter((s) => s.id !== "serve");
const EXAMPLE = signExamples[0];
const CLIPS = EXAMPLE.resolutions.flatMap((r) => r.clips);

/** Compact, instrument-like view of SignLink for the homepage hero. */
export default function HeroExhibit() {
  const uid = useId();
  const [index, setIndex] = useState(2);
  const stage = STAGES[index];
  const { setRef, onKeyDown } = useTabKeys(STAGES.length, index, setIndex);

  return (
    <figure className="rounded-panel border border-rule bg-surface shadow-panel shadow-[0_1px_0_var(--rule)]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3 sm:px-5">
        <span className="text-sm font-medium text-ink">SignLink</span>
        <span className="label rounded-full border border-rule px-2 py-0.5">Prepared example · not live</span>
      </figcaption>

      <div className="space-y-5 px-4 py-5 sm:px-5">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-3">
          <span className="label">Input</span>
          <p className="text-lg font-medium tracking-tight text-ink">“{EXAMPLE.sentence}”</p>
        </div>

        <div>
          <div
            role="tablist"
            aria-label="SignLink stages for this example"
            onKeyDown={onKeyDown}
            className="grid grid-cols-5 gap-1 rounded-panel bg-surface-2 p-1"
          >
            {STAGES.map((s, i) => {
              const selected = i === index;
              return (
                <button
                  key={s.id}
                  ref={setRef(i)}
                  role="tab"
                  type="button"
                  id={`${uid}-t-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={`flex min-h-12 flex-col items-center justify-center rounded-control px-1 text-center transition-colors ${
                    selected ? "bg-surface text-ink shadow-[0_0_0_1px_var(--rule-strong)]" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <span className={`font-mono text-[10px] ${selected ? "text-accent" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[12px] font-medium sm:text-[13px]">{s.short}</span>
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-t-${stage.id}`}
            className="mt-3 min-h-[5.5rem] border-l-2 border-accent pl-3"
          >
            <p className="text-[15px] font-medium text-ink">{exampleAtStage(EXAMPLE, stage.id)}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{stage.brief}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-3">
          <span className="label sm:pt-1">Output</span>
          <ClipPlayer clips={CLIPS} sentence={EXAMPLE.sentence} compact />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-rule px-4 py-3 text-xs leading-relaxed text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>
          Traced with SignLink&apos;s own fallback code. The output plays the original StudioGalt clips (CC0); nothing here calls a model.
        </p>
        <Link
          href="/work/signlink"
          className="inline-flex min-h-10 shrink-0 items-center gap-1 font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
        >
          Full walkthrough <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </figure>
  );
}
