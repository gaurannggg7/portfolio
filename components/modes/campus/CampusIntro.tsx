import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/content/types";
import { ProjectFacts } from "../../ProjectParts";
import { LOCATIONS, Plot } from "./Buildings";

/** Research Campus project intro: the building, then the same project facts. */
export default function CampusIntro({ project }: { project: Project }) {
  return (
    <header className="pb-12 pt-8 sm:pb-16">
      <Link href="/#work" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft aria-hidden className="h-4 w-4" /> Campus map
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="aspect-[18/17] overflow-hidden border-2 border-ink shadow-panel">
            <Plot slug={project.slug} />
          </div>
          <p className="mt-2 font-pixel text-[11px] uppercase text-accent">{LOCATIONS[project.slug].name}</p>
        </div>
        <div className="lg:col-span-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-xl leading-snug text-ink">{project.outcome}</p>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">{project.problem}</p>
          <ProjectFacts project={project} className="mt-8 rounded-panel border-2 border-ink bg-surface p-5 shadow-panel sm:grid-cols-2" />
        </div>
      </div>
    </header>
  );
}
