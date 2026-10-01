import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featured, guardian, signlink, visionary } from "@/content/projects";
import { site } from "@/content/site";
import type { Project, ProjectSlug } from "@/content/types";
import { ContributionSection, DecisionsSection, LinksSection, ProjectIntro, ProjectPager } from "@/components/ProjectParts";
import Section from "@/components/project/Section";
import Provenance from "@/components/project/Provenance";
import PipelineExplorer from "@/components/PipelineExplorer";
import SignLinkLab from "@/components/signlink/SignLinkLab";
import TransactionGraph from "@/components/guardian/TransactionGraph";
import LetterMatcher from "@/components/visionary/LetterMatcher";
import VisionaryArchitecture from "@/components/visionary/VisionaryArchitecture";

const ORDER: ProjectSlug[] = ["signlink", "guardian", "visionary"];

const KICKER: Record<ProjectSlug, string> = {
  signlink: "Accessibility AI · speech to sign",
  guardian: "Graph ML · fraud detection",
  visionary: "Embedded systems · wearable",
};

type Params = { params: Promise<{ slug: string }> };

const isSlug = (s: string): s is ProjectSlug => (ORDER as string[]).includes(s);

export function generateStaticParams() {
  return ORDER.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const p = featured[slug];
  return { title: `${p.name} — ${site.name}`, description: p.outcome };
}

function SignLinkBody() {
  return (
    <>
      <SignLinkLab between={<ContributionSection project={signlink} index="02" />} />
      <DecisionsSection project={signlink} index="04" />
      <LinksSection project={signlink} index="05" />
    </>
  );
}

function GuardianBody() {
  return (
    <>
      <Section id="demo" index="01" title="Explore the pattern" intro="Select an account or a transfer, or highlight the suspicious pattern.">
        <TransactionGraph />
        <Provenance project={guardian} />
      </Section>
      <ContributionSection project={guardian} index="02" />
      <Section id="architecture" index="03" title="Architecture" intro="The four documented stages. Select one to see its input, processing, and output.">
        <PipelineExplorer stages={guardian.stages} label="GuardianAI pipeline stages" />
      </Section>
      <DecisionsSection project={guardian} index="04" />
    </>
  );
}

function VisionaryBody() {
  return (
    <>
      <Section id="demo" index="01" title="Try the letter matcher" intro="Set how far each finger bends, from 0 (straight) to 100 (fully bent).">
        <LetterMatcher />
        <Provenance project={visionary} />
      </Section>
      <ContributionSection project={visionary} index="02" />
      <Section id="architecture" index="03" title="Architecture" intro="Selecting a stage highlights the parts involved in the schematic.">
        <p className="mb-8 max-w-2xl text-[16px] leading-relaxed text-ink-2">{visionary.howItWorks}</p>
        <VisionaryArchitecture />
      </Section>
      <DecisionsSection project={visionary} index="04" />
      <LinksSection project={visionary} index="05" />
    </>
  );
}

const BODY: Record<ProjectSlug, () => React.ReactElement> = {
  signlink: SignLinkBody,
  guardian: GuardianBody,
  visionary: VisionaryBody,
};

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const project: Project = featured[slug];
  const i = ORDER.indexOf(slug);
  const prev = featured[ORDER[(i + ORDER.length - 1) % ORDER.length]];
  const next = featured[ORDER[(i + 1) % ORDER.length]];
  const Body = BODY[slug];

  return (
    <article className="mx-auto max-w-6xl px-5 sm:px-8">
      <ProjectIntro project={project} kicker={KICKER[slug]} />
      <Body />
      <ProjectPager prev={prev} next={next} />
    </article>
  );
}
