"use client";

import { useId, useState } from "react";
import { FINGERS, letterTemplates, matchLetter } from "@/content/glove";

const LETTERS = letterTemplates
  .map((tpl, i) => ({ char: String.fromCharCode(65 + i), tpl }))
  .filter(({ tpl }) => tpl[0] !== -200);

export default function LetterMatcher() {
  const uid = useId();
  const [values, setValues] = useState<number[]>([...letterTemplates[0]]);
  const [jMotion, setJMotion] = useState(false);
  const [zMotion, setZMotion] = useState(false);
  const [preset, setPreset] = useState("A");

  const result = matchLetter(values, jMotion, zMotion);
  const [first, second] = result.ranked;
  const tie = second && Math.abs(second.distance - first.distance) < 1e-9;
  const tied = tie ? result.ranked.filter((r) => Math.abs(r.distance - first.distance) < 1e-9).map((r) => r.char) : [];
  const runnersUp = result.ranked.filter((r) => r.char !== result.char && !tied.includes(r.char)).slice(0, 3);

  const loadPreset = (char: string) => {
    setPreset(char);
    const tpl = LETTERS.find((l) => l.char === char)?.tpl;
    if (tpl) setValues([...tpl]);
  };

  return (
    <div className="grid gap-8 rounded-panel border border-rule bg-surface shadow-panel p-5 sm:p-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="text-sm text-ink-2" htmlFor={`${uid}-preset`}>
            Start from a letter&apos;s template
            <select
              id={`${uid}-preset`}
              value={preset}
              onChange={(e) => loadPreset(e.target.value)}
              className="mt-1 block min-h-11 w-28 rounded-control border border-rule-strong bg-bg px-2 font-mono text-ink"
            >
              {LETTERS.map((l) => (
                <option key={l.char} value={l.char}>
                  {l.char}
                </option>
              ))}
            </select>
          </label>
          <p className="font-mono text-xs text-ink-3">V has no template yet</p>
        </div>

        <div className="mt-5 space-y-3">
          {FINGERS.map((finger, i) => (
            <div key={finger} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3">
              <label htmlFor={`${uid}-f${i}`} className="text-sm text-ink">
                {finger}
              </label>
              <input
                id={`${uid}-f${i}`}
                type="range"
                min={0}
                max={100}
                value={values[i]}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = Number(e.target.value);
                  setValues(next);
                  setPreset("");
                }}
                className="h-11 w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <output htmlFor={`${uid}-f${i}`} className="text-right font-mono text-sm text-ink">
                {values[i]}
              </output>
            </div>
          ))}
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm text-ink-2">Motion from the MPU6050</legend>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <label className="flex min-h-11 items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={jMotion} onChange={(e) => setJMotion(e.target.checked)} className="h-4 w-4" style={{ accentColor: "var(--accent)" }} />
              J-motion (turns I into J)
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={zMotion} onChange={(e) => setZMotion(e.target.checked)} className="h-4 w-4" style={{ accentColor: "var(--accent)" }} />
              Z-motion (turns D into Z)
            </label>
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col lg:col-span-5 lg:border-l lg:border-rule lg:pl-8" aria-live="polite">
        <p className="label">Firmware would register</p>
        <p className="mt-2 font-mono text-7xl leading-none text-ink">
          {result.char === "space" ? "␣" : result.char}
          <span className="sr-only">{result.char === "space" ? " (space, ends the word)" : ""}</span>
        </p>
        <p className="mt-3 font-mono text-sm text-ink-2">distance {result.distance.toFixed(1)}</p>
        {result.motionOverride && <p className="mt-1 font-mono text-sm text-accent">{result.motionOverride}</p>}
        {tie && (
          <p className="mt-3 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink-2">
            Tie: {tied.join(", ")} have identical templates. The firmware keeps the first one it checks, so this hand shape always reads as {tied[0]}.
          </p>
        )}
        <p className="label mt-5">Next closest</p>
        <ul className="mt-1 space-y-1 font-mono text-sm text-ink-2">
          {runnersUp.map((r) => (
            <li key={r.char}>
              {r.char === "space" ? "space" : r.char} · {r.distance.toFixed(1)}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-5 text-xs leading-relaxed text-ink-3">
          This runs the classification branch of <span className="font-mono">produceChar()</span> on values you set. It
          isn&apos;t sensor data, and it skips the five-reading stability check.
        </p>
      </div>
    </div>
  );
}
