"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play, Square } from "lucide-react";
import type { Stage } from "@/content/types";
import { useTabKeys } from "./useTabKeys";

type Props = {
  stages: Stage[];
  /** Accessible name for the list of stages, e.g. "SignLink pipeline stages". */
  label: string;
  /** Controlled selection (optional). */
  selected?: string;
  onSelect?: (id: string) => void;
  /** Extra inspector row describing a prepared example at this stage. */
  exampleRow?: { title: string; value: (stageId: string) => string | undefined };
  /** Keep the inspector under the stage list at every width (for narrow columns). */
  stacked?: boolean;
};

const STEP_MS = 1900;

export default function PipelineExplorer({ stages, label, selected, onSelect, exampleRow, stacked }: Props) {
  const uid = useId();
  const reduceMotion = useReducedMotion();
  const [internal, setInternal] = useState(stages[0].id);
  const current = selected ?? internal;
  const index = Math.max(0, stages.findIndex((s) => s.id === current));
  const stage = stages[index];

  const [running, setRunning] = useState(false);
  // Fade only after the visitor changes stage, so server and client markup match.
  const [interacted, setInteracted] = useState(false);
  const signalRef = useRef<HTMLDivElement>(null);

  const select = useCallback(
    (id: string) => {
      setInteracted(true);
      setInternal(id);
      onSelect?.(id);
    },
    [onSelect],
  );

  const { refs, setRef, onKeyDown } = useTabKeys(stages.length, index, (next) => {
    setRunning(false);
    select(stages[next].id);
  });

  // Advance one stage per tick while the walkthrough runs.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (index >= stages.length - 1) setRunning(false);
      else select(stages[index + 1].id);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, stages, select]);

  // Keep the signal marker aligned with the selected stage's node (direct DOM write; no re-render).
  useLayoutEffect(() => {
    const tab = refs.current[index];
    if (tab && signalRef.current) signalRef.current.style.top = `${tab.offsetTop + tab.offsetHeight / 2 - 3}px`;
  }, [index, refs, running]);

  const startWalkthrough = () => {
    if (running) {
      setRunning(false);
      return;
    }
    select(stages[0].id);
    setRunning(true);
  };

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;

  const rows: { term: string; value: React.ReactNode }[] = [
    { term: "Input", value: stage.input },
    { term: "Processing", value: stage.process },
    { term: "Output", value: stage.output },
  ];
  if (stage.tech.length) rows.push({ term: "Technology", value: stage.tech.join(" · ") });
  if (stage.rationale) rows.push({ term: "Why this way", value: stage.rationale });
  if (stage.limitation) rows.push({ term: "Limitation", value: stage.limitation });
  const exampleValue = exampleRow?.value(stage.id);
  if (exampleRow && exampleValue) rows.push({ term: exampleRow.title, value: exampleValue });

  return (
    <div className={`grid gap-6 ${stacked ? "" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"}`}>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="label">{stages.length} stages</p>
          <button
            type="button"
            onClick={startWalkthrough}
            aria-pressed={running}
            className="inline-flex min-h-10 items-center gap-2 rounded-control border border-rule px-3 text-sm text-ink transition-colors hover:border-rule-strong hover:bg-surface"
          >
            {running ? <Square aria-hidden className="h-3.5 w-3.5" /> : <Play aria-hidden className="h-3.5 w-3.5" />}
            {running ? "Stop" : "Walk through"}
          </button>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute bottom-6 left-[15px] top-6 w-px bg-rule" />
          {running && (
            <div
              ref={signalRef}
              aria-hidden
              className="absolute left-[12px] h-[7px] w-[7px] rounded-full bg-accent transition-[top] duration-700 ease-in-out"
              style={{ boxShadow: "0 0 0 3px var(--bg)" }}
            />
          )}
          <div role="tablist" aria-label={label} aria-orientation="vertical" onKeyDown={onKeyDown}>
            {stages.map((s, i) => {
              const isSelected = i === index;
              return (
                <button
                  key={s.id}
                  ref={setRef(i)}
                  role="tab"
                  type="button"
                  id={tabId(s.id)}
                  aria-selected={isSelected}
                  aria-controls={panelId}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => {
                    setRunning(false);
                    select(s.id);
                  }}
                  className={`relative flex min-h-12 w-full items-center gap-4 border-b border-rule py-2 pr-2 text-left transition-colors ${
                    isSelected ? "text-ink" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                      isSelected ? "border-accent bg-accent text-on-accent" : "border-rule-strong bg-bg text-ink-3"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-[15px] leading-snug ${isSelected ? "font-medium" : ""}`}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(stage.id)}
        aria-live={running ? "polite" : "off"}
        className="rounded-panel border border-rule bg-surface px-4 py-5 sm:px-6"
      >
        <motion.div
          key={stage.id}
          initial={interacted && !reduceMotion ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          <p className="label">
            Stage {String(index + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 text-lg font-semibold tracking-tight text-ink">{stage.label}</h4>
          <dl className="mt-3">
            {rows.map((row) => (
              <div key={row.term} className="grid gap-1 border-t border-rule py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
                <dt className={`label sm:pt-1 ${row.term === exampleRow?.title ? "!text-accent" : ""}`}>{row.term}</dt>
                <dd className="max-w-prose text-[15px] leading-relaxed text-ink-2">{row.value}</dd>
              </div>
            ))}
          </dl>
          {stage.source && (
            <a
              href={stage.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-10 items-center gap-1.5 font-mono text-xs text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
            >
              Source: {stage.source.label}
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
