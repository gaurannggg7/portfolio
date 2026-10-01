import Link from "next/link";
import { earlierRoles, roles } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <h2 id="experience-heading" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:col-span-3">
          Experience
        </h2>
        <div className="lg:col-span-9">
          <ol className="divide-y divide-rule border-y border-rule">
            {roles.map((r) => (
              <li key={`${r.org}-${r.role}`} className="grid gap-2 py-6 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
                <p className="font-mono text-xs leading-6 text-ink-3">{r.period}</p>
                <div>
                  <h3 className="font-semibold text-ink">
                    {r.role} <span className="font-normal text-ink-2">· {r.org}</span>
                  </h3>
                  <ul className="mt-2 max-w-2xl space-y-1.5">
                    {r.points.slice(0, 2).map((pt) => (
                      <li key={pt} className="text-[15px] leading-relaxed text-ink-2">
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {r.project && (
                    <Link
                      href={r.project.href}
                      className="mt-2 inline-flex min-h-10 items-center text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                    >
                      {r.project.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <h3 className="label mt-8">Earlier and campus roles</h3>
          <ul className="mt-2 space-y-2">
            {earlierRoles.map((r) => (
              <li key={`${r.org}-${r.role}`} className="grid gap-1 text-sm sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
                <span className="font-mono text-xs leading-5 text-ink-3">{r.period}</span>
                <span className="text-ink-2">
                  <span className="text-ink">{r.role}</span>, {r.org}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
