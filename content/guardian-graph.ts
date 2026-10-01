/**
 * Synthetic, hand-made transaction network for the GuardianAI illustration.
 * None of these accounts, amounts, or times come from real data or from the
 * project's trained model.
 */

export type Account = {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Plain-language note about the account's role in this toy example. */
  note: string;
  inPattern: boolean;
};

export type Transfer = {
  id: string;
  from: string;
  to: string;
  amount: number;
  /** Day and time inside the synthetic week. */
  when: string;
  inPattern: boolean;
};

export const REPORTING_THRESHOLD = 10_000;

export const accounts: Account[] = [
  { id: "S1", label: "S1", x: 92, y: 200, inPattern: true, note: "Origin. Splits one large sum into five transfers within a few hours." },
  { id: "M1", label: "M1", x: 260, y: 64, inPattern: true, note: "Pass-through. Gets one transfer and forwards almost all of it the next day." },
  { id: "M2", label: "M2", x: 260, y: 132, inPattern: true, note: "Pass-through. Gets one transfer and forwards almost all of it the next day." },
  { id: "M3", label: "M3", x: 260, y: 200, inPattern: true, note: "Pass-through. Gets one transfer and forwards almost all of it the next day." },
  { id: "M4", label: "M4", x: 260, y: 268, inPattern: true, note: "Pass-through. Gets one transfer and forwards almost all of it the next day." },
  { id: "M5", label: "M5", x: 260, y: 336, inPattern: true, note: "Pass-through. Gets one transfer and forwards almost all of it the next day." },
  { id: "C1", label: "C1", x: 430, y: 200, inPattern: true, note: "Collector. Receives the forwarded money from all five pass-through accounts." },
  { id: "P1", label: "P1", x: 560, y: 60, inPattern: false, note: "Employer. Pays salaries. Ordinary activity." },
  { id: "A1", label: "A1", x: 580, y: 160, inPattern: false, note: "Ordinary account: salary in, rent and bills out." },
  { id: "A2", label: "A2", x: 580, y: 300, inPattern: false, note: "Ordinary account: salary in, rent and bills out." },
  { id: "L1", label: "L1", x: 470, y: 352, inPattern: false, note: "Landlord. Receives rent. Ordinary activity." },
  { id: "U1", label: "U1", x: 450, y: 64, inPattern: false, note: "Utility company. Receives small bills. Ordinary activity." },
];

export const transfers: Transfer[] = [
  { id: "t1", from: "S1", to: "M1", amount: 9400, when: "Mon 09:12", inPattern: true },
  { id: "t2", from: "S1", to: "M2", amount: 9650, when: "Mon 09:40", inPattern: true },
  { id: "t3", from: "S1", to: "M3", amount: 9800, when: "Mon 10:05", inPattern: true },
  { id: "t4", from: "S1", to: "M4", amount: 9200, when: "Mon 10:31", inPattern: true },
  { id: "t5", from: "S1", to: "M5", amount: 9700, when: "Mon 11:02", inPattern: true },
  { id: "t6", from: "M1", to: "C1", amount: 9300, when: "Tue 08:15", inPattern: true },
  { id: "t7", from: "M2", to: "C1", amount: 9550, when: "Tue 08:47", inPattern: true },
  { id: "t8", from: "M3", to: "C1", amount: 9700, when: "Tue 09:20", inPattern: true },
  { id: "t9", from: "M4", to: "C1", amount: 9100, when: "Tue 09:58", inPattern: true },
  { id: "t10", from: "M5", to: "C1", amount: 9600, when: "Tue 10:26", inPattern: true },
  { id: "t11", from: "P1", to: "A1", amount: 3200, when: "Fri 06:00", inPattern: false },
  { id: "t12", from: "P1", to: "A2", amount: 2900, when: "Fri 06:00", inPattern: false },
  { id: "t13", from: "A1", to: "L1", amount: 1450, when: "Fri 12:30", inPattern: false },
  { id: "t14", from: "A2", to: "L1", amount: 1380, when: "Sat 10:10", inPattern: false },
  { id: "t15", from: "A1", to: "U1", amount: 86, when: "Wed 18:45", inPattern: false },
  { id: "t16", from: "A2", to: "U1", amount: 74, when: "Thu 19:03", inPattern: false },
];

export const signals = [
  {
    title: "Fan-out",
    body: "One account sends to five accounts it has never paid before, all within two hours.",
  },
  {
    title: "Just under the threshold",
    body: "Every one of those transfers is between $9,200 and $9,800, just below a $10,000 reporting threshold. That is the classic sign of structuring.",
  },
  {
    title: "Pass-through",
    body: "Each intermediate account forwards about 99% of what it received the next morning and does little else.",
  },
  {
    title: "Fan-in",
    body: "Everything ends up in one collector account. Centrality measures like PageRank pick this out, because money from many paths flows into one node.",
  },
];

/** Weighted PageRank over the synthetic graph (amount-weighted edges). */
export function pageRank(damping = 0.85, iterations = 60): Record<string, number> {
  const ids = accounts.map((a) => a.id);
  const n = ids.length;
  const outWeight: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]));
  for (const t of transfers) outWeight[t.from] += t.amount;

  let rank: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 1 / n]));
  for (let i = 0; i < iterations; i++) {
    const next: Record<string, number> = Object.fromEntries(ids.map((id) => [id, (1 - damping) / n]));
    // Accounts with no outgoing transfers spread their rank evenly.
    const danglingMass = ids.filter((id) => outWeight[id] === 0).reduce((s, id) => s + rank[id], 0);
    for (const id of ids) next[id] += (damping * danglingMass) / n;
    for (const t of transfers) next[t.to] += (damping * rank[t.from] * t.amount) / outWeight[t.from];
    rank = next;
  }
  return rank;
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
