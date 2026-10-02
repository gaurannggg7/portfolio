"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { annotations } from "@/content/notes-annotations";
import { FEATURED, featured } from "@/content/projects";
import { resume, site } from "@/content/site";
import type { ProjectSlug } from "@/content/types";
import { useTabKeys } from "../../useTabKeys";
import { SignLinkTrace } from "../../previews/ProjectPreview";
import NetworkDiagram from "../../guardian/NetworkDiagram";
import GloveSchematic from "../../visionary/GloveSchematic";
import BaselineDag from "../../baseline/BaselineDag";
import GateSummary from "../../bellwether/GateSummary";
import OsintFlow from "../../osint/OsintFlow";

type Tab = "index" | ProjectSlug;
const TABS: Tab[] = ["index", ...FEATURED];

function Figure({ slug }: { slug: ProjectSlug }) {
  if (slug === "signlink") return <SignLinkTrace />;
  if (slug === "guardian") return <NetworkDiagram idPrefix="notes-fig" showPattern label="Synthetic transaction network with the pattern highlighted." />;
  if (slug === "visionary") return <GloveSchematic stage="match" />;
  if (slug === "bellwether")
    return (
      <div className="pr-9">
        <GateSummary compact />
      </div>
    );
  if (slug === "osint") return <OsintFlow vertical />;
  return <BaselineDag idPrefix="notes-fig" />;
}

/** One project sheet: entry and documented decisions on the left, the annotated figure on the right. */
function Sheet({ slug }: { slug: ProjectSlug }) {
  const [active, setActive] = useState<number | null>(null);
  const p = featured[slug];
  const a = annotations[slug];
  const n = FEATURED.indexOf(slug) + 1;
  return (
    <>
      <div className="nb-page min-w-0 p-6 sm:p-8">
        <p className="font-mono text-xs text-ink-3">
          Entry {String(n).padStart(2, "0")}
          {p.period ? ` · ${p.period}` : ""}
        </p>
        <h2 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">{p.name}</h2>
        <p className="mt-1 font-display text-lg italic text-ink-2">{p.role}</p>
        <p className="mt-4 font-display text-xl leading-snug text-ink">{p.outcome}</p>
        <h3 className="mt-6 font-display text-sm italic text-accent">Documented decisions, keyed to Fig. {n}</h3>
        <ol className="mt-2 space-y-1">
          {a.notes.map((note, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`grid w-full grid-cols-[1.75rem_minmax(0,1fr)] gap-2 rounded-control px-1.5 py-2 text-left transition-colors ${active === i ? "bg-accent-soft" : ""}`}
              >
                <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] ${active === i ? "border-accent bg-accent text-on-accent" : "border-accent text-accent"}`}>
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-2">
                  {note.text} <span className="font-mono text-[11px] text-ink-3">· {note.source}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/work/${slug}#demo`} className="inline-flex min-h-11 items-center gap-1.5 rounded-control bg-ink px-4 text-sm font-medium text-bg hover:opacity-90">
            Open the exhibit <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <Link href={`/work/${slug}`} className="inline-flex min-h-11 items-center rounded-control border border-ink px-4 text-sm font-medium text-ink">
            Case study
          </Link>
        </div>
      </div>
      <div className="nb-page min-w-0 p-6 sm:p-8">
        <figure>
          <div className="relative">
            <Figure slug={slug} />
            {a.notes.map((note, i) => (
              <span
                key={i}
                aria-hidden
                className={`pointer-events-none absolute flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold shadow-sm transition-transform ${
                  active === i ? "scale-125 border-accent bg-accent text-on-accent" : "border-accent bg-surface text-accent"
                }`}
                style={{ left: `${note.at[0]}%`, top: `${note.at[1]}%`, translate: "-50% -50%" }}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <figcaption className="mt-4 text-sm leading-relaxed text-ink-2">
            <span className="font-mono text-xs text-ink">Fig. {n}.</span> {a.figure}. <span className="text-ink-3">{a.caption}</span>
          </figcaption>
        </figure>
      </div>
    </>
  );
}

function IndexSheet({ open }: { open: (t: Tab) => void }) {
  return (
    <>
      <div className="nb-page min-w-0 p-6 sm:p-8">
        <p className="font-mono text-xs text-ink-3">Index</p>
        <h2 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">Project sheets</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          Each sheet holds one project: what it does, my role, a figure from the real system, and the engineering decisions its
          repository documents. Numbered marks on each figure point to those decisions.
        </p>
        <ol className="mt-6 border-t border-ink">
          {FEATURED.map((slug, i) => (
            <li key={slug} className="border-b border-rule">
              <button type="button" onClick={() => open(slug)} className="group grid min-h-12 w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-2.5 text-left">
                <span className="font-mono text-xs text-ink-3">Entry {String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg text-ink group-hover:text-accent">{featured[slug].name}</span>
                <span className="font-mono text-xs text-ink-3">Fig. {i + 1}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="nb-page min-w-0 p-6 sm:p-8">
        <p className="font-display text-sm italic text-accent">The sheets, at a glance</p>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {FEATURED.map((slug, i) => (
            <li key={slug}>
              <button
                type="button"
                onClick={() => open(slug)}
                className="group block w-full rounded-panel border border-rule bg-surface p-2 text-left transition-transform hover:-translate-y-0.5 hover:rotate-[-0.6deg] focus-visible:-translate-y-0.5"
              >
                <div className="pointer-events-none max-h-28 overflow-hidden" aria-hidden>
                  {slug === "signlink" || slug === "bellwether" || slug === "osint" ? (
                    <div className="origin-top-left scale-[0.5] w-[200%]">
                      {slug === "signlink" ? <SignLinkTrace /> : <Figure slug={slug} />}
                    </div>
                  ) : (
                    <Figure slug={slug} />
                  )}
                </div>
                <span className="mt-1 block font-mono text-[11px] text-ink-3">Fig. {i + 1}</span>
                <span className="block font-display text-base text-ink group-hover:text-accent">{featured[slug].name}</span>
              </button>
            </li>
          ))}
          <li>
            <a
              href="#all-projects"
              className="group flex h-full min-h-32 w-full flex-col justify-end rounded-panel border border-dashed border-rule-strong p-3 text-left hover:border-ink"
            >
              <span className="font-mono text-[11px] text-ink-3">Appendix</span>
              <span className="block font-display text-base text-ink group-hover:text-accent">All projects</span>
              <span className="text-xs text-ink-3">GuardianAI, credit risk, SpaceHACK, and client work</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

/** Field Notes: an open notebook on the desk, with a tab for each project sheet. */
export default function NotesDesk() {
  const uid = useId();
  const [tab, setTab] = useState<Tab>("index");
  const index = TABS.indexOf(tab);
  const { setRef, onKeyDown } = useTabKeys(TABS.length, index, (i) => setTab(TABS[i]));
  const label = (t: Tab) => (t === "index" ? "Index" : (featured[t].short ?? featured[t].name));

  return (
    <section aria-labelledby="hero-name" className="nb-desk">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Field notes</p>
            <h1 id="hero-name" className="mt-1 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-2 max-w-xl font-display text-2xl italic leading-snug text-ink-2">{site.focus}</p>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-ink-2">Pick a tab to open a project sheet. Select a decision to find its mark on the figure.</p>
            <div className="mt-2 flex flex-wrap gap-x-5">
              <a href={resume.pdf} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">
                Résumé (PDF) <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
              <Link href="/work" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink underline decoration-rule-strong underline-offset-4">
                Work &amp; résumé page
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="nb-surface pt-8">
      <div id="work" className="mx-auto max-w-6xl px-3 pb-16 sm:px-8">
        {/* Tabs: a strip on small screens, page-edge tabs on large screens */}
        <div className="relative lg:pr-40">
          <div
            role="tablist"
            aria-label="Project sheets"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="mb-2 flex flex-wrap gap-1 pb-1 lg:flex-nowrap lg:absolute lg:right-0 lg:top-10 lg:mb-0 lg:w-40 lg:flex-col lg:overflow-visible"
          >
            {TABS.map((t, i) => {
              const on = t === tab;
              return (
                <button
                  key={t}
                  ref={setRef(i)}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${t}`}
                  aria-selected={on}
                  aria-controls={`${uid}-sheet`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(t)}
                  className={`nb-tab shrink-0 whitespace-nowrap px-3 py-2.5 text-left text-sm transition-[transform,background-color] lg:rounded-r-md lg:rounded-l-none ${
                    on ? "nb-tab-on font-medium text-ink lg:translate-x-0" : "text-ink-2 hover:text-ink lg:-translate-x-2"
                  }`}
                >
                  <span className="mr-1.5 font-mono text-[10px] text-ink-3">{i === 0 ? "—" : String(i).padStart(2, "0")}</span>
                  {label(t)}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${uid}-sheet`}
            aria-labelledby={`${uid}-tab-${tab}`}
            key={tab}
            className="nb-book nb-turn grid lg:grid-cols-2"
          >
            {tab === "index" ? <IndexSheet open={setTab} /> : <Sheet slug={tab} />}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
