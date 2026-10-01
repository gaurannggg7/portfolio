import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guardian, signlink, visionary } from "@/content/projects";
import { methodLabel, signExamples } from "@/content/signlink-examples";
import type { Project } from "@/content/types";
import NetworkDiagram from "./guardian/NetworkDiagram";
import GloveSchematic from "./visionary/GloveSchematic";

function Meta({ project, index }: { project: Project; index: string }) {
  return (
    <>
      <p className="label">
        {index} · {project.role}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">{project.outcome}</p>
      <Link
        href={`/work/${project.slug}`}
        className="group mt-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink"
      >
        Explore project
        <ArrowRight aria-hidden className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only">: {project.name}</span>
      </Link>
    </>
  );
}

/** SignLink preview: the fingerspelling example as a transcript → gloss → clip trace. */
function SignLinkTrace() {
  const ex = signExamples[2];
  const clips = ex.resolutions.flatMap((r) => r.clips.map((c) => ({ ...c, method: r.method })));
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
              className={`flex h-20 flex-col justify-between rounded-md border p-1.5 sm:h-24 ${
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

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Selected work
          </h2>
          <p className="label hidden sm:block">3 projects</p>
        </div>

        {/* Flagship */}
        <article className="mt-10 grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Meta project={signlink} index="01" />
          </div>
          <div className="lg:col-span-8">
            <SignLinkTrace />
          </div>
        </article>

        {/* Supporting projects */}
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
          <article className="flex flex-col border-t border-rule pt-8">
            <div className="rounded-xl border border-rule bg-surface p-2 sm:p-3">
              <NetworkDiagram idPrefix="preview" showPattern label="Synthetic transaction network with the fan-out and fan-in pattern highlighted." />
              <p className="label px-2 pb-1">Synthetic data · illustrative</p>
            </div>
            <div className="mt-6">
              <Meta project={guardian} index="02" />
            </div>
          </article>
          <article className="flex flex-col border-t border-rule pt-8">
            <div className="rounded-xl border border-rule bg-surface p-2 sm:p-3">
              <GloveSchematic stage="match" />
              <p className="label px-2 pb-1">Schematic from firmware · not to scale</p>
            </div>
            <div className="mt-6">
              <Meta project={visionary} index="03" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
