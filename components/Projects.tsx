import { ArrowUpRight } from "lucide-react";
import { guardian, moreProjects, signlink, visionary } from "@/content/projects";
import { Evidence, LinkRow, ProblemAndContribution, ProjectHeader } from "./ProjectParts";
import PipelineExplorer from "./PipelineExplorer";
import SignLinkLab from "./signlink/SignLinkLab";
import TransactionGraph from "./guardian/TransactionGraph";
import VisionaryLab from "./visionary/VisionaryLab";

export function SignLinkSection() {
  return (
    <section id="signlink" data-project="signlink" aria-labelledby="signlink-title" className="scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <ProjectHeader project={signlink} index="01" kicker="Flagship · accessibility AI" headingId="signlink-title" />
        <LinkRow links={signlink.links} className="-mt-6" />
        <ProblemAndContribution project={signlink} />
        <SignLinkLab />
        <Evidence project={signlink} />
      </div>
    </section>
  );
}

export function GuardianSection() {
  return (
    <section
      id="guardian"
      data-project="guardian"
      aria-labelledby="guardian-title"
      className="scroll-mt-16 border-t border-rule bg-surface-2/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <ProjectHeader project={guardian} index="02" kicker="Graph ML · fraud detection" headingId="guardian-title" />
        <ProblemAndContribution project={guardian} />
        <section aria-labelledby="guardian-example-heading">
          <h3 id="guardian-example-heading" className="mb-2 text-2xl font-semibold tracking-tight text-ink">
            What the pattern looks like
          </h3>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            A tiny made-up network showing the kind of structure GuardianAI is built to catch.
          </p>
          <TransactionGraph />
        </section>
        <section aria-labelledby="guardian-arch-heading">
          <h3 id="guardian-arch-heading" className="mb-2 text-2xl font-semibold tracking-tight text-ink">
            Architecture
          </h3>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            The four stages of the system, as documented. Select a stage to see its inputs, processing, and outputs.
          </p>
          <PipelineExplorer stages={guardian.stages} label="GuardianAI pipeline stages" accent="guardian" />
        </section>
      </div>
    </section>
  );
}

export function VisionarySection() {
  return (
    <section id="visionary" data-project="visionary" aria-labelledby="visionary-title" className="scroll-mt-16 border-t border-rule py-16 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <ProjectHeader project={visionary} index="03" kicker="Embedded systems · wearable" headingId="visionary-title" />
        <LinkRow links={visionary.links} className="-mt-6" />
        <ProblemAndContribution project={visionary} />
        <div className="border-t border-rule pt-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">How it works</h3>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-ink">{visionary.howItWorks}</p>
        </div>
        <VisionaryLab />
        <Evidence project={visionary} />
      </div>
    </section>
  );
}

export function MoreProjects() {
  return (
    <section id="more-work" aria-labelledby="more-heading" className="border-t border-rule py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="more-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          More work
        </h2>
        <ul className="mt-8 border-t border-ink">
          {moreProjects.map((p) => (
            <li key={p.name} className="grid gap-3 border-b border-rule py-6 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{p.name}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-ink-3">{p.context}</p>
              </div>
              <div className="md:col-span-6">
                <p className="text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
                <p className="mt-2 font-mono text-xs text-ink-3">{p.stack.join(" · ")}</p>
              </div>
              <div className="md:col-span-2 md:text-right">
                {p.links.length ? (
                  <ul className="flex flex-wrap gap-x-4 md:flex-col md:items-end">
                    {p.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                        >
                          {l.label}
                          <ArrowUpRight aria-hidden className="h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : p.anchor ? (
                  <a
                    href={p.anchor}
                    className="inline-flex min-h-11 items-center text-[15px] text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink"
                  >
                    See experience
                  </a>
                ) : (
                  <p className="pt-1 text-sm text-ink-3 md:pt-3">Code not public</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
