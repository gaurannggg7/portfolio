import { PROJECT_ORDER, featured } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { DRAW, LOCATIONS } from "./Buildings";

type Placement = { x: number; y: number; k: number; door: number; sign: { x: number; y: number } };
type Layout = {
  w: number;
  h: number;
  horizon: number;
  place: Record<ProjectSlug, Placement>;
  paths: [number, number, number, number][];
  trees: [number, number, number][];
  lamps: [number, number][];
  plaza?: { x: number; y: number };
  clouds: [number, number][];
};

const WIDE: Layout = {
  w: 1200,
  h: 680,
  horizon: 236,
  place: {
    signlink: { x: 112, y: 112, k: 1.35, door: 80, sign: { x: 262, y: 344 } },
    guardian: { x: 868, y: 106, k: 1.35, door: 80, sign: { x: 760, y: 344 } },
    visionary: { x: 96, y: 392, k: 1.5, door: 51, sign: { x: 340, y: 520 } },
    baseline: { x: 858, y: 392, k: 1.5, door: 80, sign: { x: 690, y: 520 } },
  },
  paths: [
    [0, 440, 1200, 40],
    [580, 300, 40, 380],
    [206, 312, 24, 130],
    [966, 306, 24, 136],
    [164, 478, 24, 140],
    [968, 478, 24, 140],
  ],
  trees: [[40, 300, 1.4], [470, 250, 1.2], [700, 252, 1.1], [1130, 300, 1.4], [460, 560, 1.5], [1140, 600, 1.3], [30, 620, 1.2], [700, 610, 1.4]],
  lamps: [[300, 440], [520, 440], [680, 440], [900, 440]],
  plaza: { x: 600, y: 460 },
  clouds: [[100, 60], [520, 90], [900, 40]],
};

const TALL: Layout = {
  w: 400,
  h: 1250,
  horizon: 176,
  place: {
    signlink: { x: 4, y: 186, k: 1.12, door: 80, sign: { x: 218, y: 250 } },
    guardian: { x: 214, y: 450, k: 1.12, door: 80, sign: { x: 14, y: 520 } },
    visionary: { x: 4, y: 720, k: 1.12, door: 51, sign: { x: 218, y: 790 } },
    baseline: { x: 214, y: 990, k: 1.12, door: 80, sign: { x: 14, y: 1060 } },
  },
  paths: [
    [186, 176, 28, 1074],
    [94, 354, 92, 22],
    [214, 618, 102, 22],
    [62, 888, 124, 22],
    [214, 1158, 102, 22],
  ],
  trees: [[340, 186, 1.1], [16, 470, 1.1], [350, 730, 1.1], [16, 1010, 1.1], [330, 360, 0.9], [40, 640, 0.9]],
  lamps: [[200, 330], [200, 860]],
  clouds: [[40, 40], [250, 80]],
};

const v = (name: string) => ({ fill: `var(--${name})` });

function Tree({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} aria-hidden>
      <rect x={8} y={26} width={6} height={18} style={v("trunk")} />
      <path d="M0 30h22v-10h-2v-8h-4v-6h-10v6h-4v8h-2z" style={v("leaf")} />
    </g>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 46})`} aria-hidden>
      <rect x={3} y={8} width={3} height={38} style={v("ink-2")} />
      <rect x={0} y={0} width={9} height={9} style={v("window")} />
    </g>
  );
}

function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g className="cp-cloud" aria-hidden>
      <path transform={`translate(${x} ${y})`} d="M8 8h8v-4h12v-4h12v4h8v4h8v8h-56v-4h8z" style={v("cloud")} opacity={0.9} />
    </g>
  );
}

function Signpost({ x, y }: { x: number; y: number }) {
  const arm = (dy: number, left: boolean, text: string) => (
    <g transform={`translate(0 ${dy})`}>
      <path d={left ? "M-100 0h94v18h-94l-8 -9z" : "M6 0h94l8 9l-8 9h-94z"} style={v("wall-1")} stroke="var(--ink-2)" strokeWidth={2} />
      <text x={left ? -52 : 52} y={13} textAnchor="middle" fontSize={8} className="font-pixel" style={v("ink")}>
        {text}
      </text>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden>
      <path d="M-70 -14h140v28h-140z" style={v("path-edge")} opacity={0.6} />
      <rect x={-3} y={-70} width={6} height={74} style={v("trunk")} />
      <g transform="translate(0 -70)">
        {arm(0, true, "ACCESS LAB")}
        {arm(0, false, "OBSERVATORY")}
        {arm(24, true, "WORKSHOP")}
        {arm(24, false, "LEDGER")}
      </g>
    </g>
  );
}

/** The campus as one designed environment; each building and its sign is a link to the project. */
export default function CampusMap({ layout }: { layout: "wide" | "tall" }) {
  const L = layout === "wide" ? WIDE : TALL;
  const signW = layout === "wide" ? 172 : 160;
  return (
    <svg
      viewBox={`0 0 ${L.w} ${L.h}`}
      shapeRendering="crispEdges"
      className="block h-auto w-full"
      role="group"
      aria-label="Campus map. Each building is a project; select one to open it."
    >
      {/* Sky and horizon */}
      <rect x={0} y={0} width={L.w} height={L.horizon} style={v("sky-1")} />
      <rect x={0} y={0} width={L.w} height={L.horizon * 0.42} style={v("sky-2")} />
      <circle cx={L.w - 90} cy={52} r={22} style={v("sun")} shapeRendering="auto" aria-hidden />
      {L.clouds.map(([x, y]) => (
        <Cloud key={`${x}-${y}`} x={x} y={y} />
      ))}
      <path
        d={`M0 ${L.horizon - 18} ${Array.from({ length: Math.ceil(L.w / 40) }, (_, i) => `h20v${i % 2 ? 8 : -8}h20v${i % 2 ? -8 : 8}`).join("")} V${L.horizon} H0z`}
        style={v("leaf")}
        opacity={0.55}
        aria-hidden
      />
      {/* Grass with a subtle mowing stripe */}
      <rect x={0} y={L.horizon} width={L.w} height={L.h - L.horizon} style={v("grass-1")} />
      {Array.from({ length: Math.ceil((L.h - L.horizon) / 48) }, (_, i) => (
        <rect key={i} x={0} y={L.horizon + i * 48} width={L.w} height={24} style={v("grass-2")} opacity={0.35} aria-hidden />
      ))}

      {/* Walkways */}
      {L.paths.map(([x, y, w, h], i) => (
        <g key={i} aria-hidden>
          <rect x={x} y={y} width={w} height={h} style={v("path")} />
          <rect x={x} y={y + h - 3} width={w} height={3} style={v("path-edge")} />
        </g>
      ))}
      {L.plaza && <Signpost x={L.plaza.x} y={L.plaza.y + 8} />}
      {L.lamps.map(([x, y]) => (
        <Lamp key={`${x}-${y}`} x={x} y={y} />
      ))}
      {L.trees.map(([x, y, k]) => (
        <Tree key={`${x}-${y}`} x={x} y={y} k={k} />
      ))}

      {/* Buildings with their signboards, each one link */}
      {PROJECT_ORDER.map((slug) => {
        const P = L.place[slug];
        const B = DRAW[slug];
        const p = featured[slug];
        const loc = LOCATIONS[slug];
        const bw = 160 * P.k;
        return (
          <a key={slug} href={`/work/${slug}`} aria-label={`${loc.name}: ${p.name}. ${p.outcome}`} className="cursor-pointer outline-none">
            <rect className="cp-ring" x={Math.min(P.x, P.sign.x) - 8} y={P.y - 8} width={Math.max(P.x + bw, P.sign.x + signW) - Math.min(P.x, P.sign.x) + 16} height={150 * P.k + 16} fill="none" stroke="var(--focus)" strokeWidth={4} opacity={0} />
            <g className="cp-building">
              <g transform={`translate(${P.x} ${P.y}) scale(${P.k})`}>
                <rect x={0} y={150} width={160} height={6} style={v("path-edge")} opacity={0.5} />
                <B />
              </g>
            </g>
            <g transform={`translate(${P.sign.x} ${P.sign.y})`}>
              <rect x={signW / 2 - 4} y={46} width={8} height={30} style={v("trunk")} />
              <rect x={0} y={0} width={signW} height={50} style={v("surface")} stroke="var(--ink)" strokeWidth={2.5} />
              <rect x={0} y={0} width={signW} height={6} style={v("accent")} />
              <text x={10} y={22} fontSize={9.5} className="font-pixel" style={v("accent")}>
                {loc.name.toUpperCase()}
              </text>
              <text x={10} y={41} fontSize={15} fontWeight={600} style={{ ...v("ink"), fontFamily: "var(--font-geist-sans)" }}>
                {p.name} →
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
