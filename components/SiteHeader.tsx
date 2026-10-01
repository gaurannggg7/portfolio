"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 border-b border-rule bg-bg/95 backdrop-blur-sm supports-[backdrop-filter]:bg-bg/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-ink">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
          <a
            href={site.resume}
            target="_blank"
            rel="noopener"
            className="ml-2 rounded-md border border-rule-strong px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Resume <span className="sr-only">(PDF, opens in new tab)</span>
          </a>
          <div className="ml-1">
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
            className="inline-flex h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink"
          >
            {open ? <X aria-hidden className="h-4 w-4" /> : <Menu aria-hidden className="h-4 w-4" />}
            Menu
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-rule bg-bg md:hidden">
        <ul className="mx-auto max-w-6xl px-5 py-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-rule text-base text-ink"
              >
                {item.label}
              </Link>
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
