"use client";

import { useState } from "react";
import { visionary } from "@/content/projects";
import PipelineExplorer from "../PipelineExplorer";
import GloveSchematic from "./GloveSchematic";
import LetterMatcher from "./LetterMatcher";

const legend = [
  ["Flex sensors ×5", "Pinky GPIO 17, ring 5, middle 18, index 19, thumb 21 (analogRead)."],
  ["IMU", "MPU6050 accelerometer/gyroscope on I²C (SDA 23, SCL 22). Its motion interrupt separates J from I and Z from D."],
  ["MCU", "Microcontroller running the Arduino framework. Reads and calibrates the sensors."],
  ["Audio", "Drawn dashed: audio output is part of the project description, but there's no audio code in the repository."],
];

export default function VisionaryLab() {
  const [stage, setStage] = useState(visionary.stages[0].id);

  return (
    <div className="space-y-14">
      <section aria-labelledby="vh-system-heading">
        <h3 id="vh-system-heading" className="text-2xl font-semibold tracking-tight text-ink">
          The physical system
        </h3>
        <p className="mt-2 mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          There are no photos of the build yet, so this is a schematic drawn from the firmware&apos;s pin map. It isn&apos;t
          to scale. Selecting a stage highlights the parts involved.
        </p>
        <div className="grid gap-8 lg:grid-cols-12">
          <figure className="lg:col-span-6">
            <div className="border border-rule bg-surface p-3 sm:p-4">
              <GloveSchematic stage={stage} onSelect={setStage} />
            </div>
            <figcaption className="mt-3">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Schematic · not to scale</p>
              <dl className="mt-2 space-y-1.5 text-sm leading-relaxed">
                {legend.map(([term, def]) => (
                  <div key={term} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2">
                    <dt className="font-mono text-ink">{term}</dt>
                    <dd className="text-ink-2">{def}</dd>
                  </div>
                ))}
              </dl>
            </figcaption>
          </figure>
          <div className="lg:col-span-6">
            <PipelineExplorer
              stages={visionary.stages}
              label="Visionary Hands processing stages"
              accent="visionary"
              selected={stage}
              onSelect={setStage}
              stacked
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="vh-matcher-heading">
        <h3 id="vh-matcher-heading" className="text-2xl font-semibold tracking-tight text-ink">
          Try the letter-matching rule
        </h3>
        <p className="mt-2 mb-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          Set how far each finger bends, from 0 (straight) to 100 (fully bent). The 26 letter templates are copied
          from the firmware, and the matching rule is the same nearest-template comparison.
        </p>
        <LetterMatcher />
      </section>
    </div>
  );
}
