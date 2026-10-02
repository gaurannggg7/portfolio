"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { bellwether as snap } from "@/content/bellwether-snapshot";
import { DIMENSIONS, SCENARIO_LABEL, fmt, splitSentences } from "./data";

type Version = "baseline" | "candidate";
const VERSION_LABEL: Record<Version, string> = { baseline: "prompt_v1", candidate: "prompt_v2" };

const levelText = (l: string | null) => (l ? l.replace(/_/g, " ") : "none");

/**
 * Scenario explorer over Bellwether's committed snapshot. Everything shown is
 * read from content/bellwether-snapshot.ts; nothing is recomputed here.
 */
export default function RegressionExplorer() {
  const uid = useId();
  const [sid, setSid] = useState<string>(snap.scenarios[0].id);
  const [version, setVersion] = useState<Version>("candidate");
  const sc = snap.scenarios.find((s) => s.id === sid)!;
  const run = sc[version];
  const other = sc[version === "baseline" ? "candidate" : "baseline"];

  const v1 = splitSentences(sc.baseline.response);
  const v2 = splitSentences(sc.candidate.response);
  const dropped = new Set(v1.filter((s) => !v2.includes(s)));
  const added = new Set(v2.filter((s) => !v1.includes(s)));
  const extraRules = sc.candidate.routing.rules.filter((r) => !(sc.baseline.routing.rules as readonly string[]).includes(r));
  const sameAction = sc.baseline.routing.action === sc.candidate.routing.action;

  const readings = [
    { who: "Reference label", level: refLevel(sc.reference), note: "Scoring only. Hidden from generator and evaluator." },
    { who: "Rules layer", level: run.classifier.rules, note: "Deterministic phrase rules" },
    { who: "Model classifier", level: run.classifier.model, note: "Mock lexical classifier in these runs" },
    { who: "Evaluator", level: run.evaluator.assessed, note: "Rubric evaluator, scored the reply" },
  ];

  return (
    <div className="space-y-5">
      <p className="rounded-panel border border-rule bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink-2">
        <strong className="font-semibold text-ink">Content note.</strong> These synthetic messages describe suicidal thoughts. Every
        scenario, label, and reply was written or generated for engineering evaluation. Both runs are deterministic mock runs; no live model
        and no real person is involved.
      </p>

      {/* Scenario picker */}
      <div role="group" aria-labelledby={`${uid}-sc`}>
        <p id={`${uid}-sc`} className="label">
          1 · Pick a scenario
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {snap.scenarios.map((s) => {
            const on = s.id === sid;
            const blocked = s.candidate.evaluator.hardGateFailed && !s.baseline.evaluator.hardGateFailed;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSid(s.id)}
                  className={`flex min-h-14 w-full flex-col items-start justify-center rounded-control border px-3 py-2 text-left transition-colors ${
                    on ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink hover:border-ink"
                  }`}
                >
                  <span className="text-[15px] font-medium">{SCENARIO_LABEL[s.id]}</span>
                  <span className={`font-mono text-[11px] ${on ? "opacity-80" : "text-ink-3"}`}>
                    {s.id} · expects {s.expectedAction.replace(/_SIMULATION$/, "").toLowerCase().replace(/_/g, " ")}
                    {blocked ? " · new hard-gate failure" : s.id === "synthetic_001" ? " · unchanged control" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        {/* Input */}
        <section aria-labelledby={`${uid}-in`} className="rounded-panel border border-rule bg-surface p-4 shadow-panel">
          <h3 id={`${uid}-in`} className="label">
            2 · Synthetic input and context
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-ink-3">Context</dt>
              <dd className="text-ink-2">{sc.context}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Treatment goal · approved strategy</dt>
              <dd className="text-ink-2">
                {sc.treatmentGoal} · {sc.copingStrategy}
              </dd>
            </div>
          </dl>
          <blockquote className="mt-3 border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-ink">“{sc.message}”</blockquote>
          <div className="mt-4 rounded-control border border-dashed border-rule-strong p-3">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-3">Reference label · not in generator or evaluator context</p>
            <p className="mt-1 font-mono text-xs text-ink-2">
              ideation severity {sc.reference.ideationSeverity ?? "none"} · risk context {sc.reference.riskContext} · expected{" "}
              {sc.expectedAction}
            </p>
          </div>
        </section>

        {/* Replies */}
        <section aria-labelledby={`${uid}-out`} className="rounded-panel border border-rule bg-surface p-4 shadow-panel">
          <h3 id={`${uid}-out`} className="label">
            3 · The two replies
          </h3>
          <div className="mt-3 space-y-3">
            {(["baseline", "candidate"] as const).map((v) => {
              const sentences = v === "baseline" ? v1 : v2;
              return (
                <div key={v}>
                  <p className="font-mono text-xs text-ink-3">
                    {VERSION_LABEL[v]} · {v}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink">
                    {sentences.map((s, i) => {
                      const gone = v === "baseline" && dropped.has(s);
                      const neu = v === "candidate" && added.has(s);
                      return (
                        <span key={i} className={gone ? "bg-fail-soft text-ink decoration-fail" : neu ? "underline decoration-accent decoration-2 underline-offset-4" : ""}>
                          {s}
                          {gone && <span className="sr-only"> (dropped in prompt_v2)</span>}{" "}
                        </span>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
          {dropped.size > 0 ? (
            <p className="mt-3 text-xs leading-relaxed text-ink-3">
              <span className="inline-block h-2.5 w-2.5 bg-fail-soft align-middle ring-1 ring-fail" aria-hidden /> Shaded sentences are in
              prompt_v1&apos;s reply and missing from prompt_v2&apos;s, which was asked to be shorter, lead with coping, and save care-team
              language for explicit intent.
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-3">Both prompt versions produced the same reply for this scenario.</p>
          )}
        </section>
      </div>

      {/* Version switch for the readings below */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="label" id={`${uid}-v`}>
          4 · Readings for
        </p>
        <div role="group" aria-labelledby={`${uid}-v`} className="inline-flex rounded-control border border-rule-strong p-0.5">
          {(["baseline", "candidate"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={version === v}
              onClick={() => setVersion(v)}
              className={`min-h-10 rounded-control px-3 font-mono text-sm ${version === v ? "bg-ink text-bg" : "text-ink-2 hover:text-ink"}`}
            >
              {VERSION_LABEL[v]}
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Independent readings" className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-rule bg-rule sm:grid-cols-4">
        {readings.map((r) => (
          <div key={r.who} className="bg-surface p-3">
            <p className="text-xs text-ink-3">{r.who}</p>
            <p className="mt-1 font-mono text-sm font-medium text-ink">{levelText(r.level)}</p>
            <p className="mt-1 text-xs leading-snug text-ink-3">{r.note}</p>
          </div>
        ))}
      </section>
      <p className="-mt-2 text-xs text-ink-3 [overflow-wrap:anywhere]">
        Rules and model {run.classifier.agree ? "agree" : "disagree"} · fused confidence {run.classifier.confidence} · signals{" "}
        {run.classifier.signals.length ? run.classifier.signals.join(", ") : "none"}
      </p>

      {/* Dimension scores */}
      <section aria-labelledby={`${uid}-dim`} className="rounded-panel border border-rule bg-surface shadow-panel">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pt-4">
          <h3 id={`${uid}-dim`} className="label">
            5 · Dimension scores · {VERSION_LABEL[version]}
          </h3>
          <p className="font-mono text-xs text-ink-2">
            aggregate {fmt(run.evaluator.aggregate)} (was {fmt(other.evaluator.aggregate)} in {VERSION_LABEL[version === "baseline" ? "candidate" : "baseline"]}) ·{" "}
            <span className={run.evaluator.hardGateFailed ? "font-semibold text-fail" : "text-pass"}>
              hard gate {run.evaluator.hardGateFailed ? "failed" : "passed"}
            </span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs text-ink-3">
                <th scope="col" className="px-4 py-2 font-normal">Dimension</th>
                <th scope="col" className="px-2 py-2 font-normal">Weight</th>
                <th scope="col" className="px-2 py-2 text-right font-normal">Score</th>
                <th scope="col" className="px-4 py-2 font-normal">Reason codes</th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => {
                const r = run.evaluator.dimensions[d.name];
                return (
                  <tr key={d.name} className={`border-b border-rule last:border-0 ${r.passed ? "" : "bg-fail-soft"}`}>
                    <th scope="row" className="px-4 py-2 font-normal text-ink">
                      {d.name.replace(/_/g, " ")}
                      {d.hardGate && <span className="ml-2 whitespace-nowrap rounded-control border border-rule-strong px-1 font-mono text-[10px] uppercase text-ink-2">hard gate</span>}
                    </th>
                    <td className="px-2 py-2 font-mono text-xs text-ink-3">{d.weight.toFixed(2)}</td>
                    <td className={`px-2 py-2 text-right font-mono ${r.passed ? "text-ink" : "font-semibold text-fail"}`}>
                      {fmt(r.score)}
                      {!r.passed && <span className="sr-only"> failed</span>}
                    </td>
                    <td className="px-4 py-2 font-mono text-[11px] text-ink-2">{r.reasonCodes.join(" · ") || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Routing */}
      <section aria-labelledby={`${uid}-rt`} className="rounded-panel border border-rule bg-surface p-4 shadow-panel">
        <h3 id={`${uid}-rt`} className="label">
          6 · Routing
        </h3>
        {/* Rule names are long unbroken identifiers; let them wrap so the panel fits a phone. */}
        <div className="mt-3 grid gap-4 [overflow-wrap:anywhere] sm:grid-cols-2">
          {(["baseline", "candidate"] as const).map((v) => (
            <div key={v} className="min-w-0">
              <p className="font-mono text-xs text-ink-3">{VERSION_LABEL[v]}</p>
              <p className="mt-1 font-mono text-sm font-medium text-ink">{sc[v].routing.action}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-2">rules: {sc[v].routing.rules.join(", ")}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-rule pt-3 text-[15px] leading-relaxed text-ink [overflow-wrap:anywhere]">
          {sameAction ? "Same routing action in both versions. " : "The routing action changed. "}
          {extraRules.length > 0
            ? `prompt_v2's reply also fired ${extraRules.join(" and ")}, but those rules only raise an action to a minimum level, and it was already there. Routing did not move; the reply got worse.`
            : "No extra rules fired."}
        </p>
        <a
          href={`https://bellwether-eval.vercel.app/scenario/${sc.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
        >
          Open {sc.id} in the Bellwether dashboard <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}

function refLevel(r: { ideationSeverity: number | null; riskContext: string }) {
  return r.ideationSeverity == null ? "none" : `severity ${r.ideationSeverity} · ${r.riskContext} risk`;
}
