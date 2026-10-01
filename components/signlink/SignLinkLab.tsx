"use client";

import { useState } from "react";
import { exampleAtStage, methodLabel, signExamples } from "@/content/signlink-examples";
import { signlink } from "@/content/projects";
import PipelineExplorer from "../PipelineExplorer";
import ClipPlayer from "./ClipPlayer";

const methodStyle: Record<string, string> = {
  phrase: "border-signlink text-signlink",
  exact: "border-rule-strong text-ink-2",
  lemma: "border-accent text-accent",
  fingerspell: "border-visionary text-visionary",
};

export default function SignLinkLab() {
  const [exampleId, setExampleId] = useState(signExamples[0].id);
  const example = signExamples.find((e) => e.id === exampleId) ?? signExamples[0];
  const clips = example.resolutions.flatMap((r) => r.clips);

  return (
    <div className="space-y-14">
      <section aria-labelledby="signlink-example-heading">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 id="signlink-example-heading" className="text-2xl font-semibold tracking-tight text-ink">
              Follow a sentence through it
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
              Prepared examples, traced offline with the repository&apos;s own fallback gloss and resolver code.
              Nothing on this page calls a model.
            </p>
          </div>
          <fieldset className="shrink-0">
            <legend className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Example sentence</legend>
            <div className="flex flex-wrap gap-2">
              {signExamples.map((e) => (
                <label
                  key={e.id}
                  className={`flex min-h-11 cursor-pointer items-center border px-3 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)] ${
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
        </div>

        <div className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule lg:grid-cols-12">
          {/* Transcript → gloss → resolution */}
          <ol className="grid gap-px bg-rule lg:col-span-6">
            <li className="bg-bg p-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">1 · Transcript</p>
              <p className="mt-2 text-2xl font-medium tracking-tight text-ink">“{example.sentence}”</p>
              <p className="mt-1 text-sm text-ink-3">Typed, so the Whisper stage is skipped.</p>
            </li>
            <li className="bg-bg p-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">2 · ASL gloss (fallback rules)</p>
              <p className="mt-2 font-mono text-xl tracking-wide text-ink">
                {example.gloss.join(" ")}
              </p>
              <p className="mt-1 text-sm text-ink-3">
                {example.dropped.length
                  ? `Dropped as a stopword: “${example.dropped.join("”, “")}”. `
                  : "No stopwords to drop. "}
                The hosted Gemma stage can produce a different gloss.
              </p>
            </li>
            <li className="bg-bg p-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">3 · Resolve to clips</p>
              <ul className="mt-3 space-y-3">
                {example.resolutions.map((r) => (
                  <li key={r.tokens.join(" ")} className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm text-ink">{r.tokens.join(" ")}</span>
                      <span className={`border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${methodStyle[r.method]}`}>
                        {methodLabel[r.method]}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-2">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </li>
          </ol>

          <div className="bg-bg p-5 lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">4 · Video</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{example.shows}</p>
            <div className="mt-4">
              <ClipPlayer key={example.id} clips={clips} sentence={example.sentence} />
            </div>
            <p className="mt-4 border-l-2 border-rule-strong pl-3 text-xs leading-relaxed text-ink-3">
              These are the original dictionary clips the resolver picks, played one after another. SignLink&apos;s
              renderer re-encodes them to 1280×720 and joins them into a single MP4. Clips from the StudioGalt
              Sign-Language Mocap Archive (CC0).
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="signlink-arch-heading">
        <h3 id="signlink-arch-heading" className="text-2xl font-semibold tracking-tight text-ink">
          Architecture, stage by stage
        </h3>
        <p className="mt-2 mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          Select a stage to see what goes in, what happens, and what comes out. Each stage links to its source file.
          The last row shows the example sentence you picked above.
        </p>
        <PipelineExplorer
          stages={signlink.stages}
          label="SignLink pipeline stages"
          accent="signlink"
          exampleRow={{ title: "This example", value: (id) => exampleAtStage(example, id) }}
        />
      </section>
    </div>
  );
}
