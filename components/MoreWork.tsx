import { ArrowUpRight } from "lucide-react";
import { moreProjects } from "@/content/projects";

export default function MoreWork() {
  return (
    <section aria-labelledby="more-heading" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
      <h2 id="more-heading" className="label">
        Also
      </h2>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {moreProjects.map((p) => (
          <li key={p.name} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <h3 className="font-medium text-ink">{p.name}</h3>
              <p className="mt-0.5 text-sm text-ink-3">{p.context}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-ink-2 md:col-span-6">{p.summary}</p>
            <div className="md:col-span-2 md:text-right">
              {p.links.length ? (
                <ul className="flex flex-wrap gap-x-4 md:flex-col md:items-end">
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
                </ul>
              ) : p.anchor ? (
                <a href={p.anchor} className="inline-flex min-h-10 items-center text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink">
                  See experience
                </a>
              ) : (
                <p className="text-sm text-ink-3 md:pt-2">Code not public</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
