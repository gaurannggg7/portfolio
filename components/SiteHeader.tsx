"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, resume, site } from "@/content/site";
import type { View } from "@/lib/view";
import ThemeToggle from "./ThemeToggle";
import ViewSwitcher from "./view/ViewSwitcher";

export default function SiteHeader({ view }: { view: View }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="font-display text-[15px] font-semibold tracking-tight text-ink">
          {site.name}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <nav aria-label="Main" className="flex items-center">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-control px-2.5 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
            <Link
              href="/work"
              className="ml-1.5 rounded-control border border-ink bg-ink px-3 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Work &amp; résumé
            </Link>
          </nav>
          <div className="ml-3 flex items-center gap-2 border-l border-rule pl-3">
            <span aria-hidden className="label">View</span>
            <ViewSwitcher view={view} compact />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 items-center gap-2 rounded-control border border-rule px-3 text-sm text-ink"
          >
            {open ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
            Menu
          </button>
        </div>
      </div>

      {/* Always-visible view selector on small screens */}
      <div className="border-t border-rule lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-1.5 sm:px-8">
          <span aria-hidden className="label">View</span>
          <ViewSwitcher view={view} compact />
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-rule bg-bg lg:hidden">
        <div className="mx-auto max-w-6xl px-5 pb-3 pt-2 sm:px-8">
          <nav aria-label="Main">
            <ul>
              <li>
                <Link href="/work" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-rule text-base font-medium text-ink">
                  Work &amp; résumé
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-rule text-base text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={resume.pdf} target="_blank" rel="noopener" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base font-medium text-ink">
                  Résumé (PDF)
                </a>
              </li>
              <li>
                <a href={resume.docx} download onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base text-ink">
                  Résumé (DOCX)
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
