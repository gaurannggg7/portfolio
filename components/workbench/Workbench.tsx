"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BENCH_ORDER, exhibits } from "@/content/exhibits";
import { featured } from "@/content/projects";
import { resume, site } from "@/content/site";
import type { ProjectSlug } from "@/content/types";
import ExhibitArt from "./ExhibitArt";
import ExhibitPanel from "./ExhibitPanel";

// The 3D scene is a separate chunk, fetched only when the device can show it.
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

type Capability = "pending" | "3d" | "static";

function detect(): Capability {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true;
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {}
  return !reduce && fine && webgl && !lowPower ? "3d" : "static";
}

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.getAttribute("data-theme") === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

const PREF_KEY = "bench-static";

/** Systems Lab hero: an interactive workbench where each object opens a project. */
export default function Workbench() {
  const uid = useId();
  const [cap, setCap] = useState<Capability>("pending");
  const [preferStatic, setPreferStatic] = useState(false);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<ProjectSlug | null>(null);
  const [hovered, setHovered] = useState<ProjectSlug | null>(null);
  const [part, setPart] = useState<string | null>(null);
  const [motionKey, setMotionKey] = useState(0);
  const labelRefs = useRef<Partial<Record<ProjectSlug, HTMLElement | null>>>({});
  const dark = useDark();

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(PREF_KEY) === "1";
    } catch {}
    // Capability depends on the browser, so it can only be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferStatic(saved);
    setCap(detect());
  }, []);

  const select = useCallback((slug: ProjectSlug | null) => {
    setSelected(slug);
    setPart(null);
    setMotionKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const use3d = cap === "3d" && !preferStatic;
  const toggleStatic = () => {
    const next = !preferStatic;
    setPreferStatic(next);
    setReady(false);
    try {
      localStorage.setItem(PREF_KEY, next ? "1" : "0");
    } catch {}
  };

  const chips = (
    <div role="group" aria-label="Exhibits on the bench" className="flex flex-wrap gap-2">
      {BENCH_ORDER.map((slug, i) => {
        const on = selected === slug;
        return (
          <button
            key={slug}
            type="button"
            aria-pressed={on}
            onClick={() => select(on ? null : slug)}
            onMouseEnter={() => setHovered(slug)}
            onMouseLeave={() => setHovered(null)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-3 text-sm transition-colors ${
              on ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink hover:border-ink"
            }`}
          >
            <span className={`font-mono text-[11px] ${on ? "text-bg/70" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>
            {featured[slug].name}
          </button>
        );
      })}
    </div>
  );

  return (
    <section aria-labelledby="hero-name" className="relative">
      {/* ---------- Desktop stage ---------- */}
      <div className="relative hidden h-[calc(100svh-4rem)] max-h-[880px] min-h-[640px] overflow-hidden border-b border-rule lg:block" style={{ background: dark ? "#1b1d22" : "#e8e6e1" }}>
        {/* Static bench: the fallback, and the poster while the 3D chunk loads */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${use3d && ready ? "pointer-events-none opacity-0" : "opacity-100"}`} aria-hidden={use3d && ready}>
          <StaticBench selected={selected} part={part} onSelect={(s) => select(selected === s ? null : s)} animateKey={motionKey} interactive={!use3d || !ready} />
        </div>

        {use3d && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <Scene3D
              selected={selected}
              hovered={hovered}
              part={part}
              motionKey={motionKey}
              dark={dark}
              onSelect={(s) => select(s)}
              onHover={setHovered}
              onPart={setPart}
              labelRefs={labelRefs}
              onReady={() => setReady(true)}
            />
            {/* Labels pinned to the 3D objects (mouse affordance; the chips below are the accessible controls) */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {BENCH_ORDER.map((slug, i) => (
                <button
                  key={slug}
                  tabIndex={-1}
                  ref={(el) => {
                    labelRefs.current[slug] = el;
                  }}
                  onClick={() => select(slug)}
                  onMouseEnter={() => setHovered(slug)}
                  onMouseLeave={() => setHovered(null)}
                  className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm transition-[opacity,background-color] duration-300 ${
                    selected === slug || hovered === slug ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <span className="mr-1 font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  {featured[slug].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Intro, top left, on the plain wall */}
        <div className={`pointer-events-none absolute left-0 top-0 w-full transition-opacity duration-300 ${selected ? "opacity-0" : "opacity-100"}`}>
          <div className="mx-auto max-w-6xl px-8 pt-6">
            <div className={`max-w-md rounded-panel ${selected ? "" : "pointer-events-auto"} border border-rule bg-surface/95 p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.4)]`}>
              <h1 id="hero-name" className="font-display text-4xl font-semibold tracking-tight text-ink xl:text-5xl">
                {site.name}
              </h1>
              <p className="mt-2 text-[17px] leading-snug text-ink">{site.focus}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">The five objects below are my featured projects. Select one, or use the list.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={resume.pdf} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-1.5 rounded-control bg-ink px-3.5 text-sm font-medium text-bg hover:opacity-90">
                  Résumé (PDF) <ArrowUpRight aria-hidden className="h-4 w-4" />
                </a>
                <a href="#selected-work" className="inline-flex min-h-10 items-center gap-1.5 rounded-control border border-rule-strong px-3.5 text-sm font-medium text-ink hover:border-ink">
                  Project list <ArrowDown aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Focus panel */}
        {selected && (
          <div className="absolute right-8 top-8 w-[23rem] xl:right-[max(2rem,calc((100vw-72rem)/2))]">
            <ExhibitPanel
              slug={selected}
              part={part}
              onPart={setPart}
              onReplay={() => setMotionKey((k) => k + 1)}
              onClose={() => select(null)}
              headingId={`${uid}-panel`}
            />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 w-full border-t border-rule bg-bg/95">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-3">
            <div>
              <p className="mb-2 text-sm text-ink-2">
                {use3d && ready ? "Click an object, or pick one here. Move the pointer to look around. Esc returns to the bench." : "Pick an object to see what it is. Esc returns to the bench."}
              </p>
              {chips}
            </div>
            <div className="flex items-center gap-3">
              {cap === "3d" && (
                <button type="button" onClick={toggleStatic} className="min-h-11 rounded-control px-2 text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
                  {preferStatic ? "Show the 3D bench" : "Use the flat view"}
                </button>
              )}
              {use3d && !ready && <span className="label" role="status">Setting up the bench…</span>}
              <a href="#all-projects" className="inline-flex min-h-11 items-center rounded-control px-2 text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
                All projects
              </a>
              <Link href="/work" className="inline-flex min-h-11 items-center gap-1.5 rounded-control border border-ink bg-surface px-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-bg">
                Work &amp; résumé <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile & tablet composition ---------- */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-2xl px-5 pb-6 pt-10 sm:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">{site.name}</h1>
          <p className="mt-2 text-lg leading-snug text-ink">{site.focus}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-3">Five featured projects from my workbench. Tap one to see what it is, then open its demo.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={resume.pdf} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 rounded-control bg-ink px-3.5 text-sm font-medium text-bg">
              Résumé (PDF) <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
            <a href="#all-projects" className="inline-flex min-h-11 items-center rounded-control border border-rule-strong px-3.5 text-sm font-medium text-ink">
              All projects
            </a>
          </div>
        </div>
        <ul className="mx-auto grid max-w-2xl gap-5 px-5 pb-12 sm:grid-cols-2 sm:px-8">
          {BENCH_ORDER.map((slug, i) => (
            <MobileExhibit key={slug} slug={slug} index={i} wide={i === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Flat illustrated bench: fallback, loading poster, and reduced-motion view. */
function StaticBench({
  selected,
  part,
  onSelect,
  animateKey,
  interactive,
}: {
  selected: ProjectSlug | null;
  part: string | null;
  onSelect: (s: ProjectSlug) => void;
  animateKey: number;
  interactive: boolean;
}) {
  const item = (slug: ProjectSlug, className: string) => {
    const on = selected === slug;
    return (
      <button
        key={`${slug}-${on ? animateKey : 0}`}
        type="button"
        tabIndex={interactive ? 0 : -1}
        aria-pressed={on}
        aria-label={`${featured[slug].name}: ${exhibits[slug].object}`}
        onClick={() => onSelect(slug)}
        className={`group relative block transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 ${className} ${
          selected && !on ? "opacity-45" : ""
        }`}
      >
        <ExhibitArt slug={slug} part={on ? part : null} animate={on} />
        <span
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
            on ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink group-hover:border-ink"
          }`}
        >
          {featured[slug].name}
        </span>
      </button>
    );
  };
  return (
    <div className="absolute inset-0">
      {/* Wall pegboard, light bar, and bench surface */}
      <div className="absolute inset-x-[5%] top-[16%] h-[34%] rounded-sm opacity-60" style={{ backgroundImage: "radial-gradient(circle, var(--rule-strong) 2.5px, transparent 3px)", backgroundSize: "26px 26px" }} />
      <div className="absolute inset-x-[8%] top-[12%] h-1.5 rounded-full bg-[#fff6e6] shadow-[0_0_40px_10px_rgba(255,236,205,0.35)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: "linear-gradient(#8a5a3a, #6d4429)" }} />
      <div className="absolute inset-x-0 bottom-[34%] h-3" style={{ background: "#9b6a47" }} />
      <div className="absolute inset-x-0 bottom-[22%] mx-auto grid max-w-7xl grid-cols-5 items-end gap-5 px-10">
        {BENCH_ORDER.map((s) => item(s, "w-full"))}
      </div>
    </div>
  );
}

function MobileExhibit({ slug, index, wide = false }: { slug: ProjectSlug; index: number; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  const [part, setPart] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const id = useId();
  const p = featured[slug];
  return (
    <li className={`overflow-hidden rounded-panel border border-rule bg-surface shadow-panel ${wide ? "sm:col-span-2" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={() => {
          setOpen((o) => !o);
          setKey((k) => k + 1);
        }}
        className="block w-full text-left"
      >
        <div className="px-4 pt-4" style={{ background: "linear-gradient(transparent 70%, rgba(138,90,58,0.18))" }}>
          <ExhibitArt key={key} slug={slug} part={part} animate={open} />
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-rule px-4 py-3">
          <span>
            <span className="mr-2 font-mono text-[11px] text-ink-3">{String(index + 1).padStart(2, "0")}</span>
            <span className="font-display text-lg font-semibold text-ink">{p.name}</span>
          </span>
          <span className="text-sm text-ink-3">{open ? "Close" : "Inspect"}</span>
        </div>
      </button>
      {open && (
        <div id={`${id}-body`} className="border-t border-rule px-1 pb-1">
          <ExhibitPanel slug={slug} part={part} onPart={setPart} onReplay={() => setKey((k) => k + 1)} headingId={`${id}-h`} />
        </div>
      )}
    </li>
  );
}
