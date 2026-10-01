"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
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
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="ml-1.5 rounded-control border border-rule-strong px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Resume <span className="sr-only">(PDF, opens in new tab)</span>
            </a>
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

      <div id="mobile-nav" hidden={!open} className="border-t border-rule bg-bg lg:hidden">
        <div className="mx-auto max-w-6xl px-5 pb-3 pt-4 sm:px-8">
          <ViewSwitcher view={view} />
          <nav aria-label="Main" className="mt-3">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-rule text-base text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={site.resume} target="_blank" rel="noopener" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base font-medium text-ink">
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
