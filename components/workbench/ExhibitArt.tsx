import { accounts, transfers } from "@/content/guardian-graph";
import type { ProjectSlug } from "@/content/types";

/**
 * Flat, lit SVG illustrations of each exhibit, used for the static bench,
 * the loading poster, and the mobile layout. Light comes from the upper left.
 */

const INK = "#1d2026";
const STEEL = "#3a3f48";
const STEEL_LIGHT = "#5a606b";
const ACCENT = "var(--accent)";

function SignLinkArt({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="#000" opacity="0.12" />
      {/* Cable path with optional signal */}
      <path d="M58 196 C 80 206, 110 206, 128 190 M168 190 C 190 200, 214 200, 232 196" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {animate && (
        <path className="wb-signal" d="M58 70 L58 196 C 80 206, 110 206, 128 190 L148 150 L168 190 C 190 200, 214 200, 232 196 L232 120" fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" />
      )}
      {/* Microphone */}
      <rect x="36" y="192" width="44" height="8" rx="3" fill={STEEL} />
      <rect x="55" y="104" width="6" height="90" fill="#9aa0aa" />
      <rect x="47" y="78" width="22" height="34" rx="6" fill={STEEL} />
      <circle cx="58" cy="66" r="18" fill="#2a2d33" />
      <circle cx="58" cy="66" r="18" fill="url(#mesh)" />
      <defs>
        <pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="none" />
          <path d="M0 0L5 5M5 0L0 5" stroke="#6b717c" strokeWidth="0.8" />
        </pattern>
      </defs>
      {/* Transcript display */}
      <g transform="translate(108 132) skewY(-6)">
        <rect width="82" height="56" rx="5" fill="#1c1f26" />
        <rect x="5" y="5" width="72" height="46" rx="2" fill="#0e1424" />
        <text x="10" y="18" fontSize="6" fill="#7f9cff" fontFamily="var(--font-geist-mono)">TRANSCRIPT</text>
        <text x="8" y="28" fontSize="6.6" fill="#e9edf8" fontFamily="var(--font-geist-sans)">“Please come here”</text>
        <text x="10" y="40" fontSize="6" fill="#7f9cff" fontFamily="var(--font-geist-mono)">GLOSS</text>
        <text x="8" y="48" fontSize="5.8" fill="#e9edf8" fontFamily="var(--font-geist-mono)">PLEASE COME HERE</text>
      </g>
      {/* Monitor */}
      <rect x="214" y="190" width="40" height="8" rx="2" fill={STEEL} />
      <rect x="230" y="150" width="8" height="42" fill={STEEL} />
      <rect x="178" y="66" width="114" height="88" rx="6" fill="#17191e" />
      <rect x="184" y="72" width="102" height="74" rx="2" fill="#11141b" />
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${188 + i * 50} 78)`}>
          <rect width="44" height="52" fill="#1d2433" />
          <circle cx="22" cy="18" r="7" fill="#3b4a6b" />
          <rect x="11" y="27" width="22" height="25" fill="#3b4a6b" />
          <circle cx={i ? 9 : 35} cy="31" r="4" fill="#7f9cff" />
          <text x="2" y="60" fontSize="5.5" fill="#e9edf8" fontFamily="var(--font-geist-mono)">{i ? "COME HERE" : "PLEASE"}</text>
        </g>
      ))}
    </svg>
  );
}

function GloveArt({ part }: { part: string | null }) {
  const lit = (id: string) => (part === id ? ACCENT : STEEL);
  const fingers = [
    { x: 76, h: 74 },
    { x: 100, h: 92 },
    { x: 124, h: 96 },
    { x: 148, h: 82 },
  ];
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="140" ry="10" fill="#000" opacity="0.12" />
      <ellipse cx="128" cy="196" rx="86" ry="12" fill="#2d3037" />
      {/* Glove */}
      {fingers.map((f) => (
        <g key={f.x}>
          <rect x={f.x} y={128 - f.h} width="22" height={f.h + 20} rx="11" fill="#ece7dc" stroke="#cfc8b8" />
          <rect x={f.x + 8} y={136 - f.h} width="6" height={f.h - 4} rx="2" fill={lit("flex")} />
        </g>
      ))}
      <path d="M70 120 h108 v46 q0 22 -22 22 h-64 q-22 0 -22 -22z" fill="#ece7dc" stroke="#cfc8b8" />
      <rect x="168" y="118" width="58" height="22" rx="11" transform="rotate(-28 168 128)" fill="#ece7dc" stroke="#cfc8b8" />
      <rect x="176" y="114" width="40" height="6" rx="2" transform="rotate(-28 168 128)" fill={lit("flex")} />
      <rect x="106" y="140" width="34" height="26" rx="3" fill={part === "imu" ? ACCENT : "#1f5e3a"} />
      <text x="123" y="157" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="var(--font-geist-mono)">IMU</text>
      {/* Ribbon and MCU */}
      <path d="M140 172 C 180 196, 214 196, 236 180" fill="none" stroke={STEEL_LIGHT} strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(226 150) skewX(-10)">
        <rect width="78" height="44" rx="3" fill={part === "mcu" ? ACCENT : "#1e5a37"} />
        <rect x="26" y="12" width="26" height="20" fill="#14161a" />
        {[6, 16, 56, 66].map((x) => (
          <rect key={x} x={x} y="4" width="6" height="6" fill="#c9a227" />
        ))}
      </g>
    </svg>
  );
}

function BaselineArt({ animate, part }: { animate: boolean; part: string | null }) {
  const bars: [string, number][] = [["COGS", 0.82], ["OpEx", 0.58], ["S&M", 0.41], ["R&D", 0.3]];
  const hot = (id: string) => part === id;
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="#000" opacity="0.12" />
      {/* Ledger stack */}
      {[3, 2, 1, 0].map((i) => (
        <rect key={i} x={78 + i * 3} y={168 - i * 3} width="50" height="30" rx="2" transform="skewX(-22)" fill={i ? "#e9e5da" : "#fbfaf6"} stroke={hot("ledger") && !i ? "var(--accent)" : "#d2ccbd"} strokeWidth={hot("ledger") && !i ? 2.5 : 1} />
      ))}
      <text x="94" y="188" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)" transform="skewX(-22)">ledger.csv</text>
      {/* Terminal: deep housing, angled screen */}
      <path d="M92 64 h150 l10 112 h-170z" fill="#2a2d34" />
      <rect x="100" y="70" width="134" height="92" rx="4" fill="#0d1410" />
      <text x="108" y="84" fontSize="6.4" fill="#86e0a8" fontFamily="var(--font-geist-mono)">$ baseline analyze ledger.csv</text>
      <text x="108" y="95" fontSize="5" fill={hot("llm") || hot("python") ? "#d6ffe6" : "#4f8f69"} fontFamily="var(--font-geist-mono)">categorize ∥ anomalies ∥ runway(py)</text>
      {bars.map(([k, v], i) => (
        <g key={k}>
          <text x="108" y={110 + i * 12} fontSize="5.5" fill="#86e0a8" fontFamily="var(--font-geist-mono)">{k}</text>
          <rect x="132" y={104 + i * 12} width={92 * v} height="7" fill="#2f6a48" className={animate ? "wb-grow" : undefined} style={{ transformOrigin: "132px 0", animationDelay: `${i * 0.12}s` }} />
        </g>
      ))}
      <rect x="82" y="176" width="172" height="8" rx="2" fill="#3a3d44" />
      {/* Keyboard */}
      <path d="M104 188 h128 l8 12 h-144z" fill="#3a3f48" />
      {[0, 1, 2].map((r) => (
        <rect key={r} x={108 - r * 2} y={190 + r * 3.2} width={120 + r * 4} height="2" fill="#5a606b" />
      ))}
      {/* Brief in the tray */}
      <rect x="258" y="182" width="52" height="12" rx="2" fill="#3a3d44" />
      <rect x="264" y="160" width="40" height="26" rx="1" transform="skewX(-16)" fill="#fbfaf6" stroke={hot("brief") ? "var(--accent)" : "#d2ccbd"} strokeWidth={hot("brief") ? 2.5 : 1} />
      <text x="314" y="176" fontSize="6.5" fill={INK} fontFamily="var(--font-geist-mono)" transform="skewX(-16)">BRIEF</text>
    </svg>
  );
}

/** Two dials and a gate lamp; animate switches from prompt_v1's readings to prompt_v2's. */
function BellwetherArt({ animate, part }: { animate: boolean; part: string | null }) {
  const angle = (v: number) => 120 - 240 * v; // degrees from straight up
  const needle = (cx: number, v: number) => (
    <line
      x1={cx}
      y1={118}
      x2={cx}
      y2={78}
      stroke={INK}
      strokeWidth="3"
      strokeLinecap="round"
      style={{ transform: `rotate(${-angle(v)}deg)`, transformOrigin: `${cx}px 118px`, transition: "transform 1.2s cubic-bezier(.3,.7,.2,1) .4s" }}
    />
  );
  const dial = (cx: number, label: string, id: string) => (
    <g>
      <circle cx={cx} cy="118" r="46" fill="#fbfaf6" stroke={part === id ? "var(--accent)" : INK} strokeWidth={part === id ? 4 : 3} />
      {Array.from({ length: 11 }, (_, i) => {
        const a = ((210 - i * 24) * Math.PI) / 180;
        const r1 = i % 5 ? 37 : 32;
        return <line key={i} x1={r2(cx + Math.cos(a) * r1)} y1={r2(118 - Math.sin(a) * r1)} x2={r2(cx + Math.cos(a) * 41)} y2={r2(118 - Math.sin(a) * 41)} stroke={INK} strokeWidth={i % 5 ? 1.2 : 2} />;
      })}
      <path d={arc(cx, 118, 39, 0.7, 0.9)} fill="none" stroke="#c0392b" strokeWidth="4" />
      <text x={cx} y="150" textAnchor="middle" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)">{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="#000" opacity="0.12" />
      {/* Strip-chart roll on top */}
      <rect x="196" y="38" width="70" height="16" rx="8" fill="#d8d3c6" stroke="#b9b2a2" />
      <path d="M206 54 v-30 h50 v30" fill="#fbfaf6" stroke="#d2ccbd" />
      <path d="M210 44 l8 -4 l8 2 l8 -6 l8 10 l8 -2" fill="none" stroke={animate ? "#c0392b" : "#5f646c"} strokeWidth="1.6" />
      {/* Housing with a sloped face */}
      <path d="M24 66 h272 l8 128 h-288z" fill="#2a2d34" />
      <rect x="32" y="62" width="256" height="122" rx="6" fill="#e9e6dd" />
      {dial(86, "URGENT RECALL", "recall")}
      {dial(186, "SAFETY", "safety")}
      {needle(86, 1)}
      {needle(186, animate ? 0.825 : 0.977)}
      <circle cx="86" cy="118" r="4" fill={INK} />
      <circle cx="186" cy="118" r="4" fill={INK} />
      {/* Gate lamp */}
      <text x="258" y="88" textAnchor="middle" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)">GATE</text>
      <circle cx="258" cy="112" r="15" fill={animate ? "#d8412f" : "#8a8f98"} stroke={part === "gate" ? "var(--accent)" : INK} strokeWidth={part === "gate" ? 4 : 2.5} style={{ transition: "fill .3s 1.6s" }} />
      <text x="258" y="146" textAnchor="middle" fontSize="6.5" fill={INK} fontFamily="var(--font-geist-mono)">{animate ? "BLOCKED" : "prompt_v1"}</text>
      <text x="258" y="166" textAnchor="middle" fontSize="5.5" fill="#5f646c" fontFamily="var(--font-geist-mono)">mock · synthetic</text>
    </svg>
  );
}

/** Round to 2 dp so server and client render identical SVG attributes. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function arc(cx: number, cy: number, r: number, v0: number, v1: number) {
  const pt = (v: number) => {
    const a = ((210 - 240 * v) * Math.PI) / 180;
    return `${r2(cx + Math.cos(a) * r)} ${r2(cy - Math.sin(a) * r)}`;
  };
  return `M${pt(v0)} A${r} ${r} 0 0 1 ${pt(v1)}`;
}

/** Open dossier with a report page, an excerpt page, a card file, and a magnifier. */
function OsintArt({ animate, part }: { animate: boolean; part: string | null }) {
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="#000" opacity="0.12" />
      {/* Card file */}
      <rect x="230" y="90" width="66" height="52" rx="3" fill="#3a3f48" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={236 + i * 3} y={70 + i * 5} width="54" height="34" rx="2" fill={part === "excerpts" && i === 3 ? "#e3ebff" : "#fbfaf6"} stroke="#d2ccbd" />
          <rect x={244 + i * 10} y={66 + i * 5} width="12" height="6" rx="1" fill={i === 1 ? "var(--accent)" : "#d2ccbd"} />
        </g>
      ))}
      {/* Folder */}
      <path d="M14 150 l20 -84 h120 l6 8 h110 l-20 116 h-236z" fill="#c8a76a" />
      <path d="M30 186 l14 -100 h112 l-14 100z" fill={part === "report" ? "#eef2ff" : "#fbfaf6"} stroke="#d2ccbd" />
      <path d="M142 186 l14 -100 h106 l-14 100z" fill="#fbfaf6" stroke="#d2ccbd" />
      <text x="54" y="100" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)">REPORT</text>
      <text x="54" y="109" fontSize="4.6" fill="#8a6d1f" fontFamily="var(--font-geist-mono)">PRERECORDED</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line x1={50 - i * 1.4} y1={120 + i * 10} x2={120 - i * 1.4 + (i % 2) * 8} y2={120 + i * 10} stroke="#c9cfdb" strokeWidth="2" />
          {i % 2 === 1 && (
            <text x={124 - i * 1.4 + 8} y={122 + i * 10} fontSize="6" fill={i === 3 ? "var(--accent)" : "#5f646c"} fontFamily="var(--font-geist-mono)">[{i === 3 ? 2 : i}]</text>
          )}
        </g>
      ))}
      <text x="166" y="100" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)">EXCERPT [2]</text>
      <rect x="160" y="124" width="84" height="9" fill="#fff1b8" transform="skewX(-8)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={162 - i * 1.4} y1={116 + i * 12} x2={236 - i * 1.4} y2={116 + i * 12} stroke="#c9cfdb" strokeWidth="2" />
      ))}
      {/* Magnifier: rests on the citation, then moves to the excerpt */}
      <g style={{ transform: animate ? "translate(64px, -20px)" : "translate(0, 0)", transition: "transform 1.2s cubic-bezier(.3,.7,.2,1) .3s" }}>
        <circle cx="132" cy="152" r="18" fill="#dfe8ff" fillOpacity="0.35" stroke={part === "lens" ? "var(--accent)" : INK} strokeWidth="4" />
        <rect x="144" y="166" width="8" height="30" rx="3" transform="rotate(-40 148 170)" fill={INK} />
      </g>
    </svg>
  );
}

function GuardianArt({ animate }: { animate: boolean }) {
  const map = (x: number, y: number) => [30 + ((x - 60) / 560) * 260, 26 + ((y - 40) / 340) * 150] as const;
  const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <rect x="10" y="8" width="300" height="196" rx="4" fill="#5a3c24" />
      <rect x="18" y="16" width="284" height="180" fill="#c29464" />
      {transfers.map((t, i) => {
        const [x1, y1] = map(byId[t.from].x, byId[t.from].y);
        const [x2, y2] = map(byId[t.to].x, byId[t.to].y);
        return (
          <line
            key={t.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={t.inPattern ? (animate ? "#e0453a" : "#9a3b33") : "#7d7466"}
            strokeWidth={t.inPattern ? 2 : 1.2}
            className={animate && t.inPattern ? "wb-string" : undefined}
            style={animate && t.inPattern ? { animationDelay: `${(t.from === "S1" ? 0 : 0.8) + (i % 5) * 0.08}s` } : undefined}
          />
        );
      })}
      {accounts.map((a) => {
        const [x, y] = map(a.x, a.y);
        return (
          <g key={a.id} transform={`translate(${x - 15} ${y - 10})`}>
            <rect width="30" height="20" fill="#fbf8ef" />
            <rect width="30" height="3" fill={a.inPattern ? "#c0392b" : "#9aa3b2"} />
            <text x="15" y="15" textAnchor="middle" fontSize="8" fill={INK} fontFamily="var(--font-geist-mono)">{a.label}</text>
            <circle cx="15" cy="-1" r="2.5" fill="#c0392b" />
          </g>
        );
      })}
    </svg>
  );
}

export default function ExhibitArt({ slug, part = null, animate = false }: { slug: ProjectSlug; part?: string | null; animate?: boolean }) {
  if (slug === "signlink") return <SignLinkArt animate={animate} />;
  if (slug === "visionary") return <GloveArt part={part} />;
  if (slug === "baseline") return <BaselineArt animate={animate} part={part} />;
  if (slug === "bellwether") return <BellwetherArt animate={animate} part={part} />;
  if (slug === "osint") return <OsintArt animate={animate} part={part} />;
  return <GuardianArt animate={animate} />;
}
