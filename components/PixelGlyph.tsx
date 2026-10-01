import type { ProjectSlug } from "@/content/types";

/** Small bitmaps, one character per pixel ("#" = filled). */
export const glyphs: Record<ProjectSlug | "mountain" | "sun", string[]> = {
  // Speech bubble: SignLink starts from spoken English.
  signlink: [
    ".#######.",
    "#.......#",
    "#.#.#.#.#",
    "#.......#",
    ".#######.",
    "..##.....",
    "..#......",
  ],
  // A small account network: GuardianAI.
  guardian: [
    "##.....##",
    "##.....##",
    "..#...#..",
    "...###...",
    "...###...",
    "..#...#..",
    "##.....##",
    "##.....##",
  ],
  // A gloved hand: Visionary Hands.
  visionary: [
    ".#.#.#.#..",
    ".#.#.#.#..",
    ".#######.#",
    ".#######.#",
    ".########.",
    "..######..",
    "..######..",
    "...####...",
  ],
  mountain: [
    "........",
    "...#....",
    "..###...",
    ".#####..",
    "########",
  ],
  sun: ["##", "##"],
};

export function glyphPath(rows: string[], ox = 0, oy = 0, size = 1): string {
  let d = "";
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") d += `M${ox + x * size} ${oy + y * size}h${size}v${size}h-${size}z`;
    }
  });
  return d;
}

const glyphSize = (rows: string[]) => ({ w: Math.max(...rows.map((r) => r.length)), h: rows.length });

export const projectColor: Record<ProjectSlug, string> = {
  signlink: "var(--signlink)",
  guardian: "var(--guardian)",
  visionary: "var(--visionary)",
};

export function ProjectGlyph({ slug, className = "h-5 w-auto" }: { slug: ProjectSlug; className?: string }) {
  const rows = glyphs[slug];
  const { w, h } = glyphSize(rows);
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ fill: projectColor[slug] }}
    >
      <path d={glyphPath(rows)} />
    </svg>
  );
}

/** Site mark: the desert mountain with the sun above it. */
export function PixelMark() {
  return (
    <svg aria-hidden viewBox="0 0 10 7" shapeRendering="crispEdges" className="h-[18px] w-auto">
      <path d={glyphPath(glyphs.mountain, 0, 2)} style={{ fill: "var(--accent)" }} />
      <path d={glyphPath(glyphs.sun, 7, 0)} style={{ fill: "var(--gold)" }} />
    </svg>
  );
}
