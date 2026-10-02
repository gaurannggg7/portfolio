"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { osintDemo } from "@/content/osint-prerecorded";
import Report from "./Report";

const SOURCE_LABEL: Record<string, string> = { SEC_EDGAR: "SEC EDGAR", OFAC_SDN: "OFAC SDN", COURTLISTENER: "CourtListener" };

/**
 * Evidence explorer over the OSINT analyst's committed prerecorded responses.
 * It never calls the backend, so it works whether or not the live service is up.
 */
export default function EvidenceExplorer() {
  const uid = useId();
  const [q, setQ] = useState(0);
  const [sel, setSel] = useState<number | null>(1);
  const r = osintDemo.responses[q];
  const source = r.sources.find((s) => s.index === sel) ?? null;
  const cited = r.sources.filter((s) => s.cited).length;
  const docs = new Set(r.sources.map((s) => s.docId)).size;

  const choose = (i: number) => {
    setQ(i);
    setSel(1);
  };
  const cite = (n: number) => {
    setSel(n);
    document.getElementById(`${uid}-excerpt`)?.focus({ preventScroll: window.matchMedia("(min-width: 1024px)").matches });
  };

  return (
    <div className="space-y-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-panel border border-rule bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink-2">
        <span className="rounded-control border border-ink px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink">Prerecorded</span>
        <span>
          Saved output of a real run (retrieval plus {osintDemo.model}) recorded on 18 Sep 2026 and replayed unchanged. Not generated for you,
          and nothing here calls the backend.
        </span>
      </p>

      <div role="group" aria-labelledby={`${uid}-q`}>
        <p id={`${uid}-q`} className="label">
          1 · Choose a prepared question
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {osintDemo.responses.map((x, i) => (
            <li key={x.query}>
              <button
                type="button"
                aria-pressed={q === i}
                onClick={() => choose(i)}
                className={`flex min-h-12 w-full items-center rounded-control border px-3 py-2 text-left text-[15px] transition-colors ${
                  q === i ? "border-ink bg-ink text-bg" : "border-rule-strong bg-surface text-ink hover:border-ink"
                }`}
              >
                {x.query}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 [&>*]:min-w-0">
        <section aria-labelledby={`${uid}-rep`} className="rounded-panel border border-rule bg-surface shadow-panel lg:col-span-7 lg:self-start">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3">
            <h3 id={`${uid}-rep`} className="label">
              2 · Read the report · select a citation
            </h3>
            <p className="font-mono text-[11px] text-ink-3">
              LLM call {r.tokenUsage.latency_seconds}s · {r.tokenUsage.total_tokens} tokens
            </p>
          </div>
          <div tabIndex={0} aria-label="Report text" className="max-h-[34rem] overflow-y-auto px-4 pb-4 lg:max-h-[44rem]">
            <Report markdown={r.report} selected={sel} onCite={cite} />
          </div>
        </section>

        <aside aria-labelledby={`${uid}-src`} className="space-y-3 lg:col-span-5">
          <div className="rounded-panel border border-rule bg-surface p-4 shadow-panel">
            <h3 id={`${uid}-src`} className="label">
              3 · Retrieved vs cited
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">
              Retrieved: the top {r.sources.length} excerpts ({docs} distinct filings) sent to the model. Cited: excerpts the report marks with
              a number. In this run {cited === r.sources.length ? "every retrieved excerpt was cited" : `${cited} of ${r.sources.length} were cited`}.
            </p>
            <ol className="mt-3 space-y-1.5">
              {r.sources.map((s) => (
                <li key={s.index}>
                  <button
                    type="button"
                    aria-pressed={sel === s.index}
                    onClick={() => setSel(s.index)}
                    className={`grid min-h-11 w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-2 rounded-control border px-2 py-1.5 text-left text-sm transition-colors ${
                      sel === s.index ? "border-accent bg-accent-soft" : "border-rule hover:border-rule-strong"
                    }`}
                  >
                    <span className="font-mono text-xs text-ink-2">[{s.index}]</span>
                    <span className="truncate text-ink">{s.title}</span>
                    <span className="font-mono text-[10px] uppercase text-ink-3">{s.cited ? "retrieved · cited" : "retrieved only"}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div id={`${uid}-excerpt`} tabIndex={-1} aria-live="polite" className="rounded-panel border border-rule bg-surface p-4 shadow-panel outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <p className="label">4 · Inspect the excerpt</p>
            {source ? (
              <>
                <p className="mt-2 font-mono text-[11px] text-ink-3">
                  [{source.index}] · {SOURCE_LABEL[source.source] ?? source.source} · {source.cited ? "cited in the report" : "retrieved, not cited"}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{source.title}</p>
                <blockquote className="mt-2 border-l-2 border-rule-strong pl-3 text-sm leading-relaxed text-ink-2">
                  {source.excerpt.replace(/^[.\s]+/, "")}…
                </blockquote>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                >
                  Open the original filing <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
                <p className="mt-3 border-t border-rule pt-3 text-xs leading-relaxed text-ink-3">
                  The system only checks that a citation points at a retrieved excerpt. Whether this excerpt supports the sentence citing it is
                  not verified; read it against the report.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-3">Select a citation in the report or an excerpt above.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
