/**
 * Prepared SignLink examples.
 *
 * Each trace was produced by running the repository's deterministic fallback
 * gloss (`_simple_gloss` in gloss_builder.py) and resolver (`ASLDictionary` in
 * mapping.py) against the published clip index. The hosted app's Gemma stage
 * can produce a different gloss for the same sentence.
 *
 * Clips are the original StudioGalt CC0 files from SignLink's Hugging Face
 * dataset, not SignLink's rendered output.
 */

const DATASET = "https://huggingface.co/datasets/gaurannggg7/asl-dictionary";
const RESOLVE = `${DATASET}/resolve/main/`;

export type ResolveMethod = "phrase" | "exact" | "lemma" | "fingerspell";

export type Clip = {
  /** What the clip shows, e.g. "COME HERE" or "G". */
  label: string;
  /** Path inside the Hugging Face dataset. */
  path: string;
};

export type Resolution = {
  tokens: string[];
  method: ResolveMethod;
  detail: string;
  clips: Clip[];
};

export type SignExample = {
  id: string;
  sentence: string;
  dropped: string[];
  gloss: string[];
  resolutions: Resolution[];
  shows: string;
};

export const clipUrl = (path: string) => RESOLVE + path.split("/").map(encodeURIComponent).join("/");
export const datasetUrl = DATASET;

const letter = (l: string): Clip => ({ label: l, path: `Letters/${l}.mp4` });

export const methodLabel: Record<ResolveMethod, string> = {
  phrase: "Phrase match",
  exact: "Exact match",
  lemma: "Suffix stripped",
  fingerspell: "Fingerspelled",
};

export const signExamples: SignExample[] = [
  {
    id: "phrase",
    sentence: "Please come here",
    dropped: [],
    gloss: ["PLEASE", "COME", "HERE"],
    shows: "Multi-word signs are matched before single words.",
    resolutions: [
      {
        tokens: ["PLEASE"],
        method: "exact",
        detail: "Found in the clip index.",
        clips: [{ label: "PLEASE", path: "dictionary/SG ASL P /SG ASL Please 2024-10-13 CC.mp4" }],
      },
      {
        tokens: ["COME", "HERE"],
        method: "phrase",
        detail: "The longest-phrase pass finds a single sign for COME HERE, so the two words aren't signed separately.",
        clips: [{ label: "COME HERE", path: "dictionary/SG ASL C /SG ASL Come Here 2025-3-25 CC.mp4" }],
      },
    ],
  },
  {
    id: "lemma",
    sentence: "Cleaning the apartment",
    dropped: ["the"],
    gloss: ["CLEANING", "APARTMENT"],
    shows: "Articles are dropped, and inflected words fall back to their root.",
    resolutions: [
      {
        tokens: ["CLEANING"],
        method: "lemma",
        detail: "CLEANING isn't in the index. Removing the -ING suffix gives CLEAN, which is.",
        clips: [{ label: "CLEAN", path: "dictionary/SG ASL C /SG ASL Clean 2025-2-27 CC.mp4" }],
      },
      {
        tokens: ["APARTMENT"],
        method: "exact",
        detail: "Found in the clip index.",
        clips: [{ label: "APARTMENT", path: "dictionary/SG ASL A /SG ASL Apartment 1 2023-7-20 CC.mp4" }],
      },
    ],
  },
  {
    id: "spell",
    sentence: "Hello Gaurang",
    dropped: [],
    gloss: ["HELLO", "GAURANG"],
    shows: "Names and other unknown words are fingerspelled, not dropped.",
    resolutions: [
      {
        tokens: ["HELLO"],
        method: "exact",
        detail: "Found in the clip index.",
        clips: [{ label: "HELLO", path: "dictionary/SG ASL H /SG ASL Hello 2024-6-9 CC.mp4" }],
      },
      {
        tokens: ["GAURANG"],
        method: "fingerspell",
        detail: "There's no sign and no matching root, so the resolver spells it with seven letter clips.",
        clips: "GAURANG".split("").map(letter),
      },
    ],
  },
];

/** What the selected example looks like at each pipeline stage. */
export function exampleAtStage(example: SignExample, stageId: string): string | undefined {
  const clipCount = example.resolutions.reduce((n, r) => n + r.clips.length, 0);
  switch (stageId) {
    case "input":
      return `Typed text: “${example.sentence}”.`;
    case "asr":
      return "Skipped, because this example is typed text, not audio.";
    case "gloss":
      return `Fallback gloss: ${example.gloss.join(" ")}${
        example.dropped.length ? ` (dropped: ${example.dropped.join(", ")})` : ""
      }. The Gemma stage may differ.`;
    case "resolve":
      return example.resolutions.map((r) => `${r.tokens.join(" ")} → ${methodLabel[r.method].toLowerCase()}`).join("; ") + ".";
    case "render":
      return `${clipCount} clip${clipCount === 1 ? "" : "s"} normalized to 1280×720 and joined into one video.`;
    default:
      return undefined;
  }
}
