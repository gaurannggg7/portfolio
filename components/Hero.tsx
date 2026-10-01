import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import HeroExhibit from "./signlink/HeroExhibit";

export default function Hero() {
  return (
    <section aria-labelledby="hero-name" className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-5">
          <h1 id="hero-name" className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {site.name}
          </h1>
          <p className="mt-3 font-mono text-sm tracking-wide text-accent">{site.role}</p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">{site.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-[15px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              Explore work <ArrowDown aria-hidden className="h-4 w-4" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rule-strong px-4 text-[15px] font-medium text-ink transition-colors hover:border-ink"
            >
              Resume <span className="sr-only">(PDF, opens in new tab)</span>
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center px-2 text-[15px] font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <HeroExhibit />
        </div>
      </div>
    </section>
  );
}
