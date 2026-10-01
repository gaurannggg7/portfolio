import type { ProjectSlug } from "@/content/types";

/** Campus location for each project. */
export const LOCATIONS: Record<ProjectSlug, { name: string; blurb: string }> = {
  signlink: { name: "Accessibility Lab", blurb: "Speech in, sign language out." },
  baseline: { name: "Ledger Office", blurb: "Transaction ledgers become briefs." },
  guardian: { name: "Fraud Observatory", blurb: "Watching how money moves." },
  visionary: { name: "Hardware Workshop", blurb: "A glove that reads letters." },
};

const v = (name: string) => ({ fill: `var(--${name})` });
const OUTLINE = { stroke: "var(--ink-2)", strokeWidth: 2 } as const;

function Windows({ xs, ys, w = 16, h = 14 }: { xs: number[]; ys: number[]; w?: number; h?: number }) {
  return (
    <g>
      {ys.flatMap((y) => xs.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} style={v("window")} {...OUTLINE} strokeWidth={1.5} />))}
    </g>
  );
}

function AccessibilityLab() {
  return (
    <g>
      <rect x={18} y={60} width={124} height={90} style={v("wall-1")} {...OUTLINE} />
      <rect x={18} y={60} width={124} height={8} style={v("wall-2")} />
      <rect x={10} y={48} width={140} height={14} style={v("roof-1")} {...OUTLINE} />
      <Windows xs={[30, 72, 114]} ys={[76, 100]} />
      <rect x={68} y={118} width={24} height={32} style={v("roof-1")} {...OUTLINE} />
      {/* Speech-bubble sign: SignLink starts from spoken English */}
      <path d="M58 12h44v24h-26l-8 8v-8h-10z" style={v("surface")} {...OUTLINE} />
      <rect className="cp-dot" x={66} y={22} width={4} height={4} style={v("ink")} />
      <rect className="cp-dot" x={78} y={22} width={4} height={4} style={{ ...v("ink"), animationDelay: "0.3s" }} />
      <rect className="cp-dot" x={90} y={22} width={4} height={4} style={{ ...v("ink"), animationDelay: "0.6s" }} />
      <rect x={78} y={36} width={4} height={12} style={v("ink-2")} />
    </g>
  );
}

function LedgerOffice() {
  return (
    <g>
      <rect x={14} y={138} width={132} height={12} style={v("wall-2")} {...OUTLINE} />
      <rect x={22} y={64} width={116} height={74} style={v("wall-1")} {...OUTLINE} />
      <path d="M10 64L80 26L150 64z" style={v("roof-3")} {...OUTLINE} />
      {[30, 58, 94, 122].map((x) => (
        <rect key={x} x={x} y={70} width={8} height={68} style={v("wall-2")} {...OUTLINE} strokeWidth={1.5} />
      ))}
      <rect x={68} y={104} width={24} height={34} style={v("roof-3")} {...OUTLINE} />
      {/* Bar-chart placard */}
      <rect x={60} y={72} width={40} height={24} style={v("surface")} {...OUTLINE} strokeWidth={1.5} />
      <rect className="cp-bar" x={66} y={86} width={6} height={6} style={v("ink")} />
      <rect className="cp-bar" x={77} y={80} width={6} height={12} style={{ ...v("ink"), animationDelay: "0.25s" }} />
      <rect className="cp-bar" x={88} y={76} width={6} height={16} style={{ ...v("ink"), animationDelay: "0.5s" }} />
    </g>
  );
}

function FraudObservatory() {
  return (
    <g>
      <rect x={34} y={86} width={92} height={64} style={v("wall-1")} {...OUTLINE} />
      <path d="M34 86v-8h4v-8h6v-8h8v-6h10v-4h36v4h10v6h8v8h6v8h4v8z" style={v("roof-4")} {...OUTLINE} />
      <rect x={76} y={52} width={10} height={34} style={v("window")} />
      {/* Telescope */}
      <path className="cp-telescope" d="M84 60l40-30l6 8l-40 30z" style={v("wall-2")} {...OUTLINE} strokeWidth={1.5} />
      <rect x={46} y={102} width={14} height={14} style={v("window")} {...OUTLINE} strokeWidth={1.5} />
      <rect x={100} y={102} width={14} height={14} style={v("window")} {...OUTLINE} strokeWidth={1.5} />
      <rect x={68} y={118} width={24} height={32} style={v("roof-4")} {...OUTLINE} />
      {/* Linked dots: an account network */}
      <g style={v("sky-2")}>
        <rect x={18} y={18} width={4} height={4} />
        <rect x={34} y={30} width={4} height={4} />
        <rect x={20} y={40} width={4} height={4} />
      </g>
    </g>
  );
}

function HardwareWorkshop() {
  return (
    <g>
      <rect x={12} y={64} width={136} height={86} style={v("wall-1")} {...OUTLINE} />
      <rect x={118} y={22} width={12} height={30} style={v("wall-2")} {...OUTLINE} />
      <g style={v("cloud")}>
        <rect className="cp-smoke" x={118} y={8} width={10} height={8} />
        <rect className="cp-smoke" x={122} y={4} width={8} height={6} style={{ animationDelay: "1.2s" }} />
        <rect className="cp-smoke" x={116} y={10} width={8} height={6} style={{ animationDelay: "2.4s" }} />
      </g>
      <path d="M12 64L12 40L56 64L56 40L100 64L100 40L148 64z" style={v("roof-2")} {...OUTLINE} />
      <rect x={22} y={98} width={58} height={52} style={v("wall-2")} {...OUTLINE} />
      {[106, 114, 122, 130, 138].map((y) => (
        <rect key={y} x={24} y={y} width={54} height={2} style={v("ink-3")} />
      ))}
      <Windows xs={[94, 120]} ys={[76]} w={20} h={14} />
      {/* Microcontroller sign */}
      <rect x={100} y={106} width={28} height={28} style={v("ink-2")} />
      {[110, 118, 126].map((p) => (
        <g key={p} style={v("ink-2")}>
          <rect x={96} y={p - 2} width={4} height={3} />
          <rect x={128} y={p - 2} width={4} height={3} />
        </g>
      ))}
      <rect x={108} y={114} width={12} height={12} style={v("window")} />
    </g>
  );
}

export const DRAW: Record<ProjectSlug, () => React.ReactElement> = {
  signlink: AccessibilityLab,
  baseline: LedgerOffice,
  guardian: FraudObservatory,
  visionary: HardwareWorkshop,
};

function Tree({ x }: { x: number }) {
  return (
    <g>
      <rect x={x + 6} y={128} width={6} height={22} style={v("trunk")} />
      <path d={`M${x} 132h18v-10h-2v-8h-4v-6h-6v6h-4v8h-2z`} style={v("leaf")} />
    </g>
  );
}

/** One campus plot: sky, grass, the building, and a tree. Decorative; the link label is HTML. */
export function Plot({ slug, tree = "right" }: { slug: ProjectSlug; tree?: "left" | "right" | "none" }) {
  const Building = DRAW[slug];
  return (
    <svg aria-hidden viewBox="0 0 180 170" shapeRendering="crispEdges" preserveAspectRatio="xMidYMax slice" className="block h-full w-full">
      <rect x={0} y={0} width={180} height={150} style={v("sky-1")} />
      <rect x={0} y={0} width={180} height={60} style={v("sky-2")} />
      <rect x={0} y={150} width={180} height={20} style={v("grass-1")} />
      <rect x={0} y={162} width={180} height={8} style={v("path")} />
      <rect x={0} y={160} width={180} height={2} style={v("path-edge")} />
      <g transform="translate(10 0)">
        <Building />
      </g>
      {tree === "right" && <Tree x={158} />}
      {tree === "left" && <Tree x={2} />}
    </svg>
  );
}
