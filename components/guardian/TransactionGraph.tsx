"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  REPORTING_THRESHOLD,
  accounts,
  money,
  pageRank,
  signals,
  transfers,
  type Transfer,
} from "@/content/guardian-graph";
import NetworkDiagram, { accountById as byId, type Selection } from "./NetworkDiagram";

export default function TransactionGraph() {
  const [selection, setSelection] = useState<Selection>(null);
  const [showPattern, setShowPattern] = useState(false);
  const ranks = useMemo(() => pageRank(), []);
  const ranked = useMemo(() => Object.entries(ranks).sort((a, b) => b[1] - a[1]), [ranks]);
  const maxRank = ranked[0][1];

  const selectedAccount = selection?.kind === "account" ? byId[selection.id] : null;
  const selectedTransfer = selection?.kind === "transfer" ? transfers.find((t) => t.id === selection.id) : null;

  const toggleAccount = (id: string) =>
    setSelection((s) => (s?.kind === "account" && s.id === id ? null : { kind: "account", id }));

  return (
    <div>
      <p className="rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">
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
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors ${
                showPattern ? "border-accent bg-accent text-on-accent" : "border-rule text-ink hover:border-rule-strong"
              }`}
            >
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full border ${showPattern ? "border-on-accent bg-on-accent" : "border-accent"}`} />
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

          <div className="overflow-hidden rounded-xl border border-rule bg-surface">
            <NetworkDiagram
              idPrefix="explorer"
              selection={selection}
              showPattern={showPattern}
              onToggleAccount={toggleAccount}
              onSelectTransfer={(id) => setSelection({ kind: "transfer", id })}
              label="Synthetic transaction network. Select an account to inspect its transfers."
            />
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
                      style={{ width: `${(score / maxRank) * 100}%`, background: i === 0 ? "var(--accent)" : "var(--rule-strong)" }}
                    />
                  </span>
                  <span className="text-right font-mono text-xs text-ink-2">{score.toFixed(3)}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <details className="mt-8 rounded-lg border border-rule">
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-medium text-ink">
          <ChevronRight aria-hidden className="chev h-4 w-4 text-ink-3" />
          All {transfers.length} synthetic transfers as a table
        </summary>
        <div className="overflow-x-auto border-t border-rule px-4 py-3">
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
      <section className="rounded-xl border border-rule bg-surface p-5">
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
                <span className={`font-mono ${t.inPattern && showPattern ? "text-accent" : "text-ink-2"}`}>{money(t.amount)}</span>
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
      <section className="rounded-xl border border-rule bg-surface p-5">
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
    <section className="rounded-xl border border-rule bg-surface p-5">
      {showPattern ? (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">What gives it away</p>
          <ol className="mt-3 space-y-3">
            {signals.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
                <span className="font-mono text-sm text-accent">{i + 1}</span>
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
