import { ArrowUpRight } from "lucide-react";
import { earlierRoles, roles } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 border-t border-rule bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 id="experience-heading" className="text-3xl font-semibold tracking-tight text-ink lg:col-span-3">
            Experience
          </h2>
          <ol className="lg:col-span-9">
            {roles.map((r) => (
              <li key={`${r.org}-${r.role}`} className="grid gap-2 border-t border-rule py-7 first:border-t-ink sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <p className="font-mono text-xs leading-6 text-ink-3">{r.period}</p>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{r.role}</h3>
                  <p className="text-[15px] text-ink-2">
                    {r.org}
                    {r.location ? ` · ${r.location}` : ""}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {r.points.map((pt) => (
                      <li key={pt} className="text-[15px] leading-relaxed text-ink-2">
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {r.project && (
                    <a
                      href={r.project.href}
                      className="mt-3 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                    >
                      {r.project.label}
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3 lg:col-span-3 lg:pt-1">
            Earlier and campus roles
          </h3>
          <ul className="divide-y divide-rule border-y border-rule lg:col-span-9">
            {earlierRoles.map((r) => (
              <li key={`${r.org}-${r.role}`} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <p className="font-mono text-xs leading-6 text-ink-3">{r.period}</p>
                <p className="text-[15px] leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">{r.role}</span>, {r.org}. {r.points[0]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
