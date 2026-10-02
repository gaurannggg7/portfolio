/** The two-node workflow as a compact figure, from agent/graph.py. */
const STEPS = [
  { k: "Query", v: "an entity category, not a person" },
  { k: "Guardrail", v: "keyword filter, before any call" },
  { k: "retrieve", v: "top 5 excerpts · Chroma" , node: true },
  { k: "synthesize", v: "cited report · Groq", node: true },
  { k: "Parse", v: "citations vs sources" },
];

export default function OsintFlow({ vertical = false }: { vertical?: boolean }) {
  return (
    <ol className={`grid gap-1.5 ${vertical ? "" : "sm:grid-cols-5"}`} aria-label="Workflow from query to cited report">
      {STEPS.map((s, i) => (
        <li
          key={s.k}
          className={`relative flex flex-col justify-between rounded-control border p-2.5 ${vertical ? "min-h-14 pr-10" : "min-h-20"} ${s.node ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink"}`}
        >
          <span className="font-mono text-[10px] opacity-70">{s.node ? "LangGraph node" : String(i + 1).padStart(2, "0")}</span>
          <span className={`${s.node ? "font-mono" : ""} text-sm font-medium`}>{s.k}</span>
          <span className="text-[11px] leading-snug opacity-80">{s.v}</span>
        </li>
      ))}
    </ol>
  );
}
