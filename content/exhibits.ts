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
    object: "Ledger, three-cartridge processor, brief",
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

/** Visual order of exhibits on the bench, left to right. */
export const BENCH_ORDER: ProjectSlug[] = ["signlink", "visionary", "baseline", "guardian"];
