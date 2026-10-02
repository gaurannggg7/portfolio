/**
 * Letter templates and matching rule from Visionary Hands firmware
 * (vs-spring25/combined_code/infoProcessing.cpp), copied verbatim.
 * Finger order: pinky, ring, middle, index, thumb. Values are calibrated
 * bend on a 0–100 scale; -200 marks a letter that isn't implemented yet.
 */

export const FINGERS = ["Pinky", "Ring", "Middle", "Index", "Thumb"] as const;

export const letterTemplates: number[][] = [
  [45, 55, 65, 60, 2], // a
  [0, 0, 0, 0, 30], // b
  [0, 10, 17, 0, 0], // c
  [40, 40, 40, 0, 5], // d
  [30, 30, 50, 15, 30], // e
  [0, 0, 0, 20, 20], // f
  [30, 40, 30, 0, 10], // g
  [40, 40, 0, 0, 10], // h
  [0, 30, 21, 30, 10], // i
  [50, 50, 20, 0, 100], // j
  [30, 30, 0, 0, 10], // k
  [40, 30, 10, 0, 0], // l
  [15, 35, 0, 0, 100], // m
  [2, 10, 38, 18, 100], // n
  [30, 30, 20, 10, 10], // o
  [20, 20, 0, 0, 0], // p
  [30, 30, 35, 0, 20], // q
  [20, 27, 0, 5, 10], // r
  [33, 50, 70, 70, 2], // s
  [30, 30, 35, 0, 20], // t
  [30, 30, 35, 0, 20], // u
  [-200, -200, -200, -200, -200], // v (not implemented)
  [20, 0, 0, 0, 0], // w
  [10, 5, 5, 0, 20], // x
  [0, 15, 15, 5, 0], // y
  [50, 50, 20, 0, 100], // z
];

export const spaceTemplate = [0, 0, 0, 0, 0];

const distance = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

export type MatchResult = {
  char: string;
  distance: number;
  /** Set when motion changed the letter (I→J or D→Z). */
  motionOverride?: string;
  ranked: { char: string; distance: number }[];
};

/** Mirrors produceChar() with learning_mode = false. */
export function matchLetter(reading: number[], jMotion: boolean, zMotion: boolean): MatchResult {
  let produced = "";
  let min = Number.POSITIVE_INFINITY;
  const ranked: { char: string; distance: number }[] = [];

  letterTemplates.forEach((tpl, l) => {
    const d = distance(reading, tpl);
    const ch = String.fromCharCode(65 + l);
    ranked.push({ char: ch, distance: d });
    // Strict "<" as in the firmware: on ties the earlier letter wins.
    if (d < min) {
      produced = ch;
      min = d;
    }
  });

  const dSpace = distance(reading, spaceTemplate);
  ranked.push({ char: "space", distance: dSpace });
  if (dSpace < min) {
    produced = "space";
    min = dSpace;
  }

  let motionOverride: string | undefined;
  if (produced === "I" && jMotion) {
    produced = "J";
    motionOverride = "I → J (motion)";
  } else if (produced === "D" && zMotion) {
    produced = "Z";
    motionOverride = "D → Z (motion)";
  }

  ranked.sort((a, b) => a.distance - b.distance);
  return { char: produced, distance: min, motionOverride, ranked };
}
