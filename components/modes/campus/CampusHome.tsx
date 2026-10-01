import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECT_ORDER, featured } from "@/content/projects";
import { site } from "@/content/site";
import MoreWork from "../../MoreWork";
import Experience from "../../Experience";
import About from "../../About";
import { LOCATIONS } from "./Buildings";
import CampusMap from "./CampusMap";
import CampusPlayable from "../../campus-game/CampusPlayable";

/** Research Campus homepage: a designed campus map plus an ordinary directory. */
export default function CampusHome() {
  return (
    <>
      <section aria-labelledby="hero-name" className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-pixel text-xs uppercase tracking-wide text-accent">Research Campus</p>
            <h1 id="hero-name" className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-2 text-lg text-ink-2">{site.role}</p>
          </div>
          <div className="lg:col-span-5">
            <p className="rounded-panel border-2 border-ink bg-surface p-4 text-[15px] leading-relaxed text-ink-2 shadow-panel">
              <span className="font-pixel text-[11px] uppercase text-accent">How to visit</span>
              <br />
              Walk around with the arrow keys, WASD, or the on-screen pad, and press E at a door. Every building is also listed in the
              directory below, so you never have to walk.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/work" className="inline-flex min-h-11 items-center gap-1.5 rounded-control border-2 border-ink bg-ink px-4 text-[15px] font-medium text-bg">
                Work &amp; résumé <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href="#contact" className="inline-flex min-h-11 items-center px-2 text-[15px] font-medium text-ink underline underline-offset-4">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="campus-map-h" className="border-y-2 border-ink">
        <h2 id="campus-map-h" className="sr-only">
          Campus map
        </h2>
        <div className="mx-auto max-w-[1200px] lg:border-x-2 lg:border-ink">
          <CampusPlayable
            staticMap={
              <>
                <div className="hidden md:block">
                  <CampusMap layout="wide" />
                </div>
                <div className="md:hidden">
                  <CampusMap layout="tall" />
                </div>
              </>
            }
          />
        </div>
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
                  Go inside <ArrowRight aria-hidden className="h-4 w-4" />
                  <span className="sr-only">: {p.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="rounded-panel border-2 border-ink bg-surface p-5 shadow-panel">
            <p className="font-pixel text-[11px] uppercase text-accent">Career Office</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">Experience &amp; résumé</h3>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link href="/work#experience" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink underline underline-offset-4">
                Experience <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={site.resume} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink underline underline-offset-4">
                Résumé (PDF) <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </li>
          <li className="rounded-panel border-2 border-ink bg-surface p-5 shadow-panel">
            <p className="font-pixel text-[11px] uppercase text-accent">Contact Kiosk</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">Get in touch</h3>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-11 items-center break-all text-[15px] font-medium text-ink underline underline-offset-4">
              {site.email}
            </a>
          </li>
        </ol>
      </section>

      <MoreWork />
      <Experience />
      <About />
    </>
  );
}
