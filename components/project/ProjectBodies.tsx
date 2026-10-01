import { baseline, guardian, signlink, visionary } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { ContributionSection, DecisionsSection, LinksSection } from "../ProjectParts";
import Section from "./Section";
import Provenance from "./Provenance";
import PipelineExplorer from "../PipelineExplorer";
import SignLinkLab from "../signlink/SignLinkLab";
import TransactionGraph from "../guardian/TransactionGraph";
import LetterMatcher from "../visionary/LetterMatcher";
import VisionaryArchitecture from "../visionary/VisionaryArchitecture";
import BaselineDag from "../baseline/BaselineDag";
import ReliabilityTable from "../baseline/ReliabilityTable";
import TopologyExplorer from "../baseline/TopologyExplorer";

/**
 * The exhibits for each project page. Shared by every view style; only the
 * intro, pager, and tokens differ between views.
 */

function SignLinkBody() {
  return (
    <>
      <SignLinkLab between={<ContributionSection project={signlink} index="02" />} />
      <DecisionsSection project={signlink} index="04" />
      <LinksSection project={signlink} index="05" />
    </>
  );
}

function BaselineBody() {
  return (
    <>
      <Section id="demo" index="01" title="Measured, not estimated" intro="The repository's evaluation report, before and after the reliability fixes.">
        <ReliabilityTable />
        <Provenance project={baseline} />
      </Section>
      <ContributionSection project={baseline} index="02" />
      <Section id="architecture" index="03" title="Architecture" intro="Select a stage to see its input, processing, and output. Each stage links to its source file.">
        <p className="mb-6 max-w-2xl text-[16px] leading-relaxed text-ink-2">{baseline.howItWorks}</p>
        <figure className="mb-10 rounded-panel border border-rule bg-surface p-2 shadow-panel sm:p-4">
          <BaselineDag idPrefix="page-baseline" />
          <figcaption className="label px-2 pt-1">Graph from backend/agent.py · LLM nodes outlined in the accent colour</figcaption>
        </figure>
        <PipelineExplorer stages={baseline.stages} label="Baseline pipeline stages" />
      </Section>
      <DecisionsSection project={baseline} index="04" extra={<TopologyExplorer />} />
      <LinksSection project={baseline} index="05" />
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

export const PROJECT_BODY: Record<ProjectSlug, () => React.ReactElement> = {
  signlink: SignLinkBody,
  baseline: BaselineBody,
  guardian: GuardianBody,
  visionary: VisionaryBody,
};
