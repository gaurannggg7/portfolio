import * as THREE from "three";

/** Procedural canvas textures, so the scene needs no image downloads. */

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(...repeat);
  }
  return tex;
}

// Deterministic pseudo-random so textures are identical on every load.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function woodTexture(base: string, grain: string) {
  return canvasTexture(1024, 256, (ctx) => {
    const r = rng(7);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 90; i++) {
      const y = r() * 256;
      ctx.strokeStyle = grain;
      ctx.globalAlpha = 0.08 + r() * 0.14;
      ctx.lineWidth = 0.6 + r() * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 64) ctx.lineTo(x, y + Math.sin(x / 140 + i) * (2 + r() * 5));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

export function pegboardTexture(base: string, hole: string) {
  return canvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = hole;
    for (let y = 16; y < 256; y += 32) for (let x = 16; x < 256; x += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [6, 3]);
}

export function corkTexture() {
  return canvasTexture(512, 384, (ctx) => {
    const r = rng(11);
    ctx.fillStyle = "#b98a5a";
    ctx.fillRect(0, 0, 512, 384);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = r() > 0.5 ? "#a87a4c" : "#cc9d6b";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(r() * 512, r() * 384, 1 + r() * 2.5, 1 + r() * 2.5);
    }
    ctx.globalAlpha = 1;
  });
}

const MONO = "600 {size}px ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "{weight} {size}px ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif";
const font = (tpl: string, size: number, weight = 600) => tpl.replace("{size}", String(size)).replace("{weight}", String(weight));

/** Screen showing the transcript and gloss of SignLink's prepared example. */
export function transcriptTexture() {
  return canvasTexture(512, 320, (ctx) => {
    ctx.fillStyle = "#0e1424";
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "#7f9cff";
    ctx.font = font(MONO, 22);
    ctx.fillText("TRANSCRIPT", 32, 54);
    ctx.fillStyle = "#e9edf8";
    ctx.font = font(SANS, 40, 600);
    ctx.fillText("“Please come here”", 32, 112);
    ctx.fillStyle = "#7f9cff";
    ctx.font = font(MONO, 22);
    ctx.fillText("ASL GLOSS", 32, 186);
    ctx.fillStyle = "#e9edf8";
    ctx.font = font(MONO, 40);
    ctx.fillText("PLEASE COME HERE", 32, 240);
    ctx.fillStyle = "#6c7590";
    ctx.font = font(MONO, 16);
    ctx.fillText("PREPARED EXAMPLE · NOT LIVE", 32, 296);
  });
}

/** Monitor showing the two resolved sign clips as labelled frames (not real video). */
export function signScreenTexture() {
  return canvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#11141b";
    ctx.fillRect(0, 0, 640, 400);
    const frame = (x: number, label: string, n: string) => {
      ctx.fillStyle = "#1d2433";
      ctx.fillRect(x, 54, 270, 250);
      // Simple signer silhouette: head, shoulders, raised hand.
      ctx.fillStyle = "#3b4a6b";
      ctx.beginPath();
      ctx.arc(x + 135, 132, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x + 75, 172, 120, 132);
      ctx.fillStyle = "#7f9cff";
      ctx.beginPath();
      ctx.arc(x + (n === "1" ? 200 : 70), 190, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e9edf8";
      ctx.font = font(MONO, 22);
      ctx.fillText(label, x + 12, 334);
      ctx.fillStyle = "#6c7590";
      ctx.font = font(MONO, 16);
      ctx.fillText(`CLIP ${n}/2`, x + 12, 36);
    };
    frame(36, "PLEASE", "1");
    frame(334, "COME HERE", "2");
    ctx.fillStyle = "#6c7590";
    ctx.font = font(MONO, 15);
    ctx.fillText("ILLUSTRATION · CLIPS PLAY ON THE PROJECT PAGE", 36, 384);
  });
}

/** Index card pinned to the investigation board. */
export function cardTexture(title: string, sub: string, hot: boolean) {
  return canvasTexture(256, 160, (ctx) => {
    ctx.fillStyle = "#fbf8ef";
    ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = hot ? "#c0392b" : "#9aa3b2";
    ctx.fillRect(0, 0, 256, 14);
    ctx.fillStyle = "#1b1d22";
    ctx.font = font(MONO, 64);
    ctx.fillText(title, 24, 92);
    ctx.fillStyle = "#596172";
    ctx.font = font(SANS, 22, 500);
    ctx.fillText(sub, 24, 136);
  });
}

/** Paper with ruled lines and an optional heading. */
export function paperTexture(heading: string, lines = 9) {
  return canvasTexture(320, 420, (ctx) => {
    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, 320, 420);
    ctx.fillStyle = "#1b1d22";
    ctx.font = font(MONO, 26);
    ctx.fillText(heading, 24, 52);
    ctx.strokeStyle = "#c9cfdb";
    ctx.lineWidth = 2;
    for (let i = 0; i < lines; i++) {
      const y = 92 + i * 34;
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(24 + 150 + ((i * 53) % 110), y);
      ctx.stroke();
    }
  });
}

export function labelTexture(text: string, bg: string, fg: string) {
  return canvasTexture(256, 64, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = fg;
    ctx.font = font(MONO, 26);
    ctx.textAlign = "center";
    ctx.fillText(text, 128, 42);
  });
}
