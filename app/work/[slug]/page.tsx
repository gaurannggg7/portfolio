import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECT_ORDER, featured } from "@/content/projects";
import { site } from "@/content/site";
import type { ProjectSlug } from "@/content/types";
import { getView } from "@/lib/getView";
import ModeShell from "@/components/view/ModeShell";
import { ProjectIntro, ProjectPager } from "@/components/ProjectParts";
import { PROJECT_BODY } from "@/components/project/ProjectBodies";
import CampusIntro from "@/components/modes/campus/CampusIntro";
import NotesIntro from "@/components/modes/notes/NotesIntro";

const KICKER: Record<ProjectSlug, string> = {
  signlink: "Accessibility AI · speech to sign",
  baseline: "LLM systems · multi-agent pipeline",
  guardian: "Graph ML · fraud detection",
  visionary: "Embedded systems · wearable",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const isSlug = (s: string): s is ProjectSlug => (PROJECT_ORDER as string[]).includes(s);

export function generateStaticParams() {
  return PROJECT_ORDER.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const p = featured[slug];
  return { title: `${p.name} — ${site.name}`, description: p.outcome };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const [{ slug }, view] = await Promise.all([params, getView(searchParams)]);
  if (!isSlug(slug)) notFound();
  const project = featured[slug];
  const i = PROJECT_ORDER.indexOf(slug);
  const prev = featured[PROJECT_ORDER[(i + PROJECT_ORDER.length - 1) % PROJECT_ORDER.length]];
  const next = featured[PROJECT_ORDER[(i + 1) % PROJECT_ORDER.length]];
  const Body = PROJECT_BODY[slug];

  const intro =
    view === "campus" ? (
      <CampusIntro project={project} />
    ) : view === "notes" ? (
      <NotesIntro project={project} entry={i + 1} />
    ) : (
      <ProjectIntro project={project} kicker={KICKER[slug]} />
    );
  const noun = view === "campus" ? "building" : view === "notes" ? "entry" : "";

  return (
    <ModeShell view={view}>
      <article className="mx-auto max-w-6xl px-5 sm:px-8">
        {intro}
        <Body />
        <ProjectPager prev={prev} next={next} noun={noun} />
      </article>
    </ModeShell>
  );
}
