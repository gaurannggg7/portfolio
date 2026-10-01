import { accounts, money, transfers, type Transfer } from "@/content/guardian-graph";

export type Selection = { kind: "account"; id: string } | { kind: "transfer"; id: string } | null;

const NODE = 40;
export const accountById = Object.fromEntries(accounts.map((a) => [a.id, a]));

/** Edge endpoints trimmed to the node boxes so arrowheads stay visible. */
function edgeLine(t: Transfer) {
  const a = accountById[t.from];
  const b = accountById[t.to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const pad = NODE / 2 / Math.max(Math.abs(ux), Math.abs(uy)) + 4;
  return { x1: a.x + ux * pad, y1: a.y + uy * pad, x2: b.x - ux * pad, y2: b.y - uy * pad };
}

type Props = {
  /** Prefix for marker ids so several diagrams can share a page. */
  idPrefix: string;
  selection?: Selection;
  showPattern?: boolean;
  /** Omit both handlers for a static, non-interactive preview. */
  onToggleAccount?: (id: string) => void;
  onSelectTransfer?: (id: string) => void;
  label: string;
};

/** The synthetic GuardianAI transaction network, drawn as SVG. */
export default function NetworkDiagram({ idPrefix, selection = null, showPattern = false, onToggleAccount, onSelectTransfer, label }: Props) {
  const interactive = Boolean(onToggleAccount);
  const selectedAccount = selection?.kind === "account" ? accountById[selection.id] : null;
  const selectedTransfer = selection?.kind === "transfer" ? transfers.find((t) => t.id === selection.id) : null;

  const isEdgeActive = (t: Transfer) => {
    if (selectedAccount) return t.from === selectedAccount.id || t.to === selectedAccount.id;
    if (selectedTransfer) return t.id === selectedTransfer.id;
    if (showPattern) return t.inPattern;
    return true;
  };
  const isNodeActive = (id: string) => {
    if (selectedAccount) return id === selectedAccount.id || transfers.some((t) => isEdgeActive(t) && (t.from === id || t.to === id));
    if (selectedTransfer) return id === selectedTransfer.from || id === selectedTransfer.to;
    if (showPattern) return accountById[id].inPattern;
    return true;
  };
  const dimming = Boolean(selection) || showPattern;
  const edgeColor = (t: Transfer) => {
    if (showPattern && t.inPattern) return "accent";
    if (dimming && isEdgeActive(t)) return "ink";
    return "rule-strong";
  };

  return (
    <svg
      viewBox="50 28 572 360"
      role={interactive ? "group" : "img"}
      aria-label={label}
      className="block h-auto w-full"
    >
      <defs>
        {["ink", "accent", "rule-strong"].map((c) => (
          <marker key={c} id={`${idPrefix}-arrow-${c}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L8 4L0 8z" style={{ fill: `var(--${c})` }} />
          </marker>
        ))}
      </defs>

      {transfers.map((t) => {
        const l = edgeLine(t);
        const color = edgeColor(t);
        const width = 1 + Math.log10(t.amount) / 2;
        return (
          <g key={t.id} opacity={dimming && !isEdgeActive(t) ? 0.18 : 1} className="transition-opacity duration-200">
            <line {...l} style={{ stroke: `var(--${color})` }} strokeWidth={width} markerEnd={`url(#${idPrefix}-arrow-${color})`} />
            {onSelectTransfer && (
              // Wide invisible stroke makes the edge easy to tap
              <line {...l} stroke="transparent" strokeWidth={16} className="cursor-pointer" onClick={() => onSelectTransfer(t.id)}>
                <title>{`${t.from} → ${t.to}: ${money(t.amount)}, ${t.when}`}</title>
              </line>
            )}
          </g>
        );
      })}

      {accounts.map((a) => {
        const isSel = selectedAccount?.id === a.id;
        const inPatternView = showPattern && a.inPattern;
        const box = (
          <>
            <rect
              x={a.x - NODE / 2}
              y={a.y - NODE / 2}
              width={NODE}
              height={NODE}
              rx={8}
              style={{
                fill: isSel ? "var(--ink)" : inPatternView ? "var(--accent-soft)" : "var(--surface)",
                stroke: isSel ? "var(--ink)" : inPatternView ? "var(--accent)" : "var(--rule-strong)",
              }}
              strokeWidth={1.75}
            />
            <text
              x={a.x}
              y={a.y + 1}
              dominantBaseline="middle"
              textAnchor="middle"
              className="graph-label font-mono"
              fontSize={16}
              style={{ fill: isSel ? "var(--bg)" : "var(--ink)" }}
            >
              {a.label}
            </text>
          </>
        );
        if (!onToggleAccount) {
          return (
            <g key={a.id} opacity={dimming && !isNodeActive(a.id) ? 0.3 : 1}>
              {box}
            </g>
          );
        }
        return (
          <g
            key={a.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`Account ${a.label}. ${a.note}`}
            onClick={() => onToggleAccount(a.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleAccount(a.id);
              }
            }}
            opacity={dimming && !isNodeActive(a.id) ? 0.3 : 1}
            className="cursor-pointer outline-none transition-opacity duration-200 [&:focus-visible>rect.ring]:opacity-100"
          >
            <rect className="ring" x={a.x - NODE / 2 - 5} y={a.y - NODE / 2 - 5} width={NODE + 10} height={NODE + 10} rx={11} fill="none" style={{ stroke: "var(--focus)" }} strokeWidth={2.5} opacity={0} />
            <rect x={a.x - 28} y={a.y - 28} width={56} height={56} fill="transparent" />
            {box}
          </g>
        );
      })}
    </svg>
  );
}
