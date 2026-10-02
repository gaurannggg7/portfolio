import { ChevronRight } from "lucide-react";
import type { Project } from "@/content/types";

/** Expandable note on where a demonstration's data comes from. */
export default function Provenance({ project }: { project: Project }) {
  if (!project.provenance) return null;
  return (
    <details className="mt-4 rounded-panel border border-rule">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-medium text-ink">
        <ChevronRight aria-hidden className="chev h-4 w-4 text-ink-3" />
        {project.provenance.summary}
      </summary>
      <ul className="space-y-1.5 border-t border-rule px-4 py-3 text-sm leading-relaxed text-ink-2">
        {project.provenance.points.map((p) => (
          <li key={p} className="max-w-prose">
            {p}
          </li>
        ))}
      </ul>
    </details>
  );
}
