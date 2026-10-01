export type ProjectSlug = "signlink" | "baseline" | "guardian" | "visionary";

export type LinkKind = "repo" | "live" | "video" | "dataset" | "slides";

export type ProjectLink = {
  label: string;
  href: string;
  kind: LinkKind;
  /** Short qualifier shown next to the link, e.g. "may need to wake". */
  note?: string;
};

/** One stage of a system pipeline, shown in the stage inspector. */
export type Stage = {
  id: string;
  label: string;
  /** Short name for compact views, e.g. "Gloss". */
  short?: string;
  /** One-line description for compact views. */
  brief?: string;
  input: string;
  process: string;
  output: string;
  /** Technologies confirmed in the source material for this stage. */
  tech: string[];
  /** Only set when the reason is documented in the project's own material. */
  rationale?: string;
  /** Only set when the limitation is documented or directly visible in code. */
  limitation?: string;
  source?: { label: string; href: string };
};

export type Result = {
  value: string;
  /** What the number is, how it was obtained, and what it is not. */
  context: string;
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  summary: string;
  /** One concise outcome or purpose statement for the homepage. */
  outcome: string;
  period?: string;
  role?: string;
  problem: string;
  contribution?: string[];
  howItWorks: string;
  stages: Stage[];
  tradeoffs?: { title: string; body: string }[];
  limitations?: string[];
  results?: Result[];
  links: ProjectLink[];
  /** Where the demonstration's data comes from; shown in an expandable note beside it. */
  provenance?: { summary: string; points: string[] };
  /** Shown when a project has no public code or demo. */
  availability?: string;
  stack: string[];
};

export type MinorProject = {
  name: string;
  context: string;
  summary: string;
  stack: string[];
  links: ProjectLink[];
  anchor?: string;
};

export type Role = {
  org: string;
  role: string;
  period: string;
  location?: string;
  points: string[];
  project?: { label: string; href: string };
};
