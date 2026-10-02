import { BUILDINGS, GROUND, H, NPCS, SIGNS, TILE, W, type BuildingId } from "./map";
import type { CampusEngine } from "./engine";
import { LOOKS, buildBuildingSprites, buildCharacterSheet, buildCueSprite, buildTileSheet, charFrameIndex, tileIndex, type Palette } from "./sprites";

/**
 * Canvas 2D renderer. Draws at an integer device-pixel scale with smoothing
 * off, so pixels stay square and crisp on any screen density.
 */

export type Atlas = {
  tiles: HTMLCanvasElement;
  chars: HTMLCanvasElement;
  buildings: Record<BuildingId, HTMLCanvasElement>;
  cue: HTMLCanvasElement;
};

export function buildAtlas(pal: Palette): Atlas {
  return { tiles: buildTileSheet(pal), chars: buildCharacterSheet(pal), buildings: buildBuildingSprites(pal), cue: buildCueSprite(pal) };
}

export type Camera = { x: number; y: number; scale: number };

/** Camera centred on the player and clamped to the map, in native pixels. */
export function computeCamera(engine: CampusEngine, viewW: number, viewH: number, scale: number): Camera {
  const pos = engine.position;
  const vw = viewW / scale;
  const vh = viewH / scale;
  const mapW = W * TILE;
  const mapH = H * TILE;
  const cx = pos.x * TILE + TILE / 2 - vw / 2;
  const cy = pos.y * TILE + TILE / 2 - vh / 2;
  const x = mapW <= vw ? (mapW - vw) / 2 : Math.min(Math.max(cx, 0), mapW - vw);
  const y = mapH <= vh ? (mapH - vh) / 2 : Math.min(Math.max(cy, 0), mapH - vh);
  // Snap to whole native pixels so sprites never straddle device pixels.
  return { x: Math.round(x), y: Math.round(y), scale };
}

const LOOK_ROWS = Object.keys(LOOKS).map(Number);

export function drawFrame(ctx: CanvasRenderingContext2D, atlas: Atlas, engine: CampusEngine, cam: Camera, opts: { time: number; animate: boolean; bg: string }) {
  const { scale: s } = cam;
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = opts.bg;
  ctx.fillRect(0, 0, cw, ch);

  const sx = (x: number) => Math.round((x - cam.x) * s);
  const sy = (y: number) => Math.round((y - cam.y) * s);
  const T = TILE * s;

  // Ground
  const x0 = Math.max(0, Math.floor(cam.x / TILE));
  const y0 = Math.max(0, Math.floor(cam.y / TILE));
  const x1 = Math.min(W - 1, Math.ceil((cam.x + cw / s) / TILE));
  const y1 = Math.min(H - 1, Math.ceil((cam.y + ch / s) / TILE));
  const waterFrame = opts.animate && Math.floor(opts.time / 0.7) % 2 ? "water1" : "water0";
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const g = GROUND[y][x];
      const key = g === "water" ? waterFrame : g;
      ctx.drawImage(atlas.tiles, tileIndex(key) * TILE, 0, TILE, TILE, sx(x * TILE), sy(y * TILE), T, T);
    }
  }
  for (const sg of SIGNS) ctx.drawImage(atlas.tiles, tileIndex("sign") * TILE, 0, TILE, TILE, sx(sg.x * TILE), sy(sg.y * TILE), T, T);

  // Depth-sorted sprites: buildings by their base row, characters by their row.
  type Item = { z: number; draw: () => void };
  const items: Item[] = [];
  for (const b of BUILDINGS) {
    items.push({
      z: b.y + b.h - 0.5,
      draw: () => ctx.drawImage(atlas.buildings[b.id], sx(b.x * TILE), sy(b.y * TILE), b.w * T, b.h * T),
    });
  }
  const drawChar = (look: number, dir: Parameters<typeof charFrameIndex>[0], step: 0 | 1, x: number, y: number, mirror = false) => {
    const row = LOOK_ROWS.indexOf(look);
    const col = charFrameIndex(dir, step);
    const dx = sx(x * TILE);
    const dy = sy(y * TILE - 3); // characters stand slightly into the tile above
    if (mirror) {
      ctx.save();
      ctx.translate(dx + T, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(atlas.chars, col * TILE, row * TILE, TILE, TILE, 0, 0, T, T);
      ctx.restore();
    } else ctx.drawImage(atlas.chars, col * TILE, row * TILE, TILE, TILE, dx, dy, T, T);
  };
  for (const n of NPCS) items.push({ z: n.y, draw: () => drawChar(n.look, engine.npcDirs[n.id], 0, n.x, n.y) });
  const pos = engine.position;
  const bob = engine.walkFrame ? 1 / TILE : 0;
  items.push({ z: pos.y + 0.01, draw: () => drawChar(0, engine.player.dir, engine.walkFrame, pos.x, pos.y - bob, engine.mirrorStep) });
  items.sort((a, b) => a.z - b.z).forEach((i) => i.draw());

  // Interaction cue over the target
  const target = engine.paused ? null : engine.facing();
  if (target) {
    const at = target.kind === "door" ? target.building.door : target.kind === "sign" ? target.sign : target.npc;
    const lift = opts.animate ? Math.round(Math.sin(opts.time * 6) * 1.5) : 0;
    ctx.drawImage(atlas.cue, sx(at.x * TILE + 2), sy(at.y * TILE - 15 + lift), 12 * s, 14 * s);
  }
}

/** Screen position (CSS px) of a tile point, for DOM labels. */
export function toScreen(cam: Camera, tx: number, ty: number, dpr: number) {
  return { x: ((tx * TILE - cam.x) * cam.scale) / dpr, y: ((ty * TILE - cam.y) * cam.scale) / dpr };
}
