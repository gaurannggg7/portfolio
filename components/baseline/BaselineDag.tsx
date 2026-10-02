/** Baseline's LangGraph topology: validate, three parallel nodes, then the brief. */

type Box = { id: string; x: number; y: number; w: number; title: string; sub: string; kind: "io" | "llm" | "code" };

const BOXES: Box[] = [
  { id: "csv", x: 8, y: 112, w: 92, title: "CSV", sub: "upload", kind: "io" },
  { id: "parse", x: 124, y: 112, w: 108, title: "Validate", sub: "422, not 500", kind: "code" },
  { id: "categorize", x: 268, y: 28, w: 128, title: "Categorize", sub: "LLM · JSON", kind: "llm" },
  { id: "anomalies", x: 268, y: 112, w: 128, title: "Anomalies", sub: "LLM · JSON", kind: "llm" },
  { id: "runway", x: 268, y: 196, w: 128, title: "Runway", sub: "Python · no LLM", kind: "code" },
  { id: "summarize", x: 432, y: 112, w: 120, title: "Brief", sub: "LLM · text", kind: "llm" },
];

const H = 48;
const byId = Object.fromEntries(BOXES.map((b) => [b.id, b]));
const EDGES: [string, string][] = [
  ["csv", "parse"],
  ["parse", "categorize"],
  ["parse", "anomalies"],
  ["parse", "runway"],
  ["categorize", "summarize"],
  ["anomalies", "summarize"],
  ["runway", "summarize"],
];

export default function BaselineDag({ idPrefix, highlight }: { idPrefix: string; highlight?: string }) {
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Baseline's graph: validate the CSV, then categorize, detect anomalies, and compute runway in parallel, then write the brief." className="block h-auto w-full">
      <defs>
        <marker id={`${idPrefix}-arr`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8z" style={{ fill: "var(--ink-3)" }} />
        </marker>
      </defs>
      {EDGES.map(([a, b]) => {
        const A = byId[a];
        const B = byId[b];
        const x1 = A.x + A.w;
        const y1 = A.y + H / 2;
        const x2 = B.x - 4;
        const y2 = B.y + H / 2;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={`${a}-${b}`}
            d={`M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
            fill="none"
            style={{ stroke: "var(--ink-3)" }}
            strokeWidth={1.5}
            markerEnd={`url(#${idPrefix}-arr)`}
          />
        );
      })}
      {BOXES.map((b) => {
        const lit = highlight === b.id;
        const llm = b.kind === "llm";
        return (
          <g key={b.id}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={H}
              rx={8}
              strokeDasharray={b.kind === "io" ? "4 3" : undefined}
              style={{
                fill: lit ? "var(--accent-soft)" : "var(--surface)",
                stroke: lit || llm ? "var(--accent)" : "var(--rule-strong)",
              }}
              strokeWidth={lit ? 2.5 : 1.5}
            />
            <text x={b.x + 12} y={b.y + 21} fontSize={14} fontWeight={600} className="sch-title" style={{ fill: "var(--ink)" }}>
              {b.title}
            </text>
            <text x={b.x + 12} y={b.y + 38} fontSize={11} className="sch-sub font-mono" style={{ fill: "var(--ink-2)" }}>
              {b.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
