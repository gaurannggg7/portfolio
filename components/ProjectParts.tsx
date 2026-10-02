import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { EvidenceKind, Project, ProjectLink } from "@/content/types";
import Section from "./project/Section";

export function LinkList({ links }: { links: ProjectLink[] }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-12 flex-col justify-center gap-0.5 py-2"
          >
            <span className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
              {link.label}
              <ArrowUpRight aria-hidden className="h-4 w-4 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            {link.note && <span className="text-sm text-ink-3">{link.note}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Project facts shared by every view's intro. */
export function ProjectFacts({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <dl className={`grid content-start gap-4 text-sm ${className}`}>
      {project.role && (
        <div>
          <dt className="label">Role</dt>
          <dd className="mt-1 text-ink">{project.role}</dd>
        </div>
      )}
      {project.period && (
        <div>
          <dt className="label">Period</dt>
          <dd className="mt-1 text-ink">{project.period}</dd>
        </div>
      )}
      {project.model && (
        <div>
          <dt className="label">Model</dt>
          <dd className="mt-1 text-ink">{project.model.current}</dd>
          <dd className="mt-0.5 leading-relaxed text-ink-3">
            Evaluated on {project.model.evaluated}. {project.model.note}
          </dd>
        </div>
      )}
      <div>
        <dt className="label">Stack</dt>
        <dd className="mt-1 leading-relaxed text-ink-2">{project.stack.join(", ")}</dd>
      </div>
      {project.links.length > 0 ? (
        <div>
          <dt className="label">Links</dt>
          <dd className="mt-1 flex flex-wrap gap-x-4">
            {project.links.slice(0, 2).map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1 font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
              >
                {l.label} <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            ))}
          </dd>
        </div>
      ) : (
        project.availability && (
          <div>
            <dt className="label">Availability</dt>
            <dd className="mt-1 leading-relaxed text-ink-2">{project.availability}</dd>
          </div>
        )
      )}
    </dl>
  );
}

/** Systems Lab title block: purpose first, then role, period, stack, and primary links. */
export function ProjectIntro({ project, kicker }: { project: Project; kicker: string }) {
  return (
    <header className="pb-12 pt-10 sm:pb-16 sm:pt-14">
      <Link
        href="/#work"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-ink"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" /> All work
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <p className="label">{kicker}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-xl leading-snug text-ink">{project.outcome}</p>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">{project.problem}</p>
        </div>
        <ProjectFacts project={project} className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8" />
      </div>
    </header>
  );
}

export function ContributionSection({ project, index }: { project: Project; index: string }) {
  if (project.contribution) {
    return (
      <Section id="contribution" index={index} title="My contribution">
        <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          {project.contribution.map((c) => (
            <li key={c} className="border-t border-rule pt-3 text-[15px] leading-relaxed text-ink-2">
              {c}
            </li>
          ))}
        </ul>
      </Section>
    );
  }
  return (
    <Section id="approach" index={index} title="Approach">
      <p className="max-w-2xl text-[16px] leading-relaxed text-ink-2">{project.howItWorks}</p>
    </Section>
  );
}

/** Rendered only when the project documents tradeoffs, limitations, or results. */
export function DecisionsSection({ project, index, extra }: { project: Project; index: string; extra?: React.ReactNode }) {
  if (!project.tradeoffs?.length && !project.limitations?.length && !project.results?.length) return null;
  return (
    <Section id="decisions" index={index} title="Decisions and limitations">
      {extra && <div className="mb-10">{extra}</div>}
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          {project.tradeoffs?.length ? (
            <div>
              <h3 className="label">Decisions</h3>
              <dl className="mt-3 space-y-5">
                {project.tradeoffs.map((t) => (
                  <div key={t.title}>
                    <dt className="font-medium text-ink">{t.title}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-ink-2">{t.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {project.limitations?.length ? (
            <div>
              <h3 className="label">Limitations</h3>
              <ul className="mt-3 space-y-3">
                {project.limitations.map((l) => (
                  <li key={l} className="border-l-2 border-rule-strong pl-3 text-[15px] leading-relaxed text-ink-2">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {project.results?.length ? (
          <div>
            <h3 className="label">Results, with context</h3>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {project.results.map((r) => (
                <div key={r.value} className="py-4">
                  <dt className="text-2xl font-semibold tracking-tight text-ink">{r.value}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-3">{r.context}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export function LinksSection({ project, index }: { project: Project; index: string }) {
  const sources = Array.from(
    new Map(project.stages.flatMap((s) => (s.source ? [[s.source.href, s.source] as const] : []))).values(),
  );
  if (!project.links.length && !sources.length) return null;
  return (
    <Section id="links" index={index} title="Source and links">
      <div className="grid gap-10 md:grid-cols-2">
        {project.links.length > 0 && (
          <div>
            <h3 className="label mb-2">Project</h3>
            <LinkList links={project.links} />
          </div>
        )}
        {sources.length > 0 && (
          <div>
            <h3 className="label mb-2">Source files</h3>
            <LinkList links={sources.map((s) => ({ label: s.label, href: s.href, kind: "repo" as const }))} />
          </div>
        )}
      </div>
    </Section>
  );
}

export function ProjectPager({ prev, next, noun = "" }: { prev: Project; next: Project; noun?: string }) {
  return (
    <nav aria-label="More projects" className="grid border-t border-rule sm:grid-cols-2">
      <Link href={`/work/${prev.slug}`} className="group flex min-h-24 flex-col justify-center gap-1 py-6 sm:pr-6">
        <span className="label inline-flex items-center gap-1">
          <ArrowLeft aria-hidden className="h-3 w-3" /> Previous{noun && ` ${noun}`}
        </span>
        <span className="text-lg font-semibold tracking-tight text-ink group-hover:text-accent">{prev.name}</span>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className="group flex min-h-24 flex-col justify-center gap-1 border-t border-rule py-6 sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:text-right"
      >
        <span className="label inline-flex items-center gap-1">
          Next{noun && ` ${noun}`} <ArrowRight aria-hidden className="h-3 w-3" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-ink group-hover:text-accent">{next.name}</span>
      </Link>
    </nav>
  );
}

const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  measured: "Measured",
  implemented: "In the code",
  demonstration: "Demonstration",
  "not-measured": "Not measured",
};

/** What each headline claim rests on, so an engineer can check it. */
export function EvidenceLedger({ project, index }: { project: Project; index: string }) {
  if (!project.evidence?.length) return null;
  return (
    <Section id="evidence" index={index} title="Evidence" intro="Each claim on this page, what kind of evidence backs it, and where to check it.">
      <ul className="divide-y divide-rule border-y border-rule">
        {project.evidence.map((e) => (
          <li key={e.claim} className="grid gap-1 py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4">
            <span
              className={`font-mono text-[11px] uppercase tracking-wide ${
                e.kind === "measured" ? "text-accent" : e.kind === "not-measured" ? "text-fail" : "text-ink-3"
              }`}
            >
              {EVIDENCE_LABEL[e.kind]}
            </span>
            <span className="text-[15px] leading-relaxed text-ink">{e.claim}</span>
            {e.source ? (
              <a
                href={e.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1 font-mono text-xs text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink"
              >
                {e.source.label} <ArrowUpRight aria-hidden className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-xs text-ink-3">No evidence yet</span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
