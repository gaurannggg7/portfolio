import type { ProjectSlug } from "@/content/types";

/**
 * Campus map and collision data. Pure data: no rendering or React.
 * Coordinates are in tiles; the map is W × H tiles of 16 × 16 px.
 */

export const TILE = 16;
export const W = 32;
export const H = 22;

export type Ground = "grass" | "path" | "water" | "tree" | "flowers" | "fence";

export type BuildingId = ProjectSlug | "career" | "kiosk";

export type Building = {
  id: BuildingId;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Door tile (inside the footprint, bottom row). */
  door: { x: number; y: number };
};

export const BUILDINGS: Building[] = [
  { id: "signlink", name: "Accessibility Lab", x: 3, y: 3, w: 5, h: 5, door: { x: 5, y: 7 } },
  { id: "career", name: "Career Office", x: 10, y: 4, w: 4, h: 4, door: { x: 11, y: 7 } },
  { id: "kiosk", name: "Contact Kiosk", x: 18, y: 6, w: 2, h: 2, door: { x: 18, y: 7 } },
  { id: "osint", name: "Records Archive", x: 24, y: 2, w: 5, h: 6, door: { x: 26, y: 7 } },
  { id: "bellwether", name: "Evaluation Lab", x: 19, y: 14, w: 4, h: 4, door: { x: 21, y: 17 } },
  { id: "visionary", name: "Hardware Workshop", x: 3, y: 13, w: 5, h: 4, door: { x: 5, y: 16 } },
  { id: "baseline", name: "Ledger Office", x: 24, y: 13, w: 5, h: 4, door: { x: 26, y: 16 } },
];

export type Dialogue = { speaker: string; lines: string[] };

export type Sign = { x: number; y: number; dialogue: Dialogue };

export type Npc = { id: string; x: number; y: number; look: number; dialogue: Dialogue };

export const SPAWN = { x: 14, y: 12, dir: "up" as const };

export const SIGNS: Sign[] = [
  {
    x: 14,
    y: 11,
    dialogue: {
      speaker: "Welcome sign",
      lines: [
        "Welcome to the engineering campus. Five buildings hold Gaurang's featured projects; the kiosk lists the rest.",
        "Walk with the arrow keys or WASD. Press E or Enter at a door, sign, or person. Esc closes a panel.",
        "Prefer a list? Use “All projects” above the map. Nothing here needs exploring to reach.",
      ],
    },
  },
  { x: 6, y: 8, dialogue: { speaker: "Sign", lines: ["ACCESSIBILITY LAB · SignLink. Speech or text in, sign-language clips out. The door is just to the left."] } },
  { x: 12, y: 8, dialogue: { speaker: "Sign", lines: ["CAREER OFFICE · Experience and résumé. The door is to the left."] } },
  { x: 27, y: 8, dialogue: { speaker: "Sign", lines: ["RECORDS ARCHIVE · Agentic OSINT Analyst. Public-record excerpts, cited and checkable. The door is to the left."] } },
  { x: 18, y: 17, dialogue: { speaker: "Sign", lines: ["EVALUATION LAB · Bellwether. Prompt versions are compared here before they ship. The door is three steps to the right."] } },
  { x: 6, y: 17, dialogue: { speaker: "Sign", lines: ["HARDWARE WORKSHOP · Visionary Hands. A glove that reads fingerspelled letters. The door is to the left."] } },
  { x: 27, y: 17, dialogue: { speaker: "Sign", lines: ["LEDGER OFFICE · Baseline. Transaction CSVs become financial briefs. The door is to the left."] } },
];

export const NPCS: Npc[] = [
  {
    id: "tech",
    x: 8,
    y: 10,
    look: 1,
    dialogue: {
      speaker: "Lab technician",
      lines: [
        "SignLink matches multi-word signs first, then single words, then strips suffixes like -ING.",
        "Anything left over is fingerspelled letter by letter, so no word is silently dropped.",
      ],
    },
  },
  {
    id: "analyst",
    x: 23,
    y: 10,
    look: 2,
    dialogue: {
      speaker: "Analyst",
      lines: [
        "The archive's reports are replays of four real runs, recorded in September 2026. They're labelled that way.",
        "A citation only shows the report points at an excerpt. Open the excerpt to judge whether it supports the claim.",
      ],
    },
  },
  {
    id: "tinkerer",
    x: 8,
    y: 17,
    look: 3,
    dialogue: {
      speaker: "Tinkerer",
      lines: [
        "The glove reads five flex sensors and an MPU6050 motion sensor.",
        "It picks the nearest of 26 letter templates, and only accepts a letter after five matching readings in a row.",
      ],
    },
  },
  {
    id: "evaluator",
    x: 17,
    y: 12,
    look: 2,
    dialogue: {
      speaker: "Evaluator",
      lines: [
        "In the lab's comparison, urgent recall stayed at 1.0 and every routing decision was the same.",
        "The replies still got worse: hard-gate failures went from 8 to 16 of 60, so the gate blocked prompt_v2. Synthetic scenarios, mock runs.",
      ],
    },
  },
  {
    id: "archivist",
    x: 23,
    y: 17,
    look: 4,
    dialogue: {
      speaker: "Archivist",
      lines: [
        "Baseline computes category totals and runway in pandas and Python, not with the model.",
        "Its evaluation took the structured-error pass rate from 62% to 100% on a 29-file adversarial corpus.",
      ],
    },
  },
];

/** Ground layer, built from rectangles so the layout is easy to read and edit. */
function buildGround(): Ground[][] {
  const g: Ground[][] = Array.from({ length: H }, () => Array.from({ length: W }, () => "grass" as Ground));
  const fill = (x: number, y: number, w: number, h: number, t: Ground) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j]?.[i] !== undefined) g[j][i] = t;
  };
  // Tree border
  fill(0, 0, W, 1, "tree");
  fill(0, H - 1, W, 1, "tree");
  fill(0, 0, 1, H, "tree");
  fill(W - 1, 0, 1, H, "tree");
  // Roads, connector, courtyard
  fill(1, 9, W - 2, 1, "path");
  fill(1, 18, W - 2, 1, "path");
  fill(15, 10, 2, 8, "path");
  fill(12, 10, 8, 4, "path");
  // Spurs from the roads to each door
  fill(5, 8, 1, 1, "path");
  fill(11, 8, 1, 1, "path");
  fill(18, 8, 1, 1, "path");
  fill(26, 8, 1, 1, "path");
  fill(5, 17, 1, 1, "path");
  fill(26, 17, 1, 1, "path");
  // Pond and flower beds
  fill(9, 14, 4, 3, "water");
  fill(17, 15, 2, 2, "flowers");
  fill(13, 19, 6, 1, "flowers");
  fill(1, 10, 2, 1, "flowers");
  // Tree clusters (kept off paths and doors)
  const trees: [number, number][] = [
    [1, 1], [2, 1], [1, 2], [9, 2], [16, 2], [17, 2], [21, 2], [22, 3], [29, 2], [30, 4],
    [21, 12], [23, 13], [29, 11], [30, 12], [1, 13], [1, 14], [9, 11], [20, 11], [21, 11],
    [2, 20], [3, 20], [9, 20], [22, 20], [28, 20], [29, 20], [11, 12], [29, 15], [19, 4],
  ];
  for (const [x, y] of trees) if (g[y][x] === "grass") g[y][x] = "tree";
  // Fence along the pond's south edge
  fill(9, 17, 4, 1, "fence");
  return g;
}

export const GROUND = buildGround();

/** Solid tiles: trees, water, fences, building footprints, signs, people, and the map edge. */
export function buildSolid(): boolean[][] {
  const s = GROUND.map((row) => row.map((t) => t === "tree" || t === "water" || t === "fence"));
  for (const b of BUILDINGS) for (let j = b.y; j < b.y + b.h; j++) for (let i = b.x; i < b.x + b.w; i++) s[j][i] = true;
  for (const sg of SIGNS) s[sg.y][sg.x] = true;
  for (const n of NPCS) s[n.y][n.x] = true;
  return s;
}

export type Interactable =
  | { kind: "door"; building: Building }
  | { kind: "sign"; sign: Sign }
  | { kind: "npc"; npc: Npc };

/** What occupies a tile, if anything can be interacted with there. */
export function interactableAt(x: number, y: number): Interactable | null {
  const b = BUILDINGS.find((bb) => bb.door.x === x && bb.door.y === y);
  if (b) return { kind: "door", building: b };
  const sign = SIGNS.find((sg) => sg.x === x && sg.y === y);
  if (sign) return { kind: "sign", sign };
  const npc = NPCS.find((n) => n.x === x && n.y === y);
  if (npc) return { kind: "npc", npc };
  return null;
}
