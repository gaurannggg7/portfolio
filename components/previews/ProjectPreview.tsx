import { methodLabel, signExamples } from "@/content/signlink-examples";
import type { ProjectSlug } from "@/content/types";
import NetworkDiagram from "../guardian/NetworkDiagram";
import GloveSchematic from "../visionary/GloveSchematic";
import BaselineDag from "../baseline/BaselineDag";
import GateSummary from "../bellwether/GateSummary";
import OsintFlow from "../osint/OsintFlow";

/** SignLink preview: the fingerspelling example as a transcript → gloss → clip trace. */
export function SignLinkTrace() {
  const ex = signExamples[2];
  const clips = ex.resolutions.flatMap((r) => r.clips.map((c) => ({ ...c, method: r.method })));
  return (
    <div className="grid gap-px overflow-hidden rounded-panel border border-rule bg-rule text-sm shadow-panel sm:grid-cols-2">
      <div className="bg-surface p-4">
        <p className="label">Transcript</p>
        <p className="mt-1.5 text-lg font-medium tracking-tight text-ink">“{ex.sentence}”</p>
      </div>
      <div className="bg-surface p-4">
        <p className="label">Gloss</p>
        <p className="mt-1.5 font-mono text-lg text-ink">{ex.gloss.join(" ")}</p>
      </div>
      <div className="bg-surface p-4 sm:col-span-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="label">Video · {clips.length} clips in sequence</p>
          <p className="font-mono text-[11px] text-ink-3">
            {ex.resolutions.map((r) => `${r.tokens.join(" ")}: ${methodLabel[r.method].toLowerCase()}`).join(" · ")}
          </p>
        </div>
        <ol className="mt-3 grid grid-cols-9 gap-1.5" aria-label="Clip sequence">
          {clips.map((c, i) => (
            <li
              key={`${c.path}-${i}`}
              className={`flex h-20 flex-col justify-between rounded-control border p-1.5 sm:h-24 ${
                c.method === "exact" ? "col-span-2 border-ink bg-ink text-bg" : "border-rule-strong bg-surface-2 text-ink"
              }`}
            >
              <span className="font-mono text-[9px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-mono text-xs font-medium sm:text-sm">{c.label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs leading-relaxed text-ink-3">
          Prepared example, traced with SignLink&apos;s fallback code. The clips play on the project page.
        </p>
      </div>
    </div>
  );
}

/** Provenance label shown with each diagram preview. */
export const PREVIEW_CAPTION: Record<ProjectSlug, string> = {
  signlink: "Prepared example · not live inference",
  baseline: "Graph from backend/agent.py · LLM nodes outlined",
  bellwether: "Committed snapshot · synthetic scenarios · mock runs",
  osint: "Workflow from agent/graph.py",
  guardian: "Synthetic data · illustrative",
  visionary: "Schematic from firmware · not to scale",
};

/** The diagram that represents a project, framed, with its provenance label. */
export function DiagramPreview({ slug, idPrefix }: { slug: Exclude<ProjectSlug, "signlink" | "bellwether">; idPrefix: string }) {
  return (
    <div className="rounded-panel border border-rule bg-surface p-2 shadow-panel sm:p-3">
      {slug === "guardian" && (
        <NetworkDiagram idPrefix={idPrefix} showPattern label="Synthetic transaction network with the fan-out and fan-in pattern highlighted." />
      )}
      {slug === "visionary" && <GloveSchematic stage="match" />}
      {slug === "baseline" && <BaselineDag idPrefix={idPrefix} />}
      {slug === "osint" && (
        <div className="p-2">
          <OsintFlow />
        </div>
      )}
      <p className="label px-2 pb-1">{PREVIEW_CAPTION[slug]}</p>
    </div>
  );
}

export default function ProjectPreview({ slug, idPrefix }: { slug: ProjectSlug; idPrefix: string }) {
  if (slug === "signlink") return <SignLinkTrace />;
  if (slug === "bellwether") return <GateSummary compact />;
  return <DiagramPreview slug={slug} idPrefix={idPrefix} />;
}
