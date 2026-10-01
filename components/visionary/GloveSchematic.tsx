"use client";

type Part = "sensors" | "imu" | "board" | "match" | "stable" | "text" | "audio";

export const stageParts: Record<string, Part[]> = {
  sense: ["sensors", "imu"],
  calibrate: ["board"],
  match: ["match", "imu"],
  stabilize: ["stable"],
  output: ["text", "audio"],
};

const partStage: Record<Part, string> = {
  sensors: "sense",
  imu: "sense",
  board: "calibrate",
  match: "match",
  stable: "stabilize",
  text: "output",
  audio: "output",
};

const FINGERS = [
  { x: 24, y: 96, h: 74 },
  { x: 52, y: 66, h: 104 },
  { x: 80, y: 56, h: 114 },
  { x: 108, y: 70, h: 100 },
];

export default function GloveSchematic({ stage, onSelect }: { stage: string; onSelect: (id: string) => void }) {
  const lit = new Set(stageParts[stage] ?? []);
  const on = (p: Part) => lit.has(p);
  const stroke = (p: Part) => (on(p) ? "var(--visionary)" : "var(--ink-3)");
  const fill = (p: Part) => (on(p) ? "var(--visionary-soft)" : "var(--surface)");
  const pick = (p: Part) => () => onSelect(partStage[p]);

  const box = ({ part, y, title, sub, dashed }: { part: Part; y: number; title: string; sub: string; dashed?: boolean }) => (
    <g onClick={pick(part)} className="cursor-pointer">
      <rect
        x={330}
        y={y}
        width={136}
        height={46}
        style={{ fill: fill(part), stroke: stroke(part) }}
        strokeWidth={on(part) ? 2.5 : 1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={342} y={y + 20} fontSize={14} fontWeight={600} className="sch-title" style={{ fill: "var(--ink)" }}>
        {title}
      </text>
      <text x={342} y={y + 38} fontSize={11} className="sch-sub font-mono" style={{ fill: "var(--ink-2)" }}>
        {sub}
      </text>
    </g>
  );

  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-labelledby="glove-schematic-title glove-schematic-desc"
      className="block h-auto w-full"
    >
      <title id="glove-schematic-title">Schematic of the Visionary Hands glove</title>
      <desc id="glove-schematic-desc">
        Five flex sensors on the fingers and thumb and an MPU6050 motion sensor on the back of the hand connect to a
        microcontroller. Its readings are matched to a letter, checked for stability, and output as text. Audio output
        is drawn dashed because it isn&apos;t in the repository code.
      </desc>
      <defs>
        <marker id="vh-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8z" style={{ fill: "var(--ink-3)" }} />
        </marker>
      </defs>

      {/* Glove outline */}
      <g shapeRendering="crispEdges" style={{ fill: "var(--surface-2)", stroke: "var(--ink-3)" }} strokeWidth={1.5}>
        {FINGERS.map((f) => (
          <rect key={f.x} x={f.x} y={f.y} width={22} height={f.h + 4} />
        ))}
        <rect x={130} y={180} width={42} height={22} />
        <rect x={24} y={170} width={106} height={96} />
        <rect x={38} y={266} width={78} height={22} />
      </g>

      {/* Flex sensors */}
      <g onClick={pick("sensors")} className="cursor-pointer" shapeRendering="crispEdges">
        {FINGERS.map((f) => (
          <rect key={f.x} x={f.x + 8} y={f.y + 8} width={6} height={f.h + 14} style={{ fill: stroke("sensors") }} />
        ))}
        <rect x={138} y={188} width={30} height={6} style={{ fill: stroke("sensors") }} />
      </g>

      {/* MPU6050 */}
      <g onClick={pick("imu")} className="cursor-pointer">
        <rect x={56} y={206} width={40} height={40} style={{ fill: fill("imu"), stroke: stroke("imu") }} strokeWidth={on("imu") ? 2.5 : 1.5} shapeRendering="crispEdges" />
        <text x={76} y={231} textAnchor="middle" fontSize={11} className="font-mono" style={{ fill: "var(--ink)" }}>
          IMU
        </text>
      </g>

      {/* Signal bus to the board */}
      <g style={{ stroke: "var(--ink-3)" }} strokeWidth={1.5} fill="none">
        <path d="M130 228H170V160H196" />
        <path d="M130 236H178V172H196" />
        <path d="M130 244H186V184H196" />
      </g>
      <text x={150} y={262} fontSize={11} className="font-mono" style={{ fill: "var(--ink-3)" }}>
        5 analog + I²C
      </text>

      {/* Microcontroller */}
      <g onClick={pick("board")} className="cursor-pointer">
        <rect x={196} y={120} width={104} height={110} style={{ fill: fill("board"), stroke: stroke("board") }} strokeWidth={on("board") ? 2.5 : 1.5} shapeRendering="crispEdges" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={190} y={130 + i * 13} width={6} height={4} style={{ fill: "var(--ink-3)" }} />
        ))}
        <text x={248} y={168} textAnchor="middle" fontSize={15} fontWeight={600} style={{ fill: "var(--ink)" }}>
          MCU
        </text>
        <text x={248} y={186} textAnchor="middle" fontSize={11} className="sch-sub font-mono" style={{ fill: "var(--ink-2)" }}>
          reads sensors
        </text>
        <text x={248} y={202} textAnchor="middle" fontSize={11} className="sch-sub font-mono" style={{ fill: "var(--ink-2)" }}>
          calibrates
        </text>
      </g>

      {/* Processing and output chain */}
      <path d="M300 150H316V63H326" fill="none" style={{ stroke: "var(--ink-3)" }} strokeWidth={1.5} markerEnd="url(#vh-arrow)" />
      {box({ part: "match", y: 40, title: "Match letter", sub: "nearest template", })}
      <path d="M398 86V100" style={{ stroke: "var(--ink-3)" }} strokeWidth={1.5} markerEnd="url(#vh-arrow)" />
      {box({ part: "stable", y: 104, title: "Stability check", sub: "5 readings agree", })}
      <path d="M398 150V164" style={{ stroke: "var(--ink-3)" }} strokeWidth={1.5} markerEnd="url(#vh-arrow)" />
      {box({ part: "text", y: 168, title: "Text out", sub: "word over serial", })}
      <path d="M398 214V228" style={{ stroke: "var(--ink-3)" }} strokeWidth={1.5} strokeDasharray="3 3" markerEnd="url(#vh-arrow)" />
      {box({ part: "audio", y: 232, title: "Audio", sub: "not in repo code", dashed: true, })}

      {/* Callouts */}
      <g fontSize={11} className="font-mono" style={{ fill: "var(--ink-2)" }}>
        <text x={24} y={30}>flex sensors ×5</text>
        <path d="M60 36V60" style={{ stroke: "var(--ink-3)" }} strokeWidth={1} />
      </g>
    </svg>
  );
}
