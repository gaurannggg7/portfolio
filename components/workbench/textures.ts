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

/** Tent-card placard in front of each exhibit: number, name, and what the object is. */
export function placardTexture(index: string, name: string, object: string, dark: boolean) {
  return canvasTexture(640, 200, (ctx) => {
    const fit = (text: string, tpl: string, size: number, weight: number, max: number) => {
      let s = size;
      ctx.font = font(tpl, s, weight);
      while (ctx.measureText(text).width > max && s > 14) ctx.font = font(tpl, --s, weight);
    };
    ctx.fillStyle = dark ? "#23262c" : "#fbfaf6";
    ctx.fillRect(0, 0, 640, 200);
    ctx.fillStyle = dark ? "#7d9dff" : "#1f4fd8";
    ctx.fillRect(0, 0, 10, 200);
    ctx.fillStyle = dark ? "#9aa0aa" : "#5f646c";
    ctx.font = font(MONO, 30);
    ctx.fillText(index, 40, 78);
    ctx.fillStyle = dark ? "#ececee" : "#111214";
    fit(name, SANS, 60, 650, 520);
    ctx.fillText(name, 100, 80);
    ctx.fillStyle = dark ? "#babec5" : "#3d4148";
    fit(object, SANS, 34, 500, 570);
    ctx.fillText(object, 40, 150);
  });
}

/** Baseline's terminal screen: the graph's stages and category totals (illustrative). */
export function terminalScreenTexture() {
  return canvasTexture(640, 420, (ctx) => {
    ctx.fillStyle = "#0d1410";
    ctx.fillRect(0, 0, 640, 420);
    ctx.fillStyle = "#86e0a8";
    ctx.font = font(MONO, 22);
    ctx.fillText("$ baseline analyze ledger.csv", 28, 44);
    ctx.fillStyle = "#4f8f69";
    ctx.font = font(MONO, 18);
    ctx.fillText("validate ✓   categorize ∥ anomalies ∥ runway(py)   → brief", 28, 80);
    const bars: [string, number][] = [["COGS", 0.82], ["OpEx", 0.58], ["S&M", 0.41], ["R&D", 0.3], ["Other", 0.12]];
    bars.forEach(([k, v], i) => {
      const y = 118 + i * 44;
      ctx.fillStyle = "#86e0a8";
      ctx.font = font(MONO, 20);
      ctx.fillText(k.padEnd(6, " "), 28, y + 22);
      ctx.fillStyle = "#2f6a48";
      ctx.fillRect(130, y + 4, 420 * v, 24);
    });
    ctx.fillStyle = "#4f8f69";
    ctx.font = font(MONO, 16);
    ctx.fillText("totals: pandas · runway: python · ILLUSTRATION", 28, 396);
  });
}

/** Bellwether instrument face: two dial scales, captions, and run provenance. */
export function instrumentFaceTexture() {
  return canvasTexture(768, 384, (ctx) => {
    ctx.fillStyle = "#e9e6dd";
    ctx.fillRect(0, 0, 768, 384);
    const dial = (cx: number, label: string) => {
      ctx.fillStyle = "#fbfaf6";
      ctx.beginPath();
      ctx.arc(cx, 190, 118, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#2b2e35";
      ctx.lineWidth = 6;
      ctx.stroke();
      // Scale 0..1 across a 240° arc; a red band below 0.9
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * (210 - i * 24) / 180;
        const r1 = i % 5 === 0 ? 84 : 94;
        ctx.strokeStyle = "#2b2e35";
        ctx.lineWidth = i % 5 === 0 ? 5 : 3;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, 190 - Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * 106, 190 - Math.sin(a) * 106);
        ctx.stroke();
      }
      ctx.strokeStyle = "#c0392b";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, 190, 100, -Math.PI * (210 - 7 * 24) / 180, -Math.PI * (210 - 9 * 24) / 180);
      ctx.stroke();
      ctx.fillStyle = "#2b2e35";
      ctx.font = font(MONO, 20);
      ctx.textAlign = "center";
      ctx.fillText(label, cx, 262);
      ctx.fillText("0", cx - 80, 250);
      ctx.fillText("1", cx + 80, 250);
      ctx.textAlign = "left";
    };
    dial(150, "URGENT RECALL");
    dial(430, "SAFETY");
    ctx.fillStyle = "#2b2e35";
    ctx.font = font(MONO, 22);
    ctx.fillText("GATE", 608, 120);
    ctx.font = font(MONO, 16);
    ctx.fillText("v1 → v2", 608, 290);
    ctx.fillText("60 synthetic", 608, 318);
    ctx.fillText("mock runs", 608, 346);
  });
}

/** OSINT dossier pages: a cited report on the left page, an excerpt card on the right. */
export function dossierTexture() {
  return canvasTexture(768, 480, (ctx) => {
    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, 768, 480);
    ctx.fillStyle = "#e7e2d4";
    ctx.fillRect(382, 0, 4, 480);
    ctx.fillStyle = "#1b1d22";
    ctx.font = font(MONO, 22);
    ctx.fillText("REPORT", 28, 46);
    ctx.fillStyle = "#8a6d1f";
    ctx.font = font(MONO, 14);
    ctx.fillText("PRERECORDED · 2026-09-18", 28, 70);
    ctx.strokeStyle = "#c9cfdb";
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      const y = 104 + i * 34;
      ctx.beginPath();
      ctx.moveTo(28, y);
      ctx.lineTo(28 + 230 + ((i * 47) % 80), y);
      ctx.stroke();
      if (i % 3 === 1) {
        ctx.fillStyle = i === 4 ? "#1f4fd8" : "#5f646c";
        ctx.font = font(MONO, 18);
        ctx.fillText(`[${(i % 5) + 1}]`, 300 + ((i * 47) % 40), y + 6);
      }
    }
    ctx.fillStyle = "#1b1d22";
    ctx.font = font(MONO, 22);
    ctx.fillText("EXCERPT [2]", 412, 46);
    ctx.fillStyle = "#5f646c";
    ctx.font = font(MONO, 14);
    ctx.fillText("SEC EDGAR · retrieved · cited", 412, 70);
    ctx.fillStyle = "#fff4c2";
    ctx.fillRect(408, 128, 330, 30);
    ctx.strokeStyle = "#c9cfdb";
    for (let i = 0; i < 9; i++) {
      const y = 104 + i * 34;
      ctx.beginPath();
      ctx.moveTo(412, y);
      ctx.lineTo(412 + 260 + ((i * 31) % 60), y);
      ctx.stroke();
    }
    ctx.fillStyle = "#1f4fd8";
    ctx.font = font(MONO, 16);
    ctx.fillText("open original filing ↗", 412, 440);
  });
}
