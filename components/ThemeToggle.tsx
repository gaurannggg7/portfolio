"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  };

  // Icons are swapped in CSS (globals.css) so server and client render identical markup.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:text-ink"
    >
      <Sun aria-hidden className="theme-icon-light h-[18px] w-[18px]" />
      <Moon aria-hidden className="theme-icon-dark h-[18px] w-[18px]" />
    </button>
  );
}
