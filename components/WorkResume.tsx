import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { PROJECT_ORDER, featured } from "@/content/projects";
import { site } from "@/content/site";
import MoreWork from "./MoreWork";
import Experience from "./Experience";
import About from "./About";

/** Quick-scan view: every project, experience, and the résumé on one plain page. */
export default function WorkResume() {
  return (
    <>
      <section aria-labelledby="wr-h" className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <p className="label">Quick scan</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 id="wr-h" className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Work &amp; résumé
          </h1>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-[15px] font-medium text-bg hover:opacity-90"
          >
            <Download aria-hidden className="h-4 w-4" /> Résumé (PDF)
          </a>
        </div>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-2">
          {site.name} · {site.role}. {site.intro}
        </p>
      </section>

      <section id="work" aria-labelledby="wr-projects" className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <h2 id="wr-projects" className="label">
          Projects
        </h2>
        <ol className="mt-3 divide-y divide-rule border-y border-ink">
          {PROJECT_ORDER.map((slug, i) => {
            const p = featured[slug];
            return (
              <li key={slug} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-3">
                  <p className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-3">{p.role}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-[15px] leading-relaxed text-ink-2">{p.outcome}</p>
                  <p className="mt-1.5 font-mono text-xs text-ink-3">{p.stack.join(" · ")}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 md:col-span-3 md:flex-col md:items-end">
                  <Link href={`/work/${slug}`} className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                    Case study <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                  {p.links[0] && (
                    <a href={p.links[0].href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink">
                      {p.links[0].label} <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <MoreWork />
      <Experience />
      <About />
    </>
  );
}
