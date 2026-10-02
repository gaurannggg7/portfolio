import { baseline, bellwether, guardian, osint, signlink, visionary } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { ContributionSection, DecisionsSection, EvidenceLedger, LinksSection } from "../ProjectParts";
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
import RegressionExplorer from "../bellwether/RegressionExplorer";
import GateSummary from "../bellwether/GateSummary";
import BellwetherDecisions from "../bellwether/Decisions";
import EvidenceExplorer from "../osint/EvidenceExplorer";
import RetrievalEval from "../osint/RetrievalEval";
import OsintFlow from "../osint/OsintFlow";

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
      <EvidenceLedger project={baseline} index="05" />
      <LinksSection project={baseline} index="06" />
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

function BellwetherBody() {
  return (
    <>
      <Section
        id="demo"
        index="01"
        title="Same recall, worse replies"
        intro="A prompt change kept urgent routing recall at 1.0 while response quality fell. Pick a scenario to see why the gate still blocked it."
      >
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] [&>*]:min-w-0">
          <GateSummary />
          <div className="space-y-3 text-[15px] leading-relaxed text-ink-2">
            <p>
              Urgent recall measures where a conversation is routed. Routing is driven by the conversation&apos;s concern signal, which the prompt
              doesn&apos;t touch, so it stayed identical in all 60 scenarios.
            </p>
            <p>
              The prompt changes the reply. prompt_v2 was asked to be warmer and shorter, lead with coping, and mention the care team only for
              explicit intent. Hard-gate failures doubled, from 8 to 16 of 60.
            </p>
          </div>
        </div>
        <RegressionExplorer />
        <Provenance project={bellwether} />
      </Section>
      <Section id="why" index="02" title="Why I built it">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3 text-[16px] leading-relaxed text-ink-2">
            <p>
              Marble Health&apos;s AI Engineer role, and its public description of Marty, an AI companion that supports patients between therapy
              sessions, raised a question I wanted to work through: how do you evaluate and regression-test a high-stakes AI companion as its
              prompts and models change?
            </p>
            <p className="border-l-2 border-accent pl-3 text-ink">
              Bellwether is an independent prototype. It has no affiliation with Marble Health and no access to Marty or to any of Marble&apos;s
              internal systems, and it does not represent or reproduce them.
            </p>
          </div>
          <dl className="grid content-start gap-4 text-[15px] leading-relaxed">
            <div className="rounded-panel border border-rule bg-surface p-4">
              <dt className="label">What the results show</dt>
              <dd className="mt-1 text-ink-2">
                That the harness catches a behavioural regression: across 60 synthetic scenarios and two deterministic mock runs, prompt_v2 failed
                hard gates the gate is built to block, even though urgent recall didn&apos;t move.
              </dd>
            </div>
            <div className="rounded-panel border border-rule bg-surface p-4">
              <dt className="label">What they don&apos;t show</dt>
              <dd className="mt-1 text-ink-2">
                Clinical safety. No live model was measured, no real patient data was used, and the scenarios, labels, and rubric were written for
                engineering evaluation, not validated clinically.
              </dd>
            </div>
          </dl>
        </div>
      </Section>
      <ContributionSection project={bellwether} index="03" />
      <Section id="architecture" index="04" title="Architecture" intro="Select a stage to see its input, processing, and output. Each stage links to its source file.">
        <p className="mb-6 max-w-2xl text-[16px] leading-relaxed text-ink-2">{bellwether.howItWorks}</p>
        <PipelineExplorer stages={bellwether.stages} label="Bellwether pipeline stages" />
      </Section>
      <DecisionsSection project={bellwether} index="05" extra={<BellwetherDecisions />} />
      <EvidenceLedger project={bellwether} index="06" />
      <LinksSection project={bellwether} index="07" />
    </>
  );
}

function OsintBody() {
  return (
    <>
      <Section
        id="demo"
        index="01"
        title="Check the citations"
        intro="Choose a prepared question, read the saved report, and select a citation to see the excerpt it points to."
      >
        <EvidenceExplorer />
        <Provenance project={osint} />
      </Section>
      <ContributionSection project={osint} index="02" />
      <Section id="architecture" index="03" title="Architecture" intro="Two LangGraph nodes, retrieve then synthesize. Select a stage for details and its source file.">
        <p className="mb-6 max-w-2xl text-[16px] leading-relaxed text-ink-2">{osint.howItWorks}</p>
        <div className="mb-10">
          <OsintFlow />
        </div>
        <PipelineExplorer stages={osint.stages} label="OSINT analyst pipeline stages" />
      </Section>
      <DecisionsSection project={osint} index="04" extra={<RetrievalEval />} />
      <EvidenceLedger project={osint} index="05" />
      <LinksSection project={osint} index="06" />
    </>
  );
}

export const PROJECT_BODY: Record<ProjectSlug, () => React.ReactElement> = {
  signlink: SignLinkBody,
  baseline: BaselineBody,
  bellwether: BellwetherBody,
  osint: OsintBody,
  guardian: GuardianBody,
  visionary: VisionaryBody,
};
