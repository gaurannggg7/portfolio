"use client";

import { useState } from "react";
import { NODES, floors } from "@/content/baseline-eval";

type Mode = "sequential" | "parallel";
const SCALE = 28; // seconds shown on the axis

/** Timeline of measured per-node means under both graph topologies. */
export default function TopologyExplorer() {
  const [mode, setMode] = useState<Mode>("parallel");
  const f = floors();
  const [cat, anom, run, sum] = NODES;

  // Start offsets (seconds) for each node in the chosen topology.
  const starts: Record<string, number> =
    mode === "sequential"
      ? { [cat.id]: 0, [anom.id]: cat.meanSeconds, [run.id]: cat.meanSeconds + anom.meanSeconds, [sum.id]: cat.meanSeconds + anom.meanSeconds + run.meanSeconds }
      : { [cat.id]: 0, [anom.id]: 0, [run.id]: 0, [sum.id]: Math.max(cat.meanSeconds, anom.meanSeconds, run.meanSeconds) };
  const total = mode === "sequential" ? f.sequential : f.parallel;
  const pct = (s: number) => `${(s / SCALE) * 100}%`;

  return (
    <div className="rounded-panel border border-rule bg-surface p-4 shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset>
          <legend className="label mb-2">Graph topology</legend>
          <div className="inline-flex rounded-control border border-rule p-0.5">
            {(["sequential", "parallel"] as Mode[]).map((m) => (
              <label
                key={m}
                className={`relative flex min-h-10 cursor-pointer items-center rounded-control px-3 text-sm capitalize transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)] ${
                  mode === m ? "bg-ink text-bg" : "text-ink-2 hover:text-ink"
                }`}
              >
                <input type="radio" name="baseline-topology" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-right" aria-live="polite">
          <span className="label block">Floor from per-node means</span>
          <span className="font-mono text-2xl text-ink">{total.toFixed(1)} s</span>
        </p>
      </div>

      <div className="mt-6" role="img" aria-label={`${mode} timeline: ${NODES.map((n) => `${n.label} ${n.meanSeconds.toFixed(2)} seconds`).join(", ")}; total ${total.toFixed(1)} seconds.`}>
        <div className="space-y-2.5">
          {NODES.map((n) => (
            <div key={n.id} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <span className="text-sm text-ink">
                {n.label}
                <span className="block font-mono text-[11px] text-ink-3">{n.llm ? "LLM" : "Python"} · {n.meanSeconds < 0.01 ? "0.0001" : n.meanSeconds.toFixed(2)} s</span>
              </span>
              <div className="relative h-7 rounded-control bg-surface-2">
                <div
                  className={`absolute top-0 h-full rounded-control transition-[left] duration-500 ease-out ${n.llm ? "bg-accent" : "bg-ink"}`}
                  style={{ left: pct(starts[n.id]), width: n.meanSeconds < 0.2 ? "3px" : pct(n.meanSeconds) }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <span />
          <div className="relative h-4 font-mono text-[10px] text-ink-3">
            {[0, 7, 14, 21, 28].map((t) => (
              <span key={t} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: pct(t) }}>
                {t}s
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-2">
        Running the three independent nodes together saves at most {f.saved.toFixed(1)} s (≈{Math.round(f.pct * 100)}%), because the
        brief waits for all of them. On the free tier, the parallel calls also share one tokens-per-minute limit, and an
        end-to-end A/B test was inconclusive.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ink-3">
        Measured per-node means from eval/RESULTS.md (Llama 3.3 70B, since retired). Not a live run.
      </p>
    </div>
  );
}
