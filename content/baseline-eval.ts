/**
 * Measurements from Baseline's eval/RESULTS.md (github.com/gaurannggg7/cpg-cfo-agent).
 * Taken against llama-3.3-70b-versatile at temperature 0, seed 42, before the
 * migration to gpt-oss-120b. Not re-measured since.
 */

export type GraphNode = { id: string; label: string; meanSeconds: number; llm: boolean };

export const NODES: GraphNode[] = [
  { id: "categorize", label: "Categorize", meanSeconds: 8.32, llm: true },
  { id: "anomalies", label: "Detect anomalies", meanSeconds: 4.71, llm: true },
  { id: "runway", label: "Runway", meanSeconds: 0.0001, llm: false },
  { id: "summarize", label: "Executive brief", meanSeconds: 14.45, llm: true },
];

/** Floors implied by per-node means (no network, auth, or queueing). */
export function floors() {
  const [cat, anom, run, sum] = NODES.map((n) => n.meanSeconds);
  const sequential = cat + anom + run + sum;
  const parallel = Math.max(cat, anom, run) + sum;
  return { sequential, parallel, saved: sequential - parallel, pct: (sequential - parallel) / sequential };
}

export const RELIABILITY: { measure: string; before: string; after: string; note?: string }[] = [
  { measure: "Adversarial corpus pass rate", before: "18/29 (62%)", after: "27/27 (100%)", note: "2 files not run (API quota)" },
  { measure: "Unhandled 500 crashes", before: "10", after: "0" },
  { measure: "Category totals matching pandas", before: "3/19 runs", after: "exact, by construction" },
  { measure: "Distinct financial figures over identical runs", before: "22 in 22", after: "1 in 7" },
  { measure: "Prompt injections obeyed", before: "0/2", after: "0/2" },
];
