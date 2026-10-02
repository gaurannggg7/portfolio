import type { ProjectSlug } from "./types";

/**
 * How each project appears as a physical exhibit, shared by every view.
 * Exhibits are illustrations of the systems, not photographs of hardware
 * or recordings of model output.
 */

export type ExhibitPart = { id: string; label: string; role: string };

export type Exhibit = {
  slug: ProjectSlug;
  /** What the object is, e.g. "Microphone, transcript display, sign screen". */
  object: string;
  /** Provenance label shown whenever the exhibit is on screen. */
  disclosure: string;
  /** What the exhibit's animation shows, in one line. */
  motion: string;
  /** Label for the button that replays the animation. */
  motionAction: string;
  parts: ExhibitPart[];
};

export const exhibits: Record<ProjectSlug, Exhibit> = {
  signlink: {
    slug: "signlink",
    object: "Microphone, transcript display, sign screen",
    disclosure: "Illustration. The text shown is a prepared example, not live inference.",
    motion: "A signal travels from the microphone, through the transcript and gloss, to the sign screen.",
    motionAction: "Send the signal again",
    parts: [
      { id: "mic", label: "Microphone", role: "Speech comes in as audio (or typed text). Whisper turns it into a transcript." },
      { id: "display", label: "Transcript display", role: "The transcript becomes ASL gloss: PLEASE COME HERE in the prepared example." },
      { id: "screen", label: "Sign screen", role: "Gloss tokens resolve to dictionary clips, which FFmpeg joins into one video." },
    ],
  },
  visionary: {
    slug: "visionary",
    object: "Sensor glove and microcontroller",
    disclosure: "Illustration drawn from the firmware pin map, not a photograph of the glove.",
    motion: "Select a component to see its role.",
    motionAction: "Cycle through components",
    parts: [
      { id: "flex", label: "Flex sensors ×5", role: "One per finger (GPIO 17, 5, 18, 19, 21). Each reading is calibrated to 0–100." },
      { id: "imu", label: "MPU6050 IMU", role: "On I²C (SDA 23, SCL 22). Detected motion turns I into J and D into Z." },
      { id: "mcu", label: "Microcontroller", role: "Matches the five values to the nearest of 26 letter templates and waits for five matching readings in a row." },
    ],
  },
  baseline: {
    slug: "baseline",
    object: "Financial-analysis terminal",
    disclosure: "Illustration of the LangGraph topology in backend/agent.py. No live API call.",
    motion: "The ledger fans out to three stages in parallel, which fan back in to write the brief.",
    motionAction: "Run the fan-out again",
    parts: [
      { id: "ledger", label: "Transaction ledger", role: "A CSV is validated first, and bad files get a structured 422 error instead of a crash." },
      { id: "llm", label: "Categorize + Anomalies", role: "Two LLM stages in JSON mode run in parallel. Totals are summed in pandas, not by the model." },
      { id: "python", label: "Runway", role: "Plain Python: cash on hand divided by net monthly burn. No LLM call." },
      { id: "brief", label: "Executive brief", role: "A final LLM call writes the summary from all three results." },
    ],
  },
  bellwether: {
    slug: "bellwether",
    object: "Evaluation and regression instrument",
    disclosure: "Readings from Bellwether's committed snapshot: synthetic scenarios, mock runs. The page does not rerun the pipeline.",
    motion: "Switch to prompt_v2: the recall dial holds at 1.0, the safety dial drops, and the gate lamp turns red.",
    motionAction: "Run the comparison again",
    parts: [
      { id: "recall", label: "Urgent-recall dial", role: "1.0 for both prompt versions. Routing follows the conversation's concern signal, which the prompt doesn't change." },
      { id: "safety", label: "Safety dial", role: "Mean safety fell from 0.977 to 0.825. Safety is a hard gate, so a failure can't be averaged away." },
      { id: "gate", label: "Gate lamp", role: "Blocked: safety, escalation correctness, and hard-gate failure rate regressed. The CLI exits non-zero." },
    ],
  },
  osint: {
    slug: "osint",
    object: "Research dossier and evidence console",
    disclosure: "Prerecorded runs, labelled as such. The exhibit never calls the live backend.",
    motion: "The magnifier moves from a citation in the report to the excerpt it points at.",
    motionAction: "Follow the citation again",
    parts: [
      { id: "report", label: "Report", role: "Written by the synthesize node. Every claim should cite an excerpt number like [2]." },
      { id: "excerpts", label: "Excerpt cards", role: "The top five retrieved excerpts, each flagged cited or not, with a link to the original filing." },
      { id: "lens", label: "Magnifier", role: "A citation only proves the report points at an excerpt. Reading the excerpt is how you check support." },
    ],
  },
  guardian: {
    slug: "guardian",
    object: "Investigation board",
    disclosure: "Illustration with synthetic accounts. Not GuardianAI's data or model output.",
    motion: "The string lights up the money's path: one source, five pass-through accounts, one collector.",
    motionAction: "Trace the path again",
    parts: [
      { id: "source", label: "S1 · source", role: "Five transfers of $9,200–9,800 in two hours, all just under a $10,000 threshold." },
      { id: "mules", label: "M1–M5 · pass-through", role: "Each forwards about 99% of what it received the next morning." },
      { id: "collector", label: "C1 · collector", role: "Everything ends up here. It has the highest PageRank on the synthetic graph." },
    ],
  },
};

/** Visual order of exhibits on the bench, left to right. GuardianAI is in the catalog, not on the bench. */
export const BENCH_ORDER: ProjectSlug[] = ["bellwether", "osint", "baseline", "signlink", "visionary"];
