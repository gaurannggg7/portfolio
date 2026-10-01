import { RELIABILITY } from "@/content/baseline-eval";

/** Before/after measurements from Baseline's evaluation report. */
export default function ReliabilityTable() {
  return (
    <div className="overflow-x-auto rounded-panel border border-rule bg-surface shadow-panel">
      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
        <caption className="label px-4 pb-1 pt-3 text-left">Measured before and after the fixes · eval/RESULTS.md</caption>
        <thead>
          <tr className="border-b border-rule-strong">
            <th scope="col" className="label px-4 py-2 font-normal">Measure</th>
            <th scope="col" className="label px-4 py-2 font-normal">Before</th>
            <th scope="col" className="label px-4 py-2 font-normal">After</th>
          </tr>
        </thead>
        <tbody>
          {RELIABILITY.map((r) => (
            <tr key={r.measure} className="border-b border-rule last:border-b-0">
              <th scope="row" className="px-4 py-2.5 font-normal text-ink">
                {r.measure}
                {r.note && <span className="block text-xs text-ink-3">{r.note}</span>}
              </th>
              <td className="px-4 py-2.5 font-mono text-ink-2">{r.before}</td>
              <td className="px-4 py-2.5 font-mono font-medium text-ink">{r.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
