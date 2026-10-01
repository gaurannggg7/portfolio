import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECT_ORDER, featured } from "@/content/projects";
import { site } from "@/content/site";
import ProjectPreview, { PREVIEW_CAPTION } from "../../previews/ProjectPreview";
import MoreWork from "../../MoreWork";
import Experience from "../../Experience";
import About from "../../About";

const FIG_TITLE: Record<string, string> = {
  signlink: "A typed sentence traced to its sign clips",
  baseline: "The LangGraph topology after the parallel restructure",
  guardian: "Fan-out and fan-in through pass-through accounts",
  visionary: "Sensors, microcontroller, and the letter-matching chain",
};

/** Field Notes homepage: an engineering notebook with numbered entries and figures. */
export default function NotesHome() {
  return (
    <>
      <section aria-labelledby="hero-name" className="mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <p className="label lg:col-span-3 lg:pt-3">Field notes</p>
          <div className="lg:col-span-9">
            <h1 id="hero-name" className="font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-2 font-display text-2xl italic text-ink-2">{site.role}</p>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{site.intro}</p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <a href="#work" className="inline-flex min-h-11 items-center font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">
                Read the entries
              </a>
              <a href={site.resume} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                Resume (PDF)
              </a>
              <a href="#contact" className="inline-flex min-h-11 items-center text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                Contact
              </a>
            </p>

            <nav aria-labelledby="contents" className="mt-12 max-w-2xl">
              <h2 id="contents" className="label">
                Contents
              </h2>
              <ol className="mt-3 border-t border-ink">
                {PROJECT_ORDER.map((slug, i) => (
                  <li key={slug} className="border-b border-rule">
                    <a href={`#entry-${slug}`} className="group grid min-h-12 grid-cols-[4.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-2.5">
                      <span className="font-mono text-xs text-ink-3">Entry {String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-lg text-ink group-hover:text-accent">{featured[slug].name}</span>
                      <span className="font-mono text-xs text-ink-3">Fig. {i + 1}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <div id="work">
        {PROJECT_ORDER.map((slug, i) => {
          const p = featured[slug];
          const tradeoff = p.tradeoffs?.[0];
          const limitation = p.limitations?.[0];
          return (
            <article key={slug} id={`entry-${slug}`} aria-labelledby={`entry-${slug}-h`} className="border-t border-rule">
              <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-10">
                <aside className="space-y-1 font-mono text-xs leading-relaxed text-ink-3 lg:col-span-3">
                  <p className="text-ink">Entry {String(i + 1).padStart(2, "0")}</p>
                  {p.period && <p>{p.period}</p>}
                  {p.role && <p>{p.role}</p>}
                </aside>
                <div className="lg:col-span-9">
                  <h2 id={`entry-${slug}-h`} className="font-display text-4xl font-medium tracking-tight text-ink">
                    {p.name}
                  </h2>
                  <p className="mt-3 max-w-2xl font-display text-xl leading-snug text-ink">{p.outcome}</p>
                  <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-2">{p.problem}</p>

                  <figure className="mt-8">
                    <ProjectPreview slug={slug} idPrefix={`notes-${slug}`} />
                    <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                      <span className="font-mono text-xs text-ink">Fig. {i + 1}.</span> {FIG_TITLE[slug]}.{" "}
                      <span className="text-ink-3">{PREVIEW_CAPTION[slug]}.</span>
                    </figcaption>
                  </figure>

                  {(tradeoff || limitation || p.availability) && (
                    <dl className="mt-8 grid max-w-3xl gap-6 md:grid-cols-2">
                      {tradeoff && (
                        <div className="border-l-2 border-accent pl-4">
                          <dt className="font-display text-sm italic text-accent">Documented tradeoff</dt>
                          <dd className="mt-1 text-[15px] leading-relaxed text-ink-2">
                            <span className="font-medium text-ink">{tradeoff.title}.</span> {tradeoff.body}
                          </dd>
                        </div>
                      )}
                      {limitation && (
                        <div className="border-l-2 border-accent pl-4">
                          <dt className="font-display text-sm italic text-accent">Known limitation</dt>
                          <dd className="mt-1 text-[15px] leading-relaxed text-ink-2">{limitation}</dd>
                        </div>
                      )}
                      {!tradeoff && !limitation && p.availability && (
                        <div className="border-l-2 border-accent pl-4">
                          <dt className="font-display text-sm italic text-accent">Note on evidence</dt>
                          <dd className="mt-1 text-[15px] leading-relaxed text-ink-2">{p.availability}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <Link href={`/work/${slug}`} className="group mt-8 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink">
                    Read the full entry
                    <ArrowRight aria-hidden className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
                    <span className="sr-only">: {p.name}</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <MoreWork />
      <Experience />
      <About />
    </>
  );
}
