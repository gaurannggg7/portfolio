import { Fragment } from "react";

/**
 * A deliberately small Markdown renderer for the OSINT reports: headings,
 * rules, lists, pipe tables, bold/italic, and citation markers ([1], [1, 2],
 * 【1】). Reports are committed demo data, never user input.
 */

type CiteProps = { selected: number | null; onCite: (n: number) => void };

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[\d+(?:\s*[,;–-]\s*\d+)*\]|【\d+】|<br\s*\/?>)/g;

function Inline({ text, ...cite }: { text: string } & CiteProps) {
  const parts = text.split(INLINE);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (/^<br/.test(p)) return <br key={i} />;
        if (p.startsWith("**")) return <strong key={i} className="font-semibold text-ink"><Inline text={p.slice(2, -2)} {...cite} /></strong>;
        const cites = p.match(/^\[(.+)\]$|^【(\d+)】$/);
        if (cites) {
          const nums = expand(cites[1] ?? cites[2]);
          return (
            <span key={i} className="whitespace-nowrap">
              {nums.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => cite.onCite(n)}
                  aria-label={`Show excerpt ${n}`}
                  aria-pressed={cite.selected === n}
                  className={`mx-px inline-flex min-h-6 min-w-6 items-center justify-center rounded-control border px-1 align-baseline font-mono text-[11px] leading-none transition-colors ${
                    cite.selected === n ? "border-accent bg-accent text-on-accent" : "border-rule-strong text-ink hover:border-ink"
                  }`}
                >
                  {n}
                </button>
              ))}
            </span>
          );
        }
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

function expand(spec: string): number[] {
  const out: number[] = [];
  for (const part of spec.split(/\s*[,;]\s*/)) {
    const range = part.match(/^(\d+)\s*[–-]\s*(\d+)$/);
    if (range) for (let n = +range[1]; n <= +range[2]; n++) out.push(n);
    else if (/^\d+$/.test(part)) out.push(+part);
  }
  return out;
}

export default function Report({ markdown, ...cite }: { markdown: string } & CiteProps) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (/^-{3,}$/.test(line)) {
      blocks.push(<hr key={i} className="my-4 border-rule" />);
      i++;
    } else if (/^#{1,4}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, "");
      blocks.push(
        level <= 3 ? (
          <h4 key={i} className="mt-5 font-display text-base font-semibold text-ink">
            <Inline text={text} {...cite} />
          </h4>
        ) : (
          <h5 key={i} className="mt-4 text-sm font-semibold text-ink">
            <Inline text={text} {...cite} />
          </h5>
        ),
      );
      i++;
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={i} className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px] leading-relaxed">
            <thead>
              <tr>
                {head.map((h, k) => (
                  <th key={k} scope="col" className="border-b border-rule-strong px-2 py-1.5 font-semibold text-ink">
                    <Inline text={h} {...cite} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, k) => (
                <tr key={k} className="border-b border-rule align-top">
                  {r.map((c, m) => (
                    <td key={m} className="px-2 py-1.5 text-ink-2">
                      <Inline text={c} {...cite} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (/^([-*•]|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^([-*•]|\d+\.)\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-*•]|\d+\.)\s+/, ""));
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={i} className={`my-2 space-y-1.5 pl-5 text-sm leading-relaxed text-ink-2 ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((t, k) => (
            <li key={k}>
              <Inline text={t} {...cite} />
            </li>
          ))}
        </List>,
      );
    } else {
      blocks.push(
        <p key={i} className="my-2 text-sm leading-relaxed text-ink-2">
          <Inline text={line} {...cite} />
        </p>,
      );
      i++;
    }
  }
  return <>{blocks}</>;
}
