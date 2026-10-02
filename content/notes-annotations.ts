import type { ProjectSlug } from "./types";

/**
 * Numbered annotations for each project's figure in the Field Notes view.
 * Every note restates a documented decision or measurement; `at` places the
 * mark on the figure (percent of its width and height).
 */
export type Annotation = { text: string; source: string; at: [number, number] };

export const annotations: Record<ProjectSlug, { figure: string; caption: string; notes: Annotation[] }> = {
  signlink: {
    figure: "A typed sentence traced to its sign clips",
    caption: "Prepared example, traced with SignLink's fallback code. Not live inference.",
    notes: [
      { text: "This gloss comes from the stopword fallback. The hosted Gemma stage can produce a different one.", source: "gloss_builder.py", at: [50.5, 2] },
      { text: "HELLO is an exact match in the 1,540-sign index.", source: "mapping.py", at: [4.5, 44] },
      { text: "GAURANG has no sign and no matching root, so it's fingerspelled rather than dropped.", source: "mapping.py", at: [27, 44] },
    ],
  },
  baseline: {
    figure: "The graph after the parallel restructure",
    caption: "Topology from backend/agent.py. Measurements from eval/RESULTS.md (Llama 3.3 70B).",
    notes: [
      { text: "Validating first turned 10 unhandled crashes into structured 422 errors: 62% → 100% on the adversarial corpus.", source: "eval/RESULTS.md", at: [22.1, 43] },
      { text: "Model-produced totals were off by more than 5% in 16 of 19 runs, so totals are now summed in pandas.", source: "eval/RESULTS.md", at: [47.9, 10.8] },
      { text: "No LLM here. Asked to echo 999.0, the model never once returned it in 19 runs.", source: "backend/agent.py", at: [47.9, 75.4] },
      { text: "The brief waits for all three nodes, which caps the parallel speedup at about 17%.", source: "eval/RESULTS.md", at: [77.1, 43] },
    ],
  },
  bellwether: {
    figure: "Prompt-regression experiment: prompt_v1 against prompt_v2",
    caption: "From the committed snapshot. 60 synthetic scenarios, deterministic mock runs. Not clinical validation.",
    notes: [
      { text: "The gate blocked. The regression CLI exits non-zero at this point, so a deployment pipeline stops.", source: "tests/regression_tests.py", at: [97.5, 7] },
      { text: "Urgent recall held at 1.0, and all 60 routing decisions were identical: routing follows the conversation's concern signal, which the prompt doesn't touch.", source: "snapshot.json", at: [97.5, 26] },
      { text: "prompt_v2 led with coping and dropped the disclosure acknowledgement, so mean safety fell from 0.977 to 0.825.", source: "snapshot.json", at: [97.5, 52] },
      { text: "Hard-gate failures doubled, from 8 to 16 of 60. A failed hard gate can't be averaged away by good empathy scores.", source: "evaluation/scoring.py", at: [97.5, 66] },
    ],
  },
  osint: {
    figure: "The two-node workflow, from query to cited report",
    caption: "From agent/graph.py. The reports in the exhibit are prerecorded runs.",
    notes: [
      { text: "A keyword guardrail runs before retrieval or any model call. It's a first line of defence, not a classifier.", source: "agent/graph.py", at: [94, 30] },
      { text: "Top five excerpts. On 17 test queries, hybrid retrieval never beat the better single method (0 wins, 17 ties).", source: "eval/STAGE_5_RESULTS.md", at: [94, 50] },
      { text: "Only excerpts the report actually cites become citations. The check is structural; it doesn't test whether an excerpt supports the claim.", source: "agent/graph.py", at: [94, 90] },
    ],
  },
  guardian: {
    figure: "Fan-out and fan-in through pass-through accounts",
    caption: "Synthetic, educational data. Not GuardianAI's data or model output.",
    notes: [
      { text: "Fan-out: five transfers in two hours, each just under $10,000.", source: "synthetic example", at: [3.8, 42.2] },
      { text: "Pass-through: each account forwards about 99% of what it got, the next morning.", source: "synthetic example", at: [33.2, 42.2] },
      { text: "Fan-in: the highest PageRank on this graph, which is the property centrality features pick up.", source: "synthetic example", at: [62.9, 42.2] },
    ],
  },
  visionary: {
    figure: "Sensors, microcontroller, and the letter-matching chain",
    caption: "Schematic drawn from the firmware pin map. Not to scale.",
    notes: [
      { text: "Each finger is calibrated to 0–100 from its own minimum and maximum.", source: "SensorReading.cpp", at: [5, 32] },
      { text: "Detected motion turns I into J and D into Z.", source: "infoProcessing.cpp", at: [11.7, 68.7] },
      { text: "Q, T and U share one template, so the firmware always returns Q for that hand shape.", source: "infoProcessing.cpp", at: [68.75, 13.3] },
      { text: "Audio output is described in the project, but there's no audio code in the repository.", source: "repository", at: [68.75, 77.3] },
    ],
  },
};
