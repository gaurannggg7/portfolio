import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { baseline, bellwether, osint, signlink, visionary } from "@/content/projects";
import type { Project } from "@/content/types";
import { DiagramPreview, SignLinkTrace } from "../../previews/ProjectPreview";
import GateSummary from "../../bellwether/GateSummary";

function Meta({ project, index, proof }: { project: Project; index: string; proof?: React.ReactNode }) {
  const external = project.links.filter((l) => l.kind === "live" || l.kind === "repo");
  return (
    <>
      <p className="label">
        {index} · {project.role}
        {project.period ? ` · ${project.period}` : ""}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">{project.outcome}</p>
      {proof && <p className="mt-4 max-w-md border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink-2">{proof}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-x-5">
        <Link href={`/work/${project.slug}`} className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink">
          Case study
          <ArrowRight aria-hidden className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
          <span className="sr-only">: {project.name}</span>
        </Link>
        {external.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink">
            {l.label} <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            <span className="sr-only">: {project.name}</span>
          </a>
        ))}
      </div>
    </>
  );
}

/** Systems Lab: the five featured projects as an ordinary list, flagship first. */
export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-rule">
      <div id="selected-work" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Featured work
          </h2>
          <a href="#all-projects" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
            All projects
          </a>
        </div>

        <article className="mt-10 grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Meta
              project={bellwether}
              index="01"
              proof={<>Urgent recall held at <span className="font-mono text-ink">1.0</span> while hard-gate failures doubled, so the gate blocked the prompt change. Synthetic scenarios, mock runs.</>}
            />
          </div>
          <div className="lg:col-span-7">
            <GateSummary />
          </div>
        </article>

        <article className="mt-14 grid gap-8 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:order-2 lg:col-span-5 lg:col-start-8">
            <Meta
              project={osint}
              index="02"
              proof={<>Recall@10 of <span className="font-mono text-ink">0.529</span> (hybrid) vs <span className="font-mono text-ink">0.471</span> (vector) on 17 queries; hybrid never beat the better single method.</>}
            />
          </div>
          <div className="lg:order-1 lg:col-span-7">
            <DiagramPreview slug="osint" idPrefix="lab-osint" />
          </div>
        </article>

        <article className="mt-14 grid gap-8 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Meta
              project={baseline}
              index="03"
              proof={<><span className="font-mono text-ink">62% → 100%</span> structured-error pass rate on a 29-file adversarial CSV corpus (27 run).</>}
            />
          </div>
          <div className="lg:col-span-7">
            <DiagramPreview slug="baseline" idPrefix="lab-baseline" />
          </div>
        </article>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
          <article className="flex flex-col border-t border-rule pt-8">
            <SignLinkTrace />
            <div className="mt-6">
              <Meta project={signlink} index="04" />
            </div>
          </article>
          <article className="flex flex-col border-t border-rule pt-8">
            <DiagramPreview slug="visionary" idPrefix="lab-visionary" />
            <div className="mt-6">
              <Meta project={visionary} index="05" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
