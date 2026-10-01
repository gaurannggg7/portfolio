"use client";

import { ArrowDown } from "lucide-react";
import { featured } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { useActiveProject } from "./ActiveProject";
import { ProjectGlyph } from "./PixelGlyph";

const ORDER: { slug: ProjectSlug; kind: string }[] = [
  { slug: "signlink", kind: "Speech → ASL video" },
  { slug: "guardian", kind: "Transaction graphs" },
  { slug: "visionary", kind: "Embedded sensing" },
];

/** Featured work, visible right under the introduction. */
export default function WorkIndex() {
  const { setActive } = useActiveProject();
  return (
    <nav aria-label="Featured projects" className="border-t border-rule">
      <ol className="mx-auto grid max-w-6xl lg:grid-cols-3">
        {ORDER.map(({ slug, kind }, i) => {
          const p = featured[slug];
          return (
            <li key={slug} className="border-b border-rule last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <a
                href={`#${slug}`}
                onMouseEnter={() => setActive(slug)}
                onFocus={() => setActive(slug)}
                className="group flex h-full gap-4 px-4 py-5 transition-colors hover:bg-surface sm:px-6"
              >
                <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink">
                    <ProjectGlyph slug={slug} className="h-4 w-auto" />
                    {p.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs uppercase tracking-[0.1em] text-ink-3">{kind}</span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-ink-2">{p.summary}</span>
                </span>
                <ArrowDown aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-y-0.5 group-hover:text-ink" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
