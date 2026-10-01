"use client";

import { useState } from "react";
import { visionary } from "@/content/projects";
import PipelineExplorer from "../PipelineExplorer";
import GloveSchematic from "./GloveSchematic";

const legend = [
  ["Flex ×5", "Pinky GPIO 17, ring 5, middle 18, index 19, thumb 21 (analogRead)."],
  ["IMU", "MPU6050 on I²C (SDA 23, SCL 22). Its motion interrupt separates J from I and Z from D."],
  ["MCU", "Microcontroller running the Arduino framework. Reads and calibrates the sensors."],
  ["Audio", "Dashed: described in the project, but there's no audio code in the repository."],
];

/** Schematic and stage inspector, linked: selecting a stage highlights its parts. */
export default function VisionaryArchitecture() {
  const [stage, setStage] = useState(visionary.stages[0].id);

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <figure>
        <div className="rounded-panel border border-rule bg-surface shadow-panel p-3 sm:p-5">
          <GloveSchematic stage={stage} onSelect={setStage} />
        </div>
        <figcaption className="mt-3">
          <p className="label">Schematic · drawn from the firmware pin map · not to scale</p>
          <dl className="mt-2 space-y-1.5 text-sm leading-relaxed">
            {legend.map(([term, def]) => (
              <div key={term} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-mono text-xs leading-6 text-ink">{term}</dt>
                <dd className="text-ink-2">{def}</dd>
              </div>
            ))}
          </dl>
        </figcaption>
      </figure>
      <PipelineExplorer
        stages={visionary.stages}
        label="Visionary Hands processing stages"
        selected={stage}
        onSelect={setStage}
        stacked
      />
    </div>
  );
}
