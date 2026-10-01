"use client";

import { featured } from "@/content/projects";
import { useActiveProject } from "./ActiveProject";

export default function SceneCaption() {
  const { active } = useActiveProject();
  return (
    <figcaption className="mt-2 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
      <span>Tempe, AZ · day / night follows the theme</span>
      <span>
        <span className="sr-only">Sky marker shows: </span>
        {featured[active].name}
      </span>
    </figcaption>
  );
}
