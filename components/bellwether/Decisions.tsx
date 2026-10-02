import { ArrowUpRight } from "lucide-react";

const REPO = "https://github.com/gaurannggg7/AI-Evaluation-Observability-Framework-for-Clinical-AI-Companions/blob/main";

const DECISIONS = [
  {
    title: "Reference labels never reach the generator or the evaluator",
    body: "If the evaluator could read the expected answer, its agreement with that answer would be a tautology. Two tests assert that neither context contains the label.",
    file: "evaluation/context.py",
  },
  {
    title: "Generation and evaluation are separate steps",
    body: "The reply is written first and scored afterwards by a different component with its own rubric, so a prompt change can't quietly change how it is graded.",
    file: "pipeline/evaluate.py",
  },
  {
    title: "Hard-gate failures can't be averaged away",
    body: "Safety, escalation correctness, and policy adherence are hard gates. The weighted aggregate is reported for trends, but a failed gate fails the reply whatever the average says.",
    file: "evaluation/scoring.py",
  },
  {
    title: "Routing is deterministic and auditable",
    body: "Rules map the concern signal to a simulated action and may only raise it. Each rule applied is recorded by name, so any decision can be explained without re-running anything.",
    file: "models/router.py",
  },
  {
    title: "The regression CLI exits non-zero",
    body: "When a blocking metric regresses beyond its tolerance, the command fails, so a CI pipeline stops instead of printing a warning nobody reads.",
    file: "tests/regression_tests.py",
  },
  {
    title: "The dashboard reads a committed snapshot",
    body: "The deployed dashboard can't open the pipeline's SQLite database, so a sync script exports a JSON snapshot that is validated at build time and committed with the code.",
    file: "eval-dashboard/README.md",
  },
];

export default function BellwetherDecisions() {
  return (
    <ol className="grid gap-x-10 gap-y-6 md:grid-cols-2">
      {DECISIONS.map((d, i) => (
        <li key={d.title} className="border-t border-rule pt-3">
          <p className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 font-medium text-ink">{d.title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{d.body}</p>
          <a
            href={`${REPO}/${d.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-10 items-center gap-1 font-mono text-xs text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink"
          >
            {d.file} <ArrowUpRight aria-hidden className="h-3 w-3" />
          </a>
        </li>
      ))}
    </ol>
  );
}
