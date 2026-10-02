import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/content/types";
import { ProjectFacts } from "../../ProjectParts";

/** Field Notes project intro: entry number and facts in the margin, purpose in the text column. */
export default function NotesIntro({ project, entry }: { project: Project; entry: number }) {
  return (
    <header className="pb-12 pt-10 sm:pb-16 sm:pt-14">
      <Link href="/#work" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft aria-hidden className="h-4 w-4" /> All entries
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="order-2 lg:order-1 lg:col-span-3">
          <p className="font-mono text-xs text-ink">Entry {String(entry).padStart(2, "0")}</p>
          <ProjectFacts project={project} className="mt-4 border-t border-rule pt-4" />
        </aside>
        <div className="order-1 lg:order-2 lg:col-span-9">
          <h1 className="font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-ink">{project.outcome}</p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">{project.problem}</p>
        </div>
      </div>
    </header>
  );
}
