import { BUILDINGS, TILE, type BuildingId } from "./map";

/**
 * Original pixel art, drawn at native resolution into offscreen canvases.
 * Strict four-tone palette (0 = lightest … 3 = darkest), in the spirit of
 * early handheld RPGs. Nothing here is copied from an existing game.
 */

export type Palette = [string, string, string, string];

export const DAY: Palette = ["#e9f2d6", "#a3c47e", "#4f7d55", "#1e3328"];
export const NIGHT: Palette = ["#cdd6ea", "#7586ab", "#38476c", "#131a2c"];

export type Dir = "up" | "down" | "left" | "right";

/* ---------- Character bitmaps (16 × 16) ------------------------------------ */
// '.' transparent, 0–3 palette indices. Right-facing frames mirror the left ones.

const HEAD_FRONT = [
  "................",
  ".....333333.....",
  "....32222223....",
  "...3222222223...",
  "...3222222223...",
  "...3300000033...",
  "...3030000303...",
  "...3000000003...",
  "....30000003....",
];
const HEAD_BACK = [
  "................",
  ".....333333.....",
  "....32222223....",
  "...3222222223...",
  "...3222222223...",
  "...3222222223...",
  "...3222222223...",
  "...3322222233...",
  "....33222233....",
];
const BODY = [
  "...3311111133...",
  "..301111111103..",
  "..301111111103..",
  "...3311111133...",
];
const LEGS_STAND = ["....32222223....", "....32233223....", ".....33..33....."];
const LEGS_STEP = ["....32222223....", "...33223.3223...", "...333....333..."];

const SIDE = [
  "................",
  "......33333.....",
  ".....3222223....",
  "....322222223...",
  "....322222223...",
  "...30002222223..",
  "...30302222223..",
  "...30000222223..",
  "....300022223...",
  ".....3311133....",
  ".....3011113....",
  ".....3011113....",
  ".....3311133....",
];
const SIDE_STAND = [".....322223.....", ".....322223.....", ".....33.333....."];
const SIDE_STEP = [".....322223.....", "....3223.223....", "....333..333...."];

const mirror = (rows: string[]) => rows.map((r) => r.split("").reverse().join(""));
const fit = (rows: string[]) => rows.map((r) => r.padEnd(16, ".").slice(0, 16));

export const CHAR_FRAMES: Record<Dir, [string[], string[]]> = {
  down: [fit([...HEAD_FRONT, ...BODY, ...LEGS_STAND]), fit([...HEAD_FRONT, ...BODY, ...LEGS_STEP])],
  up: [fit([...HEAD_BACK, ...BODY, ...LEGS_STAND]), fit([...HEAD_BACK, ...BODY, ...LEGS_STEP])],
  left: [fit([...SIDE, ...SIDE_STAND]), fit([...SIDE, ...SIDE_STEP])],
  right: [mirror(fit([...SIDE, ...SIDE_STAND])), mirror(fit([...SIDE, ...SIDE_STEP]))],
};

/** Colour swaps that give each character a distinct look within the palette. */
export const LOOKS: Record<number, Record<string, string>> = {
  0: {}, // player: dark-outlined, mid hair, light shirt
  1: { "1": "2", "2": "1" }, // lab technician
  2: { "2": "3", "1": "1" }, // analyst
  3: { "1": "3", "2": "2" }, // tinkerer
  4: { "2": "0", "1": "2" }, // archivist
};

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return [c, ctx] as const;
}

function paintBitmap(ctx: CanvasRenderingContext2D, rows: string[], pal: Palette, ox = 0, oy = 0, swap: Record<string, string> = {}) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      ctx.fillStyle = pal[Number(swap[ch] ?? ch)];
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  });
}

/** Sheet with one row per look, columns: down×2, up×2, left×2, right×2. */
export function buildCharacterSheet(pal: Palette) {
  const dirs: Dir[] = ["down", "up", "left", "right"];
  const looks = Object.keys(LOOKS).map(Number);
  const [c, ctx] = makeCanvas(16 * 8, 16 * looks.length);
  looks.forEach((look, row) =>
    dirs.forEach((d, di) => CHAR_FRAMES[d].forEach((frame, fi) => paintBitmap(ctx, frame, pal, (di * 2 + fi) * 16, row * 16, LOOKS[look]))),
  );
  return c;
}

export const charFrameIndex = (dir: Dir, step: 0 | 1) => ({ down: 0, up: 2, left: 4, right: 6 })[dir] + step;

/* ---------- Tiles (16 × 16) ------------------------------------------------- */

export type TileKey = "grass" | "path" | "water0" | "water1" | "tree" | "flowers" | "fence" | "sign";
const TILE_ORDER: TileKey[] = ["grass", "path", "water0", "water1", "tree", "flowers", "fence", "sign"];

export function buildTileSheet(pal: Palette) {
  const [c, ctx] = makeCanvas(TILE * TILE_ORDER.length, TILE);
  const px = (x: number, y: number, i: number, ox: number) => {
    ctx.fillStyle = pal[i];
    ctx.fillRect(ox + x, y, 1, 1);
  };
  const rect = (x: number, y: number, w: number, h: number, i: number, ox: number) => {
    ctx.fillStyle = pal[i];
    ctx.fillRect(ox + x, y, w, h);
  };
  TILE_ORDER.forEach((key, k) => {
    const o = k * TILE;
    const grass = () => {
      rect(0, 0, 16, 16, 1, o);
      for (const [x, y] of [[2, 3], [3, 2], [10, 5], [11, 4], [6, 11], [7, 10], [13, 13], [14, 12]]) px(x, y, 2, o);
    };
    switch (key) {
      case "grass":
        grass();
        break;
      case "path":
        rect(0, 0, 16, 16, 0, o);
        for (const [x, y] of [[3, 4], [11, 2], [7, 9], [13, 12], [2, 13]]) px(x, y, 1, o);
        break;
      case "water0":
      case "water1": {
        rect(0, 0, 16, 16, 2, o);
        const sh = key === "water1" ? 4 : 0;
        for (const y of [3, 9, 14]) for (let x = 0; x < 16; x += 8) rect((x + sh + (y % 6)) % 16, y, 4, 1, 1, o);
        break;
      }
      case "tree":
        grass();
        rect(3, 1, 10, 2, 3, o);
        rect(2, 3, 12, 8, 3, o);
        rect(3, 2, 10, 9, 2, o);
        rect(4, 3, 4, 2, 1, o);
        rect(6, 11, 4, 4, 3, o);
        rect(7, 11, 2, 4, 2, o);
        break;
      case "flowers":
        grass();
        for (const [x, y] of [[3, 3], [11, 4], [6, 9], [13, 11], [2, 12], [9, 14]]) {
          px(x, y, 0, o);
          px(x - 1, y, 0, o);
          px(x + 1, y, 0, o);
          px(x, y - 1, 0, o);
          px(x, y + 1, 0, o);
          px(x, y, 3, o);
        }
        break;
      case "fence":
        grass();
        rect(0, 6, 16, 2, 3, o);
        rect(0, 10, 16, 2, 3, o);
        for (const x of [1, 7, 13]) rect(x, 4, 2, 10, 3, o);
        for (const x of [1, 7, 13]) rect(x, 4, 1, 9, 0, o);
        break;
      case "sign":
        grass();
        rect(7, 9, 2, 6, 3, o);
        rect(1, 2, 14, 8, 3, o);
        rect(2, 3, 12, 6, 0, o);
        for (const y of [4, 6]) rect(4, y, 8, 1, 2, o);
        break;
    }
  });
  return c;
}

export const tileIndex = (k: TileKey) => TILE_ORDER.indexOf(k);

/* ---------- Buildings -------------------------------------------------------- */

/** Each building is drawn once, at its footprint size, with a distinct silhouette. */
export function buildBuildingSprites(pal: Palette): Record<BuildingId, HTMLCanvasElement> {
  const out = {} as Record<BuildingId, HTMLCanvasElement>;
  for (const b of BUILDINGS) {
    const w = b.w * TILE;
    const h = b.h * TILE;
    const [c, ctx] = makeCanvas(w, h);
    const r = (x: number, y: number, ww: number, hh: number, i: number) => {
      ctx.fillStyle = pal[i];
      ctx.fillRect(x, y, ww, hh);
    };
    const doorX = (b.door.x - b.x) * TILE;
    const wall = (top: number) => {
      r(1, top, w - 2, h - top, 3);
      r(2, top + 1, w - 4, h - top - 1, 0);
      r(2, h - 3, w - 4, 2, 1); // plinth
    };
    const door = () => {
      r(doorX + 3, h - 14, 10, 14, 3);
      r(doorX + 4, h - 13, 8, 13, 2);
      r(doorX + 10, h - 7, 1, 2, 0);
      r(doorX + 2, h - 15, 12, 1, 3);
    };
    const windowAt = (x: number, y: number, ww = 10, hh = 8) => {
      r(x, y, ww, hh, 3);
      r(x + 1, y + 1, ww - 2, hh - 2, 1);
      r(x + 1, y + 1, 3, 2, 0);
    };

    switch (b.id) {
      case "signlink": {
        // Flat roof with a speech-bubble beacon: SignLink starts from speech.
        wall(30);
        r(0, 22, w, 9, 3);
        r(1, 23, w - 2, 7, 2);
        r(30, 2, 22, 13, 3);
        r(31, 3, 20, 11, 0);
        r(34, 15, 6, 4, 3);
        r(36, 18, 2, 4, 3);
        for (const x of [35, 40, 45]) r(x, 7, 3, 3, 3);
        for (const x of [8, 22, 54, 66]) windowAt(x, 38);
        for (const x of [8, 54, 66]) windowAt(x, 54);
        door();
        break;
      }
      case "career": {
        // Small peaked-roof office with a briefcase sign.
        wall(28);
        ctx.fillStyle = pal[3];
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(w / 2, 6);
        ctx.lineTo(w, 30);
        ctx.fill();
        ctx.fillStyle = pal[2];
        ctx.beginPath();
        ctx.moveTo(4, 28);
        ctx.lineTo(w / 2, 9);
        ctx.lineTo(w - 4, 28);
        ctx.fill();
        r(24, 34, 16, 10, 3);
        r(25, 35, 14, 8, 1);
        r(29, 32, 6, 3, 3);
        windowAt(46, 36, 12, 10);
        door();
        break;
      }
      case "kiosk": {
        // Booth with an antenna and a mail slot.
        r(4, 8, w - 8, h - 8, 3);
        r(5, 9, w - 10, h - 10, 0);
        r(2, 6, w - 4, 4, 3);
        r(15, 0, 2, 6, 3);
        r(13, 0, 6, 2, 2);
        r(9, 14, 14, 8, 3);
        r(10, 15, 12, 6, 1);
        r(11, 25, 10, 2, 3);
        break;
      }
      case "osint": {
        // Records archive: cornice, filing-drawer façade, magnifier over a page on the roof.
        wall(34);
        r(0, 28, w, 7, 3);
        r(1, 29, w - 2, 5, 2);
        r(24, 4, 22, 22, 3);
        r(25, 5, 20, 20, 0);
        for (const y of [9, 13, 17]) r(28, y, 12, 1, 2);
        ctx.fillStyle = pal[3];
        ctx.beginPath();
        ctx.arc(46, 18, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pal[1];
        ctx.beginPath();
        ctx.arc(46, 18, 4, 0, Math.PI * 2);
        ctx.fill();
        r(51, 23, 3, 3, 3);
        r(53, 25, 3, 3, 3);
        for (const x of [6, 19, 50, 63]) {
          for (const y of [42, 54, 66]) {
            r(x, y, 11, 9, 3);
            r(x + 1, y + 1, 9, 7, 1);
            r(x + 4, y + 4, 3, 1, 3);
          }
        }
        door();
        break;
      }
      case "bellwether": {
        // Evaluation lab: flat roof with plant box, gauge in the red, gate arm by the door.
        wall(22);
        r(0, 16, w, 7, 3);
        r(1, 17, w - 2, 5, 2);
        r(44, 5, 12, 11, 3);
        r(45, 6, 10, 9, 1);
        r(4, 26, 24, 18, 3);
        r(5, 27, 22, 16, 0);
        for (const [x, y] of [[8, 40], [9, 35], [13, 31], [19, 31], [23, 35]]) r(x, y, 2, 1, 2);
        for (let k = 0; k < 6; k++) r(16 + k, 40 - k, 1, 1, 3);
        r(15, 40, 3, 2, 3);
        windowAt(48, 28, 12, 10);
        r(48, h - 15, 2, 13, 3);
        r(50, h - 15, 14, 3, 3);
        r(51, h - 14, 12, 1, 0);
        for (const x of [54, 59]) r(x, h - 14, 2, 1, 3);
        door();
        break;
      }
      case "visionary": {
        // Workshop: sawtooth roof, chimney, roll-up door, chip sign.
        wall(24);
        r(62, 2, 8, 20, 3);
        r(63, 3, 6, 19, 1);
        for (let t = 0; t < 3; t++) {
          ctx.fillStyle = pal[3];
          ctx.beginPath();
          ctx.moveTo(1 + t * 26, 26);
          ctx.lineTo(1 + t * 26, 8);
          ctx.lineTo(27 + t * 26, 26);
          ctx.fill();
          ctx.fillStyle = pal[2];
          ctx.beginPath();
          ctx.moveTo(3 + t * 26, 25);
          ctx.lineTo(3 + t * 26, 12);
          ctx.lineTo(23 + t * 26, 25);
          ctx.fill();
        }
        r(6, 34, 20, 26, 3);
        for (let y = 36; y < 58; y += 4) r(7, y, 18, 2, 1);
        r(52, 32, 14, 14, 3);
        r(56, 36, 6, 6, 1);
        for (const y of [34, 39, 44]) {
          r(50, y, 2, 1, 3);
          r(66, y, 2, 1, 3);
        }
        door();
        break;
      }
      case "baseline": {
        // Ledger office: pediment, columns, bar-chart plaque.
        r(2, h - 6, w - 4, 6, 3);
        r(3, h - 5, w - 6, 4, 1);
        wall(26);
        ctx.fillStyle = pal[3];
        ctx.beginPath();
        ctx.moveTo(0, 28);
        ctx.lineTo(w / 2, 4);
        ctx.lineTo(w, 28);
        ctx.fill();
        ctx.fillStyle = pal[2];
        ctx.beginPath();
        ctx.moveTo(5, 26);
        ctx.lineTo(w / 2, 8);
        ctx.lineTo(w - 5, 26);
        ctx.fill();
        for (const x of [6, 18, 56, 68]) {
          r(x, 30, 6, h - 36, 3);
          r(x + 1, 30, 4, h - 36, 1);
        }
        r(28, 31, 24, 12, 3);
        r(29, 32, 22, 10, 0);
        r(32, 38, 3, 3, 3);
        r(38, 35, 3, 6, 3);
        r(44, 33, 3, 8, 3);
        door();
        break;
      }
    }
    out[b.id] = c;
  }
  return out;
}

/** Small "!" speech mark shown over whatever the player can interact with. */
export function buildCueSprite(pal: Palette) {
  const [c, ctx] = makeCanvas(12, 14);
  ctx.fillStyle = pal[3];
  ctx.fillRect(0, 0, 12, 11);
  ctx.fillRect(4, 11, 4, 2);
  ctx.fillStyle = pal[0];
  ctx.fillRect(1, 1, 10, 9);
  ctx.fillStyle = pal[3];
  ctx.fillRect(5, 2, 2, 5);
  ctx.fillRect(5, 8, 2, 1);
  return c;
}
