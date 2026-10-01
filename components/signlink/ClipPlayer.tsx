"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Play, RotateCcw } from "lucide-react";
import { clipUrl, datasetUrl, type Clip } from "@/content/signlink-examples";

type Status = "idle" | "playing" | "ended" | "error";

/**
 * Plays the resolver's source clips one after another. Nothing is fetched
 * until the visitor presses play.
 */
export default function ClipPlayer({
  clips,
  sentence,
  compact = false,
}: {
  clips: Clip[];
  sentence: string;
  /** Smaller idle state for the homepage exhibit. */
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip = clips[index];

  const playFrom = (i: number) => {
    // Same clip already mounted: restart it directly (autoPlay only fires on mount).
    if (i === index && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setIndex(i);
    setStatus("playing");
  };

  const onEnded = () => {
    if (index < clips.length - 1) setIndex(index + 1);
    else setStatus("ended");
  };

  return (
    <div>
      <p className="mb-2 h-4 font-mono text-[11px] text-ink-3" aria-live="polite">
        {status !== "idle" && `Clip ${String(index + 1).padStart(2, "0")} of ${String(clips.length).padStart(2, "0")} · ${clip.label}`}
      </p>
      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-rule bg-surface-2">
        {status === "idle" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <button
              type="button"
              onClick={() => playFrom(0)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              <Play aria-hidden className="h-4 w-4" />
              Play {clips.length} source clip{clips.length > 1 ? "s" : ""}
            </button>
            {!compact && (
              <p className="max-w-xs text-xs leading-relaxed text-ink-3">
                Streams small MP4 files from SignLink&apos;s Hugging Face dataset.
              </p>
            )}
          </div>
        ) : status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-sm text-ink">This clip couldn&apos;t be loaded from Hugging Face.</p>
            <a
              href={clipUrl(clip.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-ink underline underline-offset-4"
            >
              Open the clip file <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </a>
            <a href={datasetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-3 underline underline-offset-4">
              Browse the dataset
            </a>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              key={clip.path}
              src={clipUrl(clip.path)}
              autoPlay={status === "playing"}
              muted
              playsInline
              controls
              preload="auto"
              onEnded={onEnded}
              onError={() => setStatus("error")}
              aria-label={`Sign clip ${index + 1} of ${clips.length}: ${clip.label}`}
              className="h-full w-full bg-black object-contain"
            />
          </>
        )}
      </div>

      <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "mt-2" : "mt-3"}`} role="group" aria-label={`Clips for “${sentence}”`}>
        {clips.map((c, i) => {
          const isCurrent = status !== "idle" && i === index;
          return (
            <button
              key={`${c.path}-${i}`}
              type="button"
              onClick={() => playFrom(i)}
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`Play clip ${i + 1}: ${c.label}`}
              className={`min-h-10 min-w-10 rounded-md border px-2.5 font-mono text-xs transition-colors ${
                isCurrent ? "border-ink bg-ink text-bg" : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
        {status === "ended" && (
          <button
            type="button"
            onClick={() => playFrom(0)}
            className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-ink underline underline-offset-4"
          >
            <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Replay
          </button>
        )}
      </div>
    </div>
  );
}
