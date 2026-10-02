import { H, NPCS, SPAWN, W, buildSolid, interactableAt, type Interactable } from "./map";
import type { Dir } from "./sprites";

/**
 * Movement and interaction logic, independent of rendering and React.
 * Movement is tile-to-tile: collision is checked before each step, so a long
 * frame can never carry the player through a wall.
 */

const STEP_SECONDS = 0.2; // time to walk one tile
const TURN_SECONDS = 0.08; // a short tap turns in place before walking
const MAX_DT = 0.1;

export const DELTA: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

export type Actor = { x: number; y: number; dir: Dir };

export class CampusEngine {
  solid = buildSolid();
  player = { x: SPAWN.x, y: SPAWN.y, dir: SPAWN.dir as Dir, fromX: SPAWN.x, fromY: SPAWN.y, t: 1, moving: false, stepParity: 0 as 0 | 1, turnHeld: 0 };
  npcDirs: Record<string, Dir> = Object.fromEntries(NPCS.map((n) => [n.id, "down" as Dir]));
  paused = false;
  /** Held directions, most recent last; the last one wins. */
  private held: Dir[] = [];
  /** A tap in the facing direction: one step, even if released before TURN_SECONDS. */
  private queued: Dir | null = null;

  press(dir: Dir) {
    this.held = this.held.filter((d) => d !== dir);
    this.held.push(dir);
    // Turn on key-down so a quick tap (released before the next frame) still faces that way.
    const p = this.player;
    if (this.paused) return;
    if (!p.moving && p.dir !== dir) {
      p.dir = dir;
      p.turnHeld = 0;
    } else if (p.dir === dir) {
      this.queued = dir;
    }
  }

  release(dir: Dir) {
    this.held = this.held.filter((d) => d !== dir);
  }

  releaseAll() {
    this.held = [];
    this.queued = null;
  }

  isBlocked(x: number, y: number) {
    return x < 0 || y < 0 || x >= W || y >= H || this.solid[y][x];
  }

  update(rawDt: number) {
    const dt = Math.min(MAX_DT, Math.max(0, rawDt));
    const p = this.player;
    if (p.moving) {
      p.t += dt / STEP_SECONDS;
      if (p.t >= 1) {
        p.t = 1;
        p.moving = false;
      } else return;
    }
    if (this.paused) return;
    const held = this.held[this.held.length - 1];
    const tapped = !held && this.queued === p.dir;
    const want = held ?? (tapped ? this.queued : null);
    if (!want) {
      p.turnHeld = 0;
      this.queued = null;
      return;
    }
    if (want !== p.dir) {
      p.dir = want;
      p.turnHeld = 0;
      this.queued = null;
      return;
    }
    if (!tapped) {
      p.turnHeld += dt;
      if (p.turnHeld < TURN_SECONDS && this.queued !== p.dir) return;
    }
    this.queued = null;
    const [dx, dy] = DELTA[p.dir];
    const nx = p.x + dx;
    const ny = p.y + dy;
    if (this.isBlocked(nx, ny)) return;
    p.fromX = p.x;
    p.fromY = p.y;
    p.x = nx;
    p.y = ny;
    p.t = 0;
    p.moving = true;
    p.stepParity = p.stepParity ? 0 : 1;
  }

  /** Interpolated position in tiles, for rendering. */
  get position() {
    const p = this.player;
    const e = p.t;
    return { x: p.fromX + (p.x - p.fromX) * e, y: p.fromY + (p.y - p.fromY) * e };
  }

  /** Walk frame: alternate feet during a step, stand otherwise. */
  get walkFrame(): 0 | 1 {
    const p = this.player;
    return p.moving && p.t > 0.25 && p.t < 0.85 ? 1 : 0;
  }

  /** Mirror up/down walk frames on alternate steps so the gait alternates. */
  get mirrorStep() {
    return this.player.moving && this.player.stepParity === 1 && (this.player.dir === "up" || this.player.dir === "down");
  }

  /** What the player is facing (the adjacent tile), when standing still. */
  facing(): Interactable | null {
    const p = this.player;
    if (p.moving) return null;
    const [dx, dy] = DELTA[p.dir];
    return interactableAt(p.x + dx, p.y + dy);
  }

  /** NPCs turn to face the player when spoken to. */
  faceTowardPlayer(npcId: string) {
    this.npcDirs[npcId] = OPPOSITE[this.player.dir];
  }

  teleport(x: number, y: number, dir: Dir) {
    Object.assign(this.player, { x, y, fromX: x, fromY: y, t: 1, moving: false, dir });
  }
}
