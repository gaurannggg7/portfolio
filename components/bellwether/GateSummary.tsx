import { bellwether as snap } from "@/content/bellwether-snapshot";
import { fmt } from "./data";

const ORDER = ["urgent_recall", "routing_accuracy", "missed_escalation_rate", "safety", "escalation_correctness", "hard_gate_failure_rate", "risk_detection_alignment"];
const LOWER_IS_BETTER = new Set(["hard_gate_failure_rate", "missed_escalation_rate", "false_escalation_rate"]);

/** The comparison's metric deltas, straight from the committed snapshot. */
export default function GateSummary({ compact = false }: { compact?: boolean }) {
  const rows = ORDER.map((n) => snap.deltas.find((d) => d.name === n)!).filter(Boolean);
  return (
    <figure className="rounded-panel border border-rule bg-surface shadow-panel">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3">
        <p className="font-mono text-xs text-ink-2">
          {snap.runs.baseline.promptVersion} → {snap.runs.candidate.promptVersion} · {snap.snapshot.scenarioCount} synthetic scenarios · mock runs
        </p>
        <p className={`font-mono text-xs font-semibold uppercase tracking-wide ${snap.gatePassed ? "text-pass" : "text-fail"}`}>
          Gate {snap.gatePassed ? "passed" : "blocked"}
        </p>
      </div>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Metric deltas between the two prompt versions</caption>
        <thead>
          <tr className="text-xs text-ink-3">
            <th scope="col" className="px-4 pb-1 pt-3 font-normal">Metric</th>
            <th scope="col" className="px-2 pb-1 pt-3 text-right font-normal">v1</th>
            <th scope="col" className="px-2 pb-1 pt-3 text-right font-normal">v2</th>
            {!compact && <th scope="col" className="px-4 pb-1 pt-3 font-normal">Gate</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const worse = d.regression;
            return (
              <tr key={d.name} className={worse ? "bg-fail-soft" : ""}>
                <th scope="row" className="px-4 py-1.5 font-normal text-ink">
                  {d.name.replace(/_/g, " ")}
                  {LOWER_IS_BETTER.has(d.name) && <span className="text-ink-3"> (lower is better)</span>}
                </th>
                <td className="px-2 py-1.5 text-right font-mono text-ink-2">{fmt(d.baseline)}</td>
                <td className={`px-2 py-1.5 text-right font-mono ${worse ? "font-semibold text-fail" : "text-ink"}`}>{fmt(d.candidate)}</td>
                {!compact && (
                  <td className="px-4 py-1.5 font-mono text-[11px] text-ink-2">
                    {d.blocking ? (worse ? "blocks" : "blocking · held") : worse ? "reported only" : "reported"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <figcaption className="border-t border-rule px-4 py-3 text-xs leading-relaxed text-ink-3">
        From eval-dashboard/data/snapshot.json ({snap.snapshot.sourceFile}). Routing was identical in all {snap.snapshot.scenarioCount} scenarios.
      </figcaption>
    </figure>
  );
}
