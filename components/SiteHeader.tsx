"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import ThemeToggle from "./ThemeToggle";
import { PixelMark } from "./PixelGlyph";

export default function SiteHeader() {
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
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-ink">
          <PixelMark />
          {site.name}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noopener"
            className="ml-2 border border-ink px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Resume <span className="sr-only">(PDF, opens in new tab)</span>
          </a>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 items-center gap-2 border border-rule px-3 text-sm text-ink"
          >
            {open ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
            Menu
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-rule bg-bg md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-rule text-base text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center text-base font-medium text-ink"
            >
              Resume (PDF)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
