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

function BaselineArt({ animate }: { animate: boolean }) {
  const carts = [
    { x: 126, llm: true, label: "CAT" },
    { x: 152, llm: true, label: "ANOM" },
    { x: 178, llm: false, label: "RUN" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden>
      <ellipse cx="160" cy="205" rx="150" ry="10" fill="#000" opacity="0.12" />
      {/* Fan-out / fan-in paths */}
      {carts.map((c, i) => (
        <g key={c.x}>
          <path d={`M78 170 C 100 120, ${c.x} 110, ${c.x + 10} 104`} fill="none" stroke={animate ? ACCENT : "#9aa0aa"} strokeWidth="2" strokeDasharray="4 4" className={animate ? "wb-flow" : undefined} style={{ animationDelay: `${i * 0.1}s` }} />
          <path d={`M${c.x + 10} 104 C ${c.x + 40} 110, 236 120, 248 168`} fill="none" stroke={animate ? ACCENT : "#9aa0aa"} strokeWidth="2" strokeDasharray="4 4" className={animate ? "wb-flow" : undefined} style={{ animationDelay: `${0.6 + i * 0.1}s` }} />
        </g>
      ))}
      {/* Ledger */}
      {[3, 2, 1, 0].map((i) => (
        <rect key={i} x={30 + i * 3} y={160 - i * 3} width="62" height="34" rx="2" transform="skewX(-25)" fill={i ? "#e9e5da" : "#fbfaf6"} stroke="#d2ccbd" />
      ))}
      <text x="18" y="182" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)" transform="skewX(-25)">ledger.csv</text>
      {/* Processor */}
      <rect x="112" y="146" width="106" height="44" rx="6" fill="#2a2d34" />
      {carts.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y="98" width="22" height="52" rx="2" fill={c.llm ? "#2f56e0" : "#3b3f48"} />
          <text x={c.x + 11} y="126" textAnchor="middle" fontSize="5.5" fill="#fff" fontFamily="var(--font-geist-mono)">{c.label}</text>
          <circle cx={c.x + 11} cy="106" r="2" fill={animate ? "#9fffc8" : "#5d6270"} />
        </g>
      ))}
      {/* Brief */}
      <rect x="228" y="176" width="70" height="16" rx="3" fill="#3a3d44" />
      <rect x="238" y="152" width="50" height="30" rx="1" transform="skewX(-20)" fill="#fbfaf6" stroke="#d2ccbd" />
      <text x="290" y="171" fontSize="7" fill={INK} fontFamily="var(--font-geist-mono)" transform="skewX(-20)">BRIEF</text>
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
  if (slug === "baseline") return <BaselineArt animate={animate} />;
  return <GuardianArt animate={animate} />;
}
