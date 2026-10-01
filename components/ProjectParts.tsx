import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectLink } from "@/content/types";
import { ProjectGlyph, projectColor } from "./PixelGlyph";

export function LinkRow({ links, className = "" }: { links: ProjectLink[]; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-1 ${className}`}>
      {links.map((link) => (
        <li key={link.href} className="flex flex-wrap items-baseline gap-x-2">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
          >
            {link.label}
            <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          {link.note && (
            <span className="text-sm text-ink-3">
              {link.note}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ProjectHeader({ project, index, kicker, headingId }: { project: Project; index: string; kicker: string; headingId: string }) {
  return (
    <header className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
          <span style={{ color: projectColor[project.slug] }}>{index}</span>
          <span aria-hidden className="h-px w-8 bg-rule-strong" />
          {kicker}
        </p>
        <h2 id={headingId} className="mt-4 flex items-center gap-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          <ProjectGlyph slug={project.slug} className="h-7 w-auto sm:h-8" />
          {project.name}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl">{project.summary}</p>
      </div>
      <dl className="self-end font-mono text-xs leading-relaxed text-ink-3 lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
        {project.period && (
          <div className="flex gap-2">
            <dt className="sr-only">Period</dt>
            <dd>{project.period}</dd>
          </div>
        )}
        {project.role && (
          <div>
            <dt className="sr-only">Role</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        <div className="mt-2">
          <dt className="sr-only">Stack</dt>
          <dd className="text-ink-2">{project.stack.join(" · ")}</dd>
        </div>
      </dl>
    </header>
  );
}

export function ProblemAndContribution({ project }: { project: Project }) {
  return (
    <div className="grid gap-8 border-t border-rule pt-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">The problem</h3>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">{project.problem}</p>
        {project.availability && <p className="mt-4 text-[15px] leading-relaxed text-ink-3">{project.availability}</p>}
      </div>
      <div className="lg:col-span-7">
        {project.contribution ? (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">What I did</h3>
            <ul className="mt-3 space-y-2.5">
              {project.contribution.map((c) => (
                <li key={c} className="flex gap-3 text-[16px] leading-relaxed text-ink-2">
                  <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0" style={{ background: projectColor[project.slug] }} />
                  {c}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">How it works</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{project.howItWorks}</p>
          </>
        )}
      </div>
    </div>
  );
}

/** Tradeoffs, limitations, and results — rendered only where documented. */
export function Evidence({ project }: { project: Project }) {
  const hasNotes = project.tradeoffs?.length || project.limitations?.length;
  return (
    <div className="grid gap-10 border-t border-rule pt-8 lg:grid-cols-12">
      {hasNotes ? (
        <div className="space-y-8 lg:col-span-7">
          {project.tradeoffs?.length ? (
            <section>
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Tradeoffs</h3>
              <dl className="mt-3 space-y-4">
                {project.tradeoffs.map((t) => (
                  <div key={t.title}>
                    <dt className="font-semibold text-ink">{t.title}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-ink-2">{t.body}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {project.limitations?.length ? (
            <section>
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Known limitations</h3>
              <ul className="mt-3 space-y-2">
                {project.limitations.map((l) => (
                  <li key={l} className="border-l-2 border-rule-strong pl-3 text-[15px] leading-relaxed text-ink-2">
                    {l}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
      <div className={`space-y-8 ${hasNotes ? "lg:col-span-5" : "lg:col-span-12"}`}>
        {project.results?.length ? (
          <section>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Results, with context</h3>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {project.results.map((r) => (
                <div key={r.value} className="py-3">
                  <dt className="text-2xl font-semibold tracking-tight text-ink">{r.value}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-3">{r.context}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </div>
  );
}
