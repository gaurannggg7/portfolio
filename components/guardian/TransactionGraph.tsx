"use client";

import { useMemo, useState } from "react";
import {
  REPORTING_THRESHOLD,
  accounts,
  money,
  pageRank,
  signals,
  transfers,
  type Transfer,
} from "@/content/guardian-graph";

type Selection = { kind: "account"; id: string } | { kind: "transfer"; id: string } | null;

const NODE = 40;
const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));

/** Edge endpoints trimmed to the node squares so arrowheads stay visible. */
function edgeLine(t: Transfer) {
  const a = byId[t.from];
  const b = byId[t.to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Distance from square centre to its border along the direction.
  const pad = (NODE / 2) / Math.max(Math.abs(ux), Math.abs(uy)) + 4;
  return { x1: a.x + ux * pad, y1: a.y + uy * pad, x2: b.x - ux * pad, y2: b.y - uy * pad };
}

export default function TransactionGraph() {
  const [selection, setSelection] = useState<Selection>(null);
  const [showPattern, setShowPattern] = useState(false);
  const ranks = useMemo(() => pageRank(), []);
  const ranked = useMemo(() => Object.entries(ranks).sort((a, b) => b[1] - a[1]), [ranks]);
  const maxRank = ranked[0][1];

  const selectedAccount = selection?.kind === "account" ? byId[selection.id] : null;
  const selectedTransfer = selection?.kind === "transfer" ? transfers.find((t) => t.id === selection.id) : null;

  const isEdgeActive = (t: Transfer) => {
    if (selectedAccount) return t.from === selectedAccount.id || t.to === selectedAccount.id;
    if (selectedTransfer) return t.id === selectedTransfer.id;
    if (showPattern) return t.inPattern;
    return true;
  };
  const isNodeActive = (id: string) => {
    if (selectedAccount) return id === selectedAccount.id || transfers.some((t) => isEdgeActive(t) && (t.from === id || t.to === id));
    if (selectedTransfer) return id === selectedTransfer.from || id === selectedTransfer.to;
    if (showPattern) return byId[id].inPattern;
    return true;
  };
  const dimming = Boolean(selection) || showPattern;

  const edgeColor = (t: Transfer) => {
    if (showPattern && t.inPattern) return "var(--guardian)";
    if (dimming && isEdgeActive(t)) return "var(--ink)";
    return "var(--rule-strong)";
  };

  const toggleAccount = (id: string) =>
    setSelection((s) => (s?.kind === "account" && s.id === id ? null : { kind: "account", id }));

  return (
    <div>
      <p className="border border-guardian/40 bg-guardian-soft px-4 py-3 text-sm leading-relaxed text-ink">
        <strong className="font-semibold">Synthetic, educational example.</strong> {accounts.length} made-up accounts and{" "}
        {transfers.length} made-up transfers. This is not GuardianAI&apos;s data or its trained model&apos;s output. The
        PageRank scores below are computed on this toy graph in your browser.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={showPattern}
              onClick={() => {
                setShowPattern((v) => !v);
                setSelection(null);
              }}
              className={`inline-flex min-h-11 items-center gap-2 border px-3 text-sm font-medium transition-colors ${
                showPattern ? "border-guardian bg-guardian text-bg" : "border-rule text-ink hover:border-rule-strong"
              }`}
            >
              <span aria-hidden className={`h-2.5 w-2.5 border ${showPattern ? "border-bg bg-bg" : "border-guardian"}`} />
              Highlight the suspicious pattern
            </button>
            {selection && (
              <button
                type="button"
                onClick={() => setSelection(null)}
                className="min-h-11 px-2 text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="border border-rule bg-surface">
            <svg
              viewBox="50 28 572 360"
              role="group"
              aria-label="Synthetic transaction network. Select an account to inspect its transfers."
              className="block h-auto w-full"
            >
              <defs>
                {["ink", "guardian", "rule-strong"].map((c) => (
                  <marker key={c} id={`arrow-${c}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0 0L8 4L0 8z" style={{ fill: `var(--${c})` }} />
                  </marker>
                ))}
              </defs>

              {transfers.map((t) => {
                const l = edgeLine(t);
                const active = isEdgeActive(t);
                const color = edgeColor(t);
                const marker = color === "var(--guardian)" ? "guardian" : color === "var(--ink)" ? "ink" : "rule-strong";
                const width = 1 + Math.log10(t.amount) / 2;
                return (
                  <g key={t.id} opacity={dimming && !active ? 0.18 : 1}>
                    <line {...l} style={{ stroke: color }} strokeWidth={width} markerEnd={`url(#arrow-${marker})`} />
                    {/* Wide invisible stroke makes the edge easy to tap */}
                    <line
                      {...l}
                      stroke="transparent"
                      strokeWidth={16}
                      className="cursor-pointer"
                      onClick={() => setSelection({ kind: "transfer", id: t.id })}
                    >
                      <title>{`${t.from} → ${t.to}: ${money(t.amount)}, ${t.when}`}</title>
                    </line>
                  </g>
                );
              })}

              {accounts.map((a) => {
                const active = isNodeActive(a.id);
                const isSel = selectedAccount?.id === a.id;
                const inPatternView = showPattern && a.inPattern;
                return (
                  <g
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSel}
                    aria-label={`Account ${a.label}. ${a.note}`}
                    onClick={() => toggleAccount(a.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleAccount(a.id);
                      }
                    }}
                    opacity={dimming && !active ? 0.3 : 1}
                    className="cursor-pointer outline-none [&:focus-visible>rect.ring]:opacity-100"
                  >
                    <rect className="ring" x={a.x - NODE / 2 - 5} y={a.y - NODE / 2 - 5} width={NODE + 10} height={NODE + 10} fill="none" style={{ stroke: "var(--focus)" }} strokeWidth={2.5} opacity={0} />
                    <rect x={a.x - 28} y={a.y - 28} width={56} height={56} fill="transparent" />
                    <rect
                      x={a.x - NODE / 2}
                      y={a.y - NODE / 2}
                      width={NODE}
                      height={NODE}
                      shapeRendering="crispEdges"
                      style={{
                        fill: isSel ? "var(--ink)" : inPatternView ? "var(--guardian-soft)" : "var(--bg)",
                        stroke: isSel ? "var(--ink)" : inPatternView ? "var(--guardian)" : "var(--rule-strong)",
                      }}
                      strokeWidth={2}
                    />
                    <text
                      x={a.x}
                      y={a.y + 1}
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className="graph-label font-mono"
                      fontSize={17}
                      style={{ fill: isSel ? "var(--bg)" : "var(--ink)" }}
                    >
                      {a.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-2 text-xs text-ink-3">
            Arrows show the direction money moves. Thicker lines mean larger amounts. Select a square or an arrow.
          </p>
        </div>

        <aside aria-live="polite" className="lg:col-span-5">
          <Inspector
            account={selectedAccount}
            transfer={selectedTransfer ?? null}
            showPattern={showPattern}
            ranks={ranks}
            onSelectTransfer={(id) => setSelection({ kind: "transfer", id })}
            onSelectAccount={(id) => setSelection({ kind: "account", id })}
          />

          <section className="mt-8">
            <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">PageRank on this toy graph</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              Weighted by amount. The collector rises to the top because money from several paths ends up there. This
              shows why centrality is a useful feature; it isn&apos;t a fraud score.
            </p>
            <ol className="mt-3 space-y-1.5">
              {ranked.slice(0, 5).map(([id, score], i) => (
                <li key={id} className="grid grid-cols-[2.5rem_minmax(0,1fr)_3.5rem] items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelection({ kind: "account", id })}
                    className="min-h-9 text-left font-mono text-sm text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                  >
                    {id}
                  </button>
                  <span aria-hidden className="h-2 bg-surface-2">
                    <span
                      className="block h-full"
                      style={{ width: `${(score / maxRank) * 100}%`, background: i === 0 ? "var(--guardian)" : "var(--rule-strong)" }}
                    />
                  </span>
                  <span className="text-right font-mono text-xs text-ink-2">{score.toFixed(3)}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-4">
        <summary className="min-h-11 cursor-pointer py-2 text-[15px] font-medium text-ink">
          All {transfers.length} synthetic transfers as a table
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">Synthetic transfers in the GuardianAI example</caption>
            <thead>
              <tr className="border-b border-rule-strong font-mono text-xs uppercase tracking-[0.08em] text-ink-3">
                <th scope="col" className="py-2 pr-3 font-normal">From</th>
                <th scope="col" className="py-2 pr-3 font-normal">To</th>
                <th scope="col" className="py-2 pr-3 text-right font-normal">Amount</th>
                <th scope="col" className="py-2 pr-3 font-normal">When</th>
                <th scope="col" className="py-2 pr-3 font-normal">In the pattern?</th>
                <th scope="col" className="py-2 font-normal"><span className="sr-only">Inspect</span></th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-b border-rule">
                  <td className="py-2 pr-3 font-mono">{t.from}</td>
                  <td className="py-2 pr-3 font-mono">{t.to}</td>
                  <td className="py-2 pr-3 text-right font-mono">{money(t.amount)}</td>
                  <td className="py-2 pr-3 text-ink-2">{t.when}</td>
                  <td className="py-2 pr-3 text-ink-2">{t.inPattern ? "Yes" : "No"}</td>
                  <td className="py-1">
                    <button
                      type="button"
                      onClick={() => setSelection({ kind: "transfer", id: t.id })}
                      className="min-h-9 text-ink underline underline-offset-4"
                    >
                      Inspect<span className="sr-only"> transfer {t.from} to {t.to}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function Inspector({
  account,
  transfer,
  showPattern,
  ranks,
  onSelectTransfer,
  onSelectAccount,
}: {
  account: (typeof accounts)[number] | null;
  transfer: Transfer | null;
  showPattern: boolean;
  ranks: Record<string, number>;
  onSelectTransfer: (id: string) => void;
  onSelectAccount: (id: string) => void;
}) {
  if (account) {
    const related = transfers.filter((t) => t.from === account.id || t.to === account.id);
    const inflow = related.filter((t) => t.to === account.id).reduce((s, t) => s + t.amount, 0);
    const outflow = related.filter((t) => t.from === account.id).reduce((s, t) => s + t.amount, 0);
    return (
      <section className="border-t-2 border-ink bg-surface p-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Account</p>
        <h4 className="mt-1 font-mono text-2xl text-ink">{account.label}</h4>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{account.note}</p>
        <dl className="mt-3 grid grid-cols-3 gap-3 border-y border-rule py-3 font-mono text-sm">
          <div>
            <dt className="text-xs text-ink-3">In</dt>
            <dd className="text-ink">{money(inflow)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-3">Out</dt>
            <dd className="text-ink">{money(outflow)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-3">PageRank</dt>
            <dd className="text-ink">{ranks[account.id].toFixed(3)}</dd>
          </div>
        </dl>
        <h5 className="mt-4 text-sm font-semibold text-ink">Connected transfers ({related.length})</h5>
        <ul className="mt-2 divide-y divide-rule">
          {related.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelectTransfer(t.id)}
                className="grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-1.5 text-left text-sm hover:bg-surface-2"
              >
                <span className="font-mono text-ink">
                  {t.from} → {t.to}
                  <span className="ml-2 font-sans text-xs text-ink-3">{t.when}</span>
                </span>
                <span className={`font-mono ${t.inPattern && showPattern ? "text-guardian" : "text-ink-2"}`}>{money(t.amount)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (transfer) {
    const gap = REPORTING_THRESHOLD - transfer.amount;
    return (
      <section className="border-t-2 border-ink bg-surface p-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Transfer</p>
        <h4 className="mt-1 font-mono text-2xl text-ink">
          <button type="button" onClick={() => onSelectAccount(transfer.from)} className="underline decoration-rule-strong underline-offset-4">
            {transfer.from}
          </button>{" "}
          →{" "}
          <button type="button" onClick={() => onSelectAccount(transfer.to)} className="underline decoration-rule-strong underline-offset-4">
            {transfer.to}
          </button>
        </h4>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-y border-rule py-3 font-mono text-sm">
          <div>
            <dt className="text-xs text-ink-3">Amount</dt>
            <dd className="text-ink">{money(transfer.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-3">When</dt>
            <dd className="text-ink">{transfer.when}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          {transfer.inPattern
            ? `Part of the illustrative pattern. It is ${money(gap)} under the $10,000 threshold, and it sits next to four near-identical transfers in the same window.`
            : "Ordinary activity: the amount, timing, and counterparties look like salary, rent, or bills."}
        </p>
      </section>
    );
  }

  return (
    <section className="border-t-2 border-guardian bg-surface p-5">
      {showPattern ? (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">What gives it away</p>
          <ol className="mt-3 space-y-3">
            {signals.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
                <span className="font-mono text-sm text-guardian">{i + 1}</span>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Inspector</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            Select an account to see its transfers, or highlight the suspicious pattern to see which signals separate
            it from ordinary salary-and-rent activity.
          </p>
        </>
      )}
    </section>
  );
}
