/** Retrieval evaluation from the repository's eval/STAGE_5_RESULTS.md. */
const ROWS = [
  { group: "All queries", n: 17, vector: 0.471, bm25: 0.412, hybrid: 0.529 },
  { group: "OFAC SDN", n: 7, vector: 0.143, bm25: 0.0, hybrid: 0.143 },
  { group: "SEC EDGAR", n: 7, vector: 0.714, bm25: 0.571, hybrid: 0.714 },
  { group: "CourtListener", n: 3, vector: 0.667, bm25: 1.0, hybrid: 1.0 },
];

export default function RetrievalEval() {
  return (
    <figure className="rounded-panel border border-rule bg-surface shadow-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="px-4 pt-3 text-left font-mono text-xs text-ink-2">Mean recall@10 · 2,339-document snapshot (Sep 2026) · 8,036 vectors</caption>
          <thead>
            <tr className="border-b border-rule text-xs text-ink-3">
              <th scope="col" className="px-4 py-2 font-normal">Query group</th>
              <th scope="col" className="px-2 py-2 text-right font-normal">n</th>
              <th scope="col" className="px-2 py-2 text-right font-normal">Vector</th>
              <th scope="col" className="px-2 py-2 text-right font-normal">BM25</th>
              <th scope="col" className="px-4 py-2 text-right font-normal">Hybrid (RRF)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.group} className={`border-b border-rule last:border-0 ${i === 0 ? "font-medium" : ""}`}>
                <th scope="row" className="px-4 py-1.5 font-normal text-ink">{r.group}</th>
                <td className="px-2 py-1.5 text-right font-mono text-ink-3">{r.n}</td>
                <td className="px-2 py-1.5 text-right font-mono text-ink">{r.vector.toFixed(3)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-ink">{r.bm25.toFixed(3)}</td>
                <td className="px-4 py-1.5 text-right font-mono text-ink">{r.hybrid.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="space-y-1 border-t border-rule px-4 py-3 text-xs leading-relaxed text-ink-3">
        <p>Per query, hybrid never beat the better single method: 0 wins, 17 ties, 0 losses. Its higher mean comes from inheriting BM25&apos;s hits.</p>
        <p>
          17 queries from one author, written from known documents; OFAC queries have one labelled answer among many valid ones. Measured
          before a cleaning fix and not re-run. Retrieval only: this says nothing about whether reports are grounded.
        </p>
      </figcaption>
    </figure>
  );
}
