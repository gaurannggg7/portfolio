"use client";

import type { ProjectSlug } from "@/content/types";
import { useActiveProject } from "./ActiveProject";
import { glyphPath, glyphs, projectColor } from "./PixelGlyph";

const SLUGS: ProjectSlug[] = ["signlink", "guardian", "visionary"];

const mix = (pct: number) => `color-mix(in srgb, var(--sky-top) ${pct}%, var(--sky-bottom))`;

function SkyBands({ width, height }: { width: number; height: number }) {
  const stops = [0, 0.2, 0.38, 0.54, 0.68];
  const shades = [100, 78, 56, 34, 12];
  return (
    <g>
      {stops.map((s, i) => (
        <rect
          key={s}
          x={0}
          y={Math.round(height * s)}
          width={width}
          height={Math.ceil(height * ((stops[i + 1] ?? 1) - s)) + 1}
          style={{ fill: mix(shades[i]) }}
        />
      ))}
    </g>
  );
}

const STARS: [number, number][] = [
  [14, 18], [38, 52], [62, 12], [88, 34], [118, 70], [132, 14], [176, 58], [204, 10],
  [228, 44], [282, 70], [300, 16], [24, 86], [70, 96], [262, 92], [306, 108], [110, 104],
];

function Stars({ scaleX = 1 }: { scaleX?: number }) {
  return (
    <g className="night" style={{ fill: "var(--sun)" }}>
      {STARS.map(([x, y], i) => (
        <rect key={i} x={x * scaleX} y={y} width={i % 3 === 0 ? 3 : 2} height={i % 3 === 0 ? 3 : 2} opacity={i % 2 ? 0.55 : 0.9} />
      ))}
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      className="day"
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M8 8h8v-4h12v-4h12v4h8v4h8v8h-56v-4h8z"
      style={{ fill: "var(--cloud)" }}
      opacity={0.92}
    />
  );
}

/**
 * The selected project's glyph: towed on a banner by the blimp during the day,
 * drawn as a constellation at night.
 */
function ProjectMarker({ x, y }: { x: number; y: number }) {
  const { active } = useActiveProject();
  return (
    <g>
      {/* Day: blimp towing a banner */}
      <g className="day">
        <g transform={`translate(${x} ${y})`}>
          <rect x={0} y={0} width={40} height={30} style={{ fill: "var(--surface)" }} />
          <rect x={0} y={0} width={40} height={30} fill="none" style={{ stroke: "var(--ink)" }} strokeWidth={2} />
          <path d="M40 15h14" style={{ stroke: "var(--ink)" }} strokeWidth={1} />
          {/* Blimp in ASU maroon and gold */}
          <g transform="translate(54 4)">
            <rect x={4} y={0} width={40} height={18} fill="#8c1d40" />
            <rect x={0} y={4} width={4} height={10} fill="#8c1d40" />
            <rect x={44} y={4} width={4} height={10} fill="#8c1d40" />
            <rect x={16} y={18} width={14} height={4} fill="#ffc627" />
            <rect x={10} y={6} width={26} height={2} fill="#ffc627" opacity={0.9} />
          </g>
        </g>
        {SLUGS.map((slug) => {
          const rows = glyphs[slug];
          const w = Math.max(...rows.map((r) => r.length));
          return (
            <path
              key={slug}
              d={glyphPath(rows, x + 20 - (w * 3) / 2, y + 15 - (rows.length * 3) / 2, 3)}
              style={{ fill: projectColor[slug], opacity: active === slug ? 1 : 0, transition: "opacity 500ms ease" }}
            />
          );
        })}
      </g>
      {/* Night: constellation */}
      <g className="night">
        {SLUGS.map((slug) => {
          const rows = glyphs[slug];
          const dots: [number, number][] = [];
          rows.forEach((row, ry) => [...row].forEach((c, rx) => c === "#" && dots.push([rx, ry])));
          return (
            <g key={slug} style={{ opacity: active === slug ? 1 : 0, transition: "opacity 600ms ease" }}>
              {dots.map(([dx, dy], i) => (
                <rect key={i} x={x + 4 + dx * 4} y={y - 2 + dy * 4} width={2} height={2} style={{ fill: projectColor[slug] }} />
              ))}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Mountain({ d }: { d: string }) {
  return <path d={d} style={{ fill: "var(--mountain)", stroke: "var(--mountain-edge)" }} strokeWidth={2} />;
}

/** The golden pixel "A" from the original scenery. */
function GoldA({ x, y, u = 4 }: { x: number; y: number; u?: number }) {
  return (
    <g style={{ fill: "var(--gold)" }}>
      <rect x={x + u} y={y} width={u * 3} height={u} />
      <rect x={x} y={y + u} width={u} height={u * 4} />
      <rect x={x + u * 4} y={y + u} width={u} height={u * 4} />
      <rect x={x + u} y={y + u * 2} width={u * 3} height={u} />
    </g>
  );
}

function SunMoon({ sun, moon }: { sun: [number, number]; moon: [number, number] }) {
  return (
    <>
      <path
        className="day"
        transform={`translate(${sun[0]} ${sun[1]})`}
        d="M6 0h12v3h3v3h3v12h-3v3h-3v3h-12v-3h-3v-3h-3v-12h3v-3h3z"
        style={{ fill: "var(--sun)" }}
      />
      <g className="night" transform={`translate(${moon[0]} ${moon[1]})`}>
        <path d="M5 0h10v3h3v3h2v10h-2v3h-3v3h-10v-3h-3v-3h-2v-10h2v-3h3z" style={{ fill: "var(--sun)" }} />
        <rect x={5} y={5} width={4} height={4} fill="#000" opacity={0.18} />
        <rect x={12} y={12} width={5} height={3} fill="#000" opacity={0.18} />
        <rect x={6} y={15} width={3} height={2} fill="#000" opacity={0.18} />
      </g>
    </>
  );
}

export function HeroScene() {
  const W = 320;
  const H = 200;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMax slice"
      className="scene block h-full w-full"
    >
      <SkyBands width={W} height={H} />
      <Stars />
      <SunMoon sun={[26, 20]} moon={[270, 18]} />
      <Cloud x={244} y={76} s={0.8} />
      <Cloud x={22} y={66} s={0.75} />
      {/* Satellite at night */}
      <g className="night" transform="translate(40 54)">
        <rect x={0} y={4} width={9} height={6} fill="#3b6fb6" />
        <rect x={17} y={4} width={9} height={6} fill="#3b6fb6" />
        <rect x={9} y={6} width={8} height={2} fill="#8a8f99" />
        <rect x={11} y={3} width={4} height={8} fill="#b9bdc6" />
        <rect x={12} y={0} width={2} height={3} fill="#e2554a" />
      </g>
      <ProjectMarker x={128} y={30} />
      <Mountain d="M0 200V172h20v-12h24v-12h24v-12h28v-16h24v-16h24V92h28v8h24v16h28v16h32v16h28v16h36v36z" />
      {/* Rocks */}
      <g>
        <rect x={56} y={160} width={6} height={4} style={{ fill: "var(--rock-1)" }} />
        <rect x={100} y={128} width={8} height={4} style={{ fill: "var(--rock-2)" }} />
        <rect x={204} y={124} width={6} height={4} style={{ fill: "var(--rock-1)" }} />
        <rect x={262} y={158} width={10} height={4} style={{ fill: "var(--rock-2)" }} />
        <rect x={180} y={108} width={4} height={4} style={{ fill: "var(--rock-2)" }} />
      </g>
      <GoldA x={124} y={110} u={3} />
      {/* Sparky, downsampled to a real sprite and drawn with nearest-neighbour scaling */}
      <image href="/sparky-sprite.png" x={150} y={66} width={23} height={27} className="pixelated" />
    </svg>
  );
}

const BUILDINGS: { x: number; w: number; h: number; tone: 1 | 2 | 3 }[] = [
  { x: 0, w: 44, h: 52, tone: 1 }, { x: 44, w: 36, h: 84, tone: 2 }, { x: 80, w: 52, h: 60, tone: 3 },
  { x: 132, w: 30, h: 96, tone: 1 }, { x: 162, w: 48, h: 70, tone: 2 }, { x: 210, w: 40, h: 46, tone: 3 },
  { x: 250, w: 34, h: 104, tone: 2 }, { x: 284, w: 56, h: 64, tone: 1 }, { x: 340, w: 40, h: 88, tone: 3 },
  { x: 380, w: 50, h: 56, tone: 2 }, { x: 430, w: 32, h: 98, tone: 1 }, { x: 462, w: 46, h: 72, tone: 3 },
  { x: 508, w: 38, h: 50, tone: 2 }, { x: 546, w: 44, h: 90, tone: 1 }, { x: 590, w: 50, h: 62, tone: 3 },
];

export function FooterScene() {
  const W = 1280;
  const H = 200;
  const blocks = [...BUILDINGS, ...BUILDINGS.map((b) => ({ ...b, x: b.x + 640 }))];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMax slice"
      className="scene block h-full w-full"
    >
      <SkyBands width={W} height={H} />
      <Stars scaleX={4} />
      <SunMoon sun={[1120, 24]} moon={[1124, 22]} />
      <Cloud x={160} y={34} s={0.9} />
      <Cloud x={880} y={52} s={0.8} />
      <ProjectMarker x={560} y={22} />
      {blocks.map((b, i) => (
        <g key={b.x}>
          <rect x={b.x} y={H - b.h} width={b.w} height={b.h} style={{ fill: `var(--city-${b.tone})` }} />
          {Array.from({ length: Math.floor((b.h - 16) / 14) }).flatMap((_, row) =>
            Array.from({ length: Math.floor((b.w - 8) / 12) }).map((__, col) =>
              (i * 7 + row * 3 + col * 5) % 4 === 0 ? (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 6 + col * 12}
                  y={H - b.h + 8 + row * 14}
                  width={5}
                  height={6}
                  style={{ fill: "var(--window)" }}
                  opacity={0.8}
                />
              ) : null,
            ),
          )}
        </g>
      ))}
      <Mountain d="M400 200v-18h40v-14h40v-14h36v-16h40v-14h64v10h40v14h40v14h40v14h60v24z" />
      <GoldA x={578} y={104} u={4} />
      <rect x={0} y={H - 4} width={W} height={4} style={{ fill: "var(--ground)" }} />
    </svg>
  );
}
