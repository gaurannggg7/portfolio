import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { baseline, guardian, signlink, visionary } from "@/content/projects";
import type { Project } from "@/content/types";
import { DiagramPreview, SignLinkTrace } from "../../previews/ProjectPreview";

function Meta({ project, index }: { project: Project; index: string }) {
  return (
    <>
      <p className="label">
        {index} · {project.role}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{project.name}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">{project.outcome}</p>
      <Link href={`/work/${project.slug}`} className="group mt-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink">
        Explore project
        <ArrowRight aria-hidden className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only">: {project.name}</span>
      </Link>
    </>
  );
}

/** Systems Lab: flagship, a reversed feature, then two supporting projects. */
export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Selected work
          </h2>
          <p className="label hidden sm:block">4 projects</p>
        </div>

        <article className="mt-10 grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Meta project={signlink} index="01" />
          </div>
          <div className="lg:col-span-8">
            <SignLinkTrace />
          </div>
        </article>

        <article className="mt-14 grid gap-8 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:order-2 lg:col-span-4 lg:col-start-9">
            <Meta project={baseline} index="02" />
            <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink-2">
              <span className="font-mono text-ink">62% → 100%</span> structured-error pass rate on a 29-case adversarial CSV corpus.
            </p>
          </div>
          <div className="lg:order-1 lg:col-span-8">
            <DiagramPreview slug="baseline" idPrefix="lab-baseline" />
          </div>
        </article>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
          {([guardian, visionary] as const).map((p, i) => (
            <article key={p.slug} className="flex flex-col border-t border-rule pt-8">
              <DiagramPreview slug={p.slug as "guardian" | "visionary"} idPrefix={`lab-${p.slug}`} />
              <div className="mt-6">
                <Meta project={p} index={String(i + 3).padStart(2, "0")} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
