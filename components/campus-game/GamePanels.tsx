"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { featured } from "@/content/projects";
import { resume, roles, site } from "@/content/site";
import type { ProjectSlug } from "@/content/types";
import type { BuildingId } from "./map";
import { LOCATIONS } from "../modes/campus/Buildings";

/** Modal panel: traps focus while open, closes on Escape, restores focus on close. */
export function GamePanel({ title, kicker, onClose, children }: { title: string; kicker: string; onClose: () => void; children: React.ReactNode }) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key !== "Tab" || !el) return;
      const f = Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-black/35 p-2 sm:items-center sm:p-6" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${uid}-t`} className="rpg-box max-h-full w-full max-w-lg overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wide text-[var(--gb-2)]">{kicker}</p>
            <h2 id={`${uid}-t`} className="mt-1 text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close and return to the campus" className="rpg-btn inline-flex h-10 w-10 shrink-0 items-center justify-center">
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">{children}</div>
        <p className="mt-4 border-t-2 border-[var(--gb-3)] pt-3 font-pixel text-[10px] uppercase text-[var(--gb-2)]">Esc to close · movement paused</p>
      </div>
    </div>
  );
}

const btn = "rpg-btn inline-flex min-h-11 items-center gap-1.5 px-3.5 text-sm font-medium";

export function ProjectPanelBody({ slug }: { slug: ProjectSlug }) {
  const p = featured[slug];
  const repoLinks = p.links.filter((l) => l.kind === "repo" || l.kind === "live").slice(0, 3);
  return (
    <>
      <p className="text-[15px] leading-relaxed">{p.outcome}</p>
      <p className="mt-1 text-sm opacity-80">{p.role}</p>
      <h3 className="mt-4 font-pixel text-[11px] uppercase">{p.contribution ? "My contribution" : "How it works"}</h3>
      {p.contribution ? (
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {p.contribution.slice(0, 3).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm leading-relaxed">
          {p.howItWorks} {p.availability}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/work/${slug}#demo`} className={`${btn} rpg-btn-primary`}>
          Try the demo <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        <Link href={`/work/${slug}`} className={btn}>
          Read the case study
        </Link>
      </div>
      {repoLinks.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 text-sm">
          {repoLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4">
                {l.label} <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function CareerPanelBody() {
  return (
    <>
      <ul className="space-y-3">
        {roles.map((r) => (
          <li key={`${r.org}-${r.role}`}>
            <p className="font-pixel text-[10px] uppercase opacity-80">{r.period}</p>
            <p className="font-semibold">
              {r.role} <span className="font-normal opacity-80">· {r.org}</span>
            </p>
            <p className="mt-0.5 text-sm leading-relaxed">{r.points[0]}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={resume.pdf} target="_blank" rel="noopener" className={`${btn} rpg-btn-primary`}>
          Résumé (PDF) <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
        <a href={resume.docx} download className={btn}>
          DOCX
        </a>
        <Link href="/work#experience" className={btn}>
          Full experience
        </Link>
      </div>
    </>
  );
}

export function KioskPanelBody() {
  return (
    <>
      <p className="text-[15px] leading-relaxed">Email is the fastest way to reach Gaurang. More projects, including GuardianAI, are in the catalog.</p>
      <a href={`mailto:${site.email}`} className="mt-2 inline-block break-all text-lg font-semibold underline underline-offset-4">
        {site.email}
      </a>
      <ul className="mt-4 flex flex-wrap gap-2">
        {[
          ["GitHub", site.github],
          ["LinkedIn", site.linkedin],
          ["Hugging Face", site.huggingface],
        ].map(([label, href]) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={btn}>
              {label} <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
          </li>
        ))}
        <li>
          <Link href="/work#all-projects" className={btn}>
            All projects <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </li>
      </ul>
    </>
  );
}

export function panelFor(id: BuildingId): { title: string; kicker: string; body: React.ReactNode } {
  if (id === "career") return { title: "Experience & résumé", kicker: "Career Office", body: <CareerPanelBody /> };
  if (id === "kiosk") return { title: "Get in touch", kicker: "Contact Kiosk", body: <KioskPanelBody /> };
  return { title: featured[id].name, kicker: LOCATIONS[id].name, body: <ProjectPanelBody slug={id} /> };
}
