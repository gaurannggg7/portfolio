"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProjectSlug } from "@/content/types";

type ActiveProjectValue = {
  active: ProjectSlug;
  setActive: (slug: ProjectSlug) => void;
};

const ActiveProjectContext = createContext<ActiveProjectValue>({
  active: "signlink",
  setActive: () => {},
});

export const useActiveProject = () => useContext(ActiveProjectContext);

/**
 * Tracks which featured project the visitor is looking at, so the pixel
 * scenery can follow along. Sections opt in with a data-project attribute.
 */
export function ActiveProjectProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ProjectSlug>("signlink");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-project]"));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const slug = top.target.getAttribute("data-project") as ProjectSlug | null;
        if (slug) setActive(slug);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return <ActiveProjectContext.Provider value={{ active, setActive }}>{children}</ActiveProjectContext.Provider>;
}
