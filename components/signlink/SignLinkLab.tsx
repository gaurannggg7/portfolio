"use client";

import { useState } from "react";
import { exampleAtStage, methodLabel, signExamples } from "@/content/signlink-examples";
import { signlink } from "@/content/projects";
import PipelineExplorer from "../PipelineExplorer";
import Provenance from "../project/Provenance";
import Section from "../project/Section";
import ClipPlayer from "./ClipPlayer";

const methodStyle: Record<string, string> = {
  phrase: "border-accent text-accent",
  exact: "border-rule-strong text-ink-2",
  lemma: "border-accent text-accent border-dashed",
  fingerspell: "border-ink text-ink",
};

/**
 * SignLink demonstration and architecture. They share the selected example,
 * so the contribution section is passed in to sit between them.
 */
export default function SignLinkLab({ between }: { between?: React.ReactNode }) {
  const [exampleId, setExampleId] = useState(signExamples[0].id);
  const example = signExamples.find((e) => e.id === exampleId) ?? signExamples[0];
  const clips = example.resolutions.flatMap((r) => r.clips);

  return (
    <>
      <Section
        id="demo"
        index="01"
        title="Follow a sentence through it"
        intro={
          <>
            Prepared examples, traced with the repository&apos;s own fallback code.{" "}
            <strong className="font-medium text-ink">Not live inference.</strong>
          </>
        }
      >
        <fieldset>
          <legend className="label mb-2">Example sentence</legend>
          <div className="flex flex-wrap gap-2">
            {signExamples.map((e) => (
              <label
                key={e.id}
                className={`relative flex min-h-11 cursor-pointer items-center rounded-control border px-3 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)] ${
                  e.id === exampleId ? "border-ink bg-ink text-bg" : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="signlink-example"
                  value={e.id}
                  checked={e.id === exampleId}
                  onChange={() => setExampleId(e.id)}
                  className="sr-only"
                />
                “{e.sentence}”
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid overflow-hidden rounded-panel border border-rule bg-surface shadow-panel lg:grid-cols-2">
          <ol className="divide-y divide-rule lg:border-r lg:border-rule">
            <li className="p-5">
              <p className="label">1 · Transcript</p>
              <p className="mt-2 text-xl font-medium tracking-tight text-ink">“{example.sentence}”</p>
              <p className="mt-1 text-sm text-ink-3">Typed, so the Whisper stage is skipped.</p>
            </li>
            <li className="p-5">
              <p className="label">2 · ASL gloss · fallback rules</p>
              <p className="mt-2 font-mono text-lg tracking-wide text-ink">{example.gloss.join(" ")}</p>
              <p className="mt-1 text-sm text-ink-3">
                {example.dropped.length ? `Dropped as a stopword: “${example.dropped.join("”, “")}”. ` : "No stopwords to drop. "}
                The hosted Gemma stage can produce a different gloss.
              </p>
            </li>
            <li className="p-5">
              <p className="label">3 · Resolve to clips</p>
              <ul className="mt-3 space-y-3">
                {example.resolutions.map((r) => (
                  <li key={r.tokens.join(" ")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm text-ink">{r.tokens.join(" ")}</span>
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${methodStyle[r.method]}`}>
                        {methodLabel[r.method]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </li>
          </ol>

          <div className="border-t border-rule p-5 lg:border-t-0">
            <p className="label">4 · Video</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{example.shows}</p>
            <div className="mt-4">
              <ClipPlayer key={example.id} clips={clips} sentence={example.sentence} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-3">
              Original dictionary clips played one after another. SignLink&apos;s renderer would re-encode them to
              1280×720 and join them into one MP4. Clips: StudioGalt Sign-Language Mocap Archive, CC0.
            </p>
          </div>
        </div>
        <Provenance project={signlink} />
      </Section>

      {between}

      <Section
        id="architecture"
        index="03"
        title="Architecture"
        intro="Select a stage to see its input, processing, and output. Each stage links to its source file."
      >
        <p className="mb-8 max-w-2xl text-[16px] leading-relaxed text-ink-2">{signlink.howItWorks}</p>
        <PipelineExplorer
          stages={signlink.stages}
          label="SignLink pipeline stages"
          exampleRow={{ title: "This example", value: (id) => exampleAtStage(example, id) }}
        />
      </Section>
    </>
  );
}
