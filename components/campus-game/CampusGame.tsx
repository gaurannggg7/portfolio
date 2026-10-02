"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { CampusEngine } from "./engine";
import { BUILDINGS, type BuildingId, type Dialogue, type Interactable } from "./map";
import { buildAtlas, computeCamera, drawFrame, toScreen, type Atlas } from "./render";
import { DAY, NIGHT, type Dir } from "./sprites";
import { GamePanel, panelFor } from "./GamePanels";

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

function describe(t: Interactable | null) {
  if (!t) return "";
  if (t.kind === "door") return t.building.id === "kiosk" ? "the Contact Kiosk" : `the ${t.building.name} door`;
  if (t.kind === "sign") return t.sign.dialogue.speaker === "Welcome sign" ? "the welcome sign" : "a sign";
  return t.npc.dialogue.speaker.toLowerCase().replace(/^/, "the ");
}

/** Short, muted-by-default sound effects (Web Audio; no files, no autoplay). */
function useBlip(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(
    (freq: number) => {
      if (!enabled) return;
      try {
        ctxRef.current ??= new AudioContext();
        const ctx = ctxRef.current;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.12);
      } catch {}
    },
    [enabled],
  );
}

export default function CampusGame({ sound, reducedMotion, onReady }: { sound: boolean; reducedMotion: boolean; onReady?: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Partial<Record<BuildingId, HTMLSpanElement | null>>>({});
  const engineRef = useRef<CampusEngine | null>(null);
  const [started, setStarted] = useState(false);
  const [dialogue, setDialogue] = useState<(Dialogue & { i: number }) | null>(null);
  const [panel, setPanel] = useState<BuildingId | null>(null);
  const [hint, setHint] = useState("");
  const blip = useBlip(sound);

  // Mirror UI state into refs the animation loop can read without re-rendering.
  const blocking = useRef(false);
  const startedRef = useRef(false);
  useEffect(() => {
    blocking.current = Boolean(dialogue || panel);
    startedRef.current = started;
    const e = engineRef.current;
    if (e) {
      e.paused = blocking.current || !started;
      if (e.paused) e.releaseAll();
    }
  }, [dialogue, panel, started]);

  /* ---------- Loop ------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const stage = stageRef.current!;
    const ctx = canvas.getContext("2d")!;
    const engine = (engineRef.current ??= new CampusEngine());
    engine.paused = true;

    let dark = document.documentElement.getAttribute("data-theme") === "dark";
    let atlas: Atlas = buildAtlas(dark ? NIGHT : DAY);
    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.getAttribute("data-theme") === "dark";
      if (next !== dark) {
        dark = next;
        atlas = buildAtlas(dark ? NIGHT : DAY);
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Integer scale: target ~46 CSS px per tile on desktop, ~34 on phones.
    let dpr = 1;
    let scale = 3;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const r = stage.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const target = r.width < 640 ? 34 : 46;
      scale = Math.max(1, Math.round((target * dpr) / 16));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let raf = 0;
    let last = performance.now();
    let lastHint = "";
    let readied = false;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      engine.update(dt);
      const cam = computeCamera(engine, canvas.width, canvas.height, scale);
      drawFrame(ctx, atlas, engine, cam, { time: now / 1000, animate: !reducedMotion, bg: dark ? NIGHT[3] : DAY[2] });

      // Building name plates follow the camera (DOM, so text stays sharp).
      for (const b of BUILDINGS) {
        const el = labelRefs.current[b.id];
        if (!el) continue;
        const p = toScreen(cam, b.x + b.w / 2, b.y, dpr);
        const bottom = toScreen(cam, b.x, b.y + b.h, dpr).y;
        const viewH = canvas.height / dpr;
        // Keep the plate on screen while any of the building is visible.
        const visible = bottom > 24 && p.y < viewH - 8;
        const y = Math.max(p.y, 26);
        el.style.opacity = visible ? "1" : "0";
        el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(y)}px) translate(-50%, -120%)`;
      }

      // Current tile on the stage element (direct DOM write; useful for testing and debugging).
      const tile = `${engine.player.x},${engine.player.y},${engine.player.dir}`;
      if (stage.dataset.tile !== tile) stage.dataset.tile = tile;

      // Only touch React when the interaction target changes.
      const target = !blocking.current && startedRef.current ? engine.facing() : null;
      const h = target ? `Facing ${describe(target)}. Press E or Enter.` : "";
      if (h !== lastHint) {
        lastHint = h;
        setHint(h);
      }
      if (!readied) {
        readied = true;
        onReady?.();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const releaseAll = () => engine.releaseAll();
    const onVisibility = () => document.hidden && releaseAll();
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", onVisibility);
      engine.releaseAll();
    };
  }, [reducedMotion, onReady]);

  /* ---------- Interaction ------------------------------------------------ */
  const closePanel = useCallback(() => {
    setPanel(null);
    requestAnimationFrame(() => stageRef.current?.focus());
  }, []);

  const interact = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (dialogue) {
      if (dialogue.i < dialogue.lines.length - 1) setDialogue({ ...dialogue, i: dialogue.i + 1 });
      else setDialogue(null);
      blip(660);
      return;
    }
    const t = engine.facing();
    if (!t) return;
    engine.releaseAll();
    if (t.kind === "door") {
      blip(880);
      setPanel(t.building.id);
    } else if (t.kind === "sign") {
      blip(520);
      setDialogue({ ...t.sign.dialogue, i: 0 });
    } else {
      engine.faceTowardPlayer(t.npc.id);
      blip(600);
      setDialogue({ ...t.npc.dialogue, i: 0 });
    }
  }, [dialogue, blip]);

  const start = () => {
    setStarted(true);
    stageRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (panel) return; // the panel handles its own keys
    const engine = engineRef.current;
    if (!engine) return;
    const dir = KEY_DIR[e.key];
    if (dir) {
      e.preventDefault(); // keep arrow keys from scrolling the page
      if (!started) setStarted(true);
      if (!e.repeat && !dialogue) engine.press(dir);
      return;
    }
    if (e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!started) return start();
      if (!e.repeat) interact();
    } else if (e.key === "Escape" && dialogue) {
      e.preventDefault();
      setDialogue(null);
    }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    const dir = KEY_DIR[e.key];
    if (dir) engineRef.current?.release(dir);
  };

  // Touch / pointer d-pad
  const padHandlers = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      if (!started) setStarted(true);
      if (!dialogue) engineRef.current?.press(dir);
    },
    onPointerUp: () => engineRef.current?.release(dir),
    onPointerCancel: () => engineRef.current?.release(dir),
    onLostPointerCapture: () => engineRef.current?.release(dir),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const p = panel ? panelFor(panel) : null;

  return (
    <div className="rpg">
      <div className="relative">
        <div
          ref={stageRef}
          tabIndex={0}
          role="application"
          aria-roledescription="campus game"
          aria-label="Campus map game. Arrow keys or WASD to walk, E or Enter to interact, Escape to close."
          aria-describedby="campus-hint"
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => engineRef.current?.releaseAll()}
          onPointerDown={() => {
            if (!started) setStarted(true);
          }}
          className="rpg-stage relative h-[min(42svh,340px)] w-full touch-none select-none overflow-hidden outline-none sm:h-[min(60svh,440px)] lg:h-[560px]"
        >
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full [image-rendering:pixelated]" />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {BUILDINGS.map((b) => (
              <span
                key={b.id}
                ref={(el) => {
                  labelRefs.current[b.id] = el;
                }}
                className="rpg-plate absolute left-0 top-0 whitespace-nowrap px-1.5 py-0.5 font-pixel text-[10px] uppercase sm:text-[11px]"
              >
                {b.name}
              </span>
            ))}
          </div>

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-4">
              <div className="rpg-box max-w-sm p-5 text-center">
                <p className="font-pixel text-xs uppercase">Engineering campus</p>
                <p className="mt-2 text-sm leading-relaxed">
                  Walk with the arrow keys or WASD (or the pad below on touch screens). Press E or Enter at a door, sign, or person.
                </p>
                <button type="button" onClick={start} className="rpg-btn rpg-btn-primary mt-4 inline-flex min-h-11 items-center px-4 text-sm font-semibold">
                  Start exploring
                </button>
              </div>
            </div>
          )}

          {dialogue && (
            <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-6 sm:bottom-4" role="status" aria-live="polite">
              <div className="rpg-box p-4">
                <p className="font-pixel text-[11px] uppercase">{dialogue.speaker}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed">{dialogue.lines[dialogue.i]}</p>
                <div className="mt-2 flex items-center justify-between gap-2 font-pixel text-[10px] uppercase">
                  <span>
                    {dialogue.i + 1}/{dialogue.lines.length} · E: next · Esc: skip
                  </span>
                  <span className="flex gap-2">
                    <button type="button" onClick={() => setDialogue(null)} className="rpg-btn min-h-9 px-2.5">
                      Skip
                    </button>
                    <button type="button" onClick={interact} className="rpg-btn rpg-btn-primary min-h-9 px-2.5">
                      {dialogue.i < dialogue.lines.length - 1 ? "Next" : "Close"}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
        {p && (
          <GamePanel title={p.title} kicker={p.kicker} onClose={closePanel}>
            {p.body}
          </GamePanel>
        )}

        <p id="campus-hint" aria-live="polite" className="rpg-hint min-h-9 px-3 py-2 font-pixel text-[11px] uppercase">
          {hint || (started ? "Walk to a door, sign, or person." : "Press Start exploring, or select the map and use the arrow keys.")}
        </p>
      </div>

      {/* Touch controls: below the map so they never cover it */}
      <div className="rpg-pad flex items-center justify-between gap-6 px-4 py-3 lg:hidden [@media(pointer:coarse)]:flex">
        <div className="grid grid-cols-3 grid-rows-3 gap-1" role="group" aria-label="Direction pad">
          <span />
          <button type="button" aria-label="Walk up" className="rpg-btn rpg-dpad" {...padHandlers("up")}>
            <ChevronUp aria-hidden className="h-6 w-6" />
          </button>
          <span />
          <button type="button" aria-label="Walk left" className="rpg-btn rpg-dpad" {...padHandlers("left")}>
            <ChevronLeft aria-hidden className="h-6 w-6" />
          </button>
          <span />
          <button type="button" aria-label="Walk right" className="rpg-btn rpg-dpad" {...padHandlers("right")}>
            <ChevronRight aria-hidden className="h-6 w-6" />
          </button>
          <span />
          <button type="button" aria-label="Walk down" className="rpg-btn rpg-dpad" {...padHandlers("down")}>
            <ChevronDown aria-hidden className="h-6 w-6" />
          </button>
          <span />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!started) setStarted(true);
            else interact();
          }}
          className="rpg-btn rpg-btn-primary h-[4.5rem] w-[4.5rem] rounded-full font-pixel text-sm uppercase"
          aria-label={dialogue ? "Next" : "Interact"}
        >
          {dialogue ? "Next" : "E"}
        </button>
      </div>
    </div>
  );
}
