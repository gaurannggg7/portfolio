"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, LogOut, Settings2, Volume2, VolumeX } from "lucide-react";
import { site } from "@/content/site";

// The game (engine, sprites, renderer) is its own chunk, loaded only when played.
const CampusGame = dynamic(() => import("./CampusGame"), { ssr: false });

type Mode = "pending" | "game" | "static";
const MODE_KEY = "campus-mode";
const SOUND_KEY = "campus-sound";

/** Playable campus with a persistent toolbar and a static map fallback. */
export default function CampusPlayable({ staticMap }: { staticMap: React.ReactNode }) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("pending");
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(false);
  const [settings, setSettings] = useState(false);
  const settingsBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let saved: string | null = null;
    let snd = false;
    try {
      saved = localStorage.getItem(MODE_KEY);
      snd = localStorage.getItem(SOUND_KEY) === "on";
    } catch {}
    // Browser preferences are only readable after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(rm);
    setSound(snd);
    setMode(saved === "static" || saved === "game" ? (saved as Mode) : rm ? "static" : "game");
  }, []);

  useEffect(() => {
    if (!settings) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettings(false);
        settingsBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [settings]);

  const choose = (m: Mode) => {
    setMode(m);
    setReady(false);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {}
  };
  const toggleSound = () => {
    setSound((s) => {
      try {
        localStorage.setItem(SOUND_KEY, s ? "off" : "on");
      } catch {}
      return !s;
    });
  };

  const tool = "rpg-btn inline-flex min-h-10 items-center gap-1.5 px-2.5 text-sm font-medium sm:px-3";

  return (
    <div className="rpg">
      {/* Always-visible toolbar */}
      <div className="rpg-pad relative flex flex-wrap items-center gap-2 border-b-4 border-t-0 px-3 py-2 sm:px-4">
        <a href="#directory" className={tool}>
          <span className="sm:hidden">Projects</span>
          <span className="hidden sm:inline">All projects</span>
        </a>
        <a href={site.resume} target="_blank" rel="noopener" className={tool}>
          Résumé <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
        </a>
        <Link href="/?view=lab" className={tool}>
          <LogOut aria-hidden className="h-3.5 w-3.5" /> Exit<span className="hidden sm:inline">&nbsp;campus</span>
        </Link>
        <button
          ref={settingsBtn}
          type="button"
          aria-expanded={settings}
          aria-controls={`${uid}-settings`}
          onClick={() => setSettings((s) => !s)}
          className={`${tool} ml-auto`}
        >
          <Settings2 aria-hidden className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Controls &amp; sound</span>
        </button>

        {settings && (
          <div id={`${uid}-settings`} role="region" aria-label="Controls and sound" className="rpg-box absolute right-2 top-full z-30 mt-2 w-[min(22rem,calc(100vw-1rem))] p-4 text-sm">
            <p className="font-pixel text-[11px] uppercase">Controls</p>
            <dl className="mt-2 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-y-1">
              <dt className="font-semibold">Move</dt>
              <dd>Arrow keys or WASD · the pad on touch screens</dd>
              <dt className="font-semibold">Interact</dt>
              <dd>E or Enter · the E button</dd>
              <dt className="font-semibold">Close</dt>
              <dd>Escape</dd>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" aria-pressed={sound} onClick={toggleSound} className={tool}>
                {sound ? <Volume2 aria-hidden className="h-4 w-4" /> : <VolumeX aria-hidden className="h-4 w-4" />}
                Sound {sound ? "on" : "off"}
              </button>
              <button type="button" onClick={() => choose(mode === "game" ? "static" : "game")} className={tool}>
                {mode === "game" ? "Use the static map" : "Play the campus"}
              </button>
            </div>
            {reduced && <p className="mt-3 text-xs leading-relaxed">Your system asks for reduced motion, so the static map is the default.</p>}
          </div>
        )}
      </div>

      {mode === "game" ? (
        <div className="relative">
          {!ready && (
            <div className="absolute inset-0 z-10 overflow-hidden" aria-hidden>
              {staticMap}
              <p role="status" className="rpg-box absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 font-pixel text-xs uppercase">
                Loading the campus…
              </p>
            </div>
          )}
          <CampusGame sound={sound} reducedMotion={reduced} onReady={() => setReady(true)} />
        </div>
      ) : (
        <div>
          {staticMap}
          {mode === "static" && (
            <p className="rpg-hint flex flex-wrap items-center justify-between gap-2 px-3 py-2 font-pixel text-[11px] uppercase">
              <span>Static map · select a building to open it</span>
              <button type="button" onClick={() => choose("game")} className="rpg-btn min-h-9 px-2.5 normal-case">
                Play the campus
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
