import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { moreProjects } from "@/content/projects";

/** The "All projects" catalog: work beyond the five featured projects. */
export default function MoreWork({ heading = "All projects", id = "all-projects" }: { heading?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16 sm:px-8 sm:pb-20">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${id}-h`} className="label">
          {heading}
        </h2>
        <p className="text-xs text-ink-3">Beyond the five featured projects</p>
      </div>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {moreProjects.map((p) => (
          <li key={p.name} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <h3 className="font-medium text-ink">{p.name}</h3>
              <p className="mt-0.5 text-sm text-ink-3">{p.context}</p>
            </div>
            <div className="md:col-span-6">
              <p className="text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
              <p className="mt-1.5 font-mono text-xs text-ink-3">{p.stack.join(" · ")}</p>
            </div>
            <ul className="flex flex-wrap gap-x-4 md:col-span-2 md:flex-col md:items-end">
              {p.href && (
                <li>
                  <Link href={p.href} className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                    Case study <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                </li>
              )}
              {p.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                  >
                    {l.label}
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
              {!p.href && !p.links.length && p.anchor && (
                <li>
                  <a href={`/work${p.anchor}`} className="inline-flex min-h-10 items-center text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink">
                    See experience
                  </a>
                </li>
              )}
              {!p.links.length && <li className="py-2 text-sm text-ink-3">No public code</li>}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
