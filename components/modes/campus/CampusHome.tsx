import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECT_ORDER, featured } from "@/content/projects";
import { site } from "@/content/site";
import MoreWork from "../../MoreWork";
import Experience from "../../Experience";
import About from "../../About";
import { LOCATIONS, Plot } from "./Buildings";

/** Research Campus homepage: a small illustrated campus plus an ordinary directory. */
export default function CampusHome() {
  return (
    <>
      <section aria-labelledby="hero-name" className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <p className="font-pixel text-xs uppercase tracking-wide text-accent">Research Campus</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 id="hero-name" className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-2 text-lg text-ink-2">{site.role}</p>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">{site.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a href="#work" className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-[15px] font-medium text-bg shadow-panel">
              Visit the buildings <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-control border-2 border-ink bg-surface px-4 text-[15px] font-medium text-ink"
            >
              Resume <span className="sr-only">(PDF, opens in new tab)</span>
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
            <a href="#contact" className="inline-flex min-h-11 items-center px-2 text-[15px] font-medium text-ink underline underline-offset-4">
              Contact
            </a>
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="campus-map" className="border-y-2 border-ink">
        <h2 id="campus-map" className="sr-only">
          Campus buildings
        </h2>
        <ul className="grid grid-cols-2 gap-[2px] bg-ink lg:grid-cols-4">
          {PROJECT_ORDER.map((slug, i) => {
            const p = featured[slug];
            return (
              <li key={slug} className="bg-surface">
                <Link href={`/work/${slug}`} className="group block focus-visible:outline-offset-[-4px]">
                  <div className="aspect-[18/17] overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5">
                    <Plot slug={slug} tree={i % 2 ? "left" : "right"} />
                  </div>
                  <div className="border-t-2 border-ink bg-surface px-3 py-3 sm:px-4">
                    <p className="font-pixel text-[10px] uppercase leading-tight text-accent sm:text-[11px]">{LOCATIONS[slug].name}</p>
                    <p className="mt-1 flex items-center justify-between gap-2 font-semibold text-ink">
                      {p.name}
                      <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="directory" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 id="directory" className="font-pixel text-sm uppercase tracking-wide text-ink">
          Campus directory
        </h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {PROJECT_ORDER.map((slug) => {
            const p = featured[slug];
            return (
              <li key={slug} className="rounded-panel border-2 border-ink bg-surface p-5 shadow-panel">
                <p className="font-pixel text-[11px] uppercase text-accent">{LOCATIONS[slug].name}</p>
                <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-ink-3">{p.role}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.outcome}</p>
                <Link href={`/work/${slug}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink underline underline-offset-4">
                  Enter the {LOCATIONS[slug].name.toLowerCase()}
                  <span className="sr-only">: {p.name}</span>
                </Link>
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
