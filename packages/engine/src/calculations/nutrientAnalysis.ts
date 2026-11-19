export interface Line { pct: number; nutrients: Record<string, number> }
export function weightedTotals(lines: Line[], keys: string[]) {
  return Object.fromEntries(keys.map(k => [k, lines.reduce((s, l) => s + (l.pct / 100) * (l.nutrients[k] ?? 0), 0)]))
}
