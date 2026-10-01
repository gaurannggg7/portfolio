import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { HeroScene } from "./PixelScene";
import WorkIndex from "./WorkIndex";
import SceneCaption from "./SceneCaption";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 md:grid-cols-12 md:gap-8 lg:gap-12 lg:pb-16 lg:pt-20">
        <div className="md:col-span-7">
          <h1 id="hero-name" className="font-mono text-sm uppercase tracking-[0.16em] text-ink-3">
            {site.name}
          </h1>
          <p className="mt-5 text-[2rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl sm:leading-[1.08] md:text-4xl lg:text-5xl">
            {site.focus}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">{site.supporting}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex min-h-12 items-center gap-2 bg-ink px-5 text-[15px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              Explore projects <ArrowDown aria-hidden className="h-4 w-4" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center gap-2 border border-ink px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              Resume <span className="sr-only">(PDF, opens in new tab)</span>
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center px-3 text-[15px] font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
            >
              Contact
            </a>
          </div>
        </div>

        <figure className="md:col-span-5 md:self-center">
          <div className="aspect-[16/10] w-full overflow-hidden border border-rule-strong">
            <HeroScene />
          </div>
          <SceneCaption />
        </figure>
      </div>

      <WorkIndex />
    </section>
  );
}
