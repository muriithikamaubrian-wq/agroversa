import type { Requirements } from '../../../shared/types/requirement.ts'
export interface Check { feasible: boolean; reasons: string[]; warnings: string[] }
/** Below a minimum = not feasible (with the reason). Above a maximum = warning only. */
export function checkFeasibility(totals: Record<string, number>, req: Requirements, labels: Record<string, string>, inclusionTotalPct: number): Check {
  const reasons: string[] = [], warnings: string[] = []
  if (Math.abs(inclusionTotalPct - 100) > 0.05) reasons.push(`Inclusion totals ${inclusionTotalPct.toFixed(2)}%. It must be 100%.`)
  for (const k of Object.keys(req)) {
    const v = totals[k] ?? 0, { min, max } = req[k], l = labels[k] ?? k
    if (v < min - 1e-9) reasons.push(`${l} is below the minimum (${v.toFixed(2)} against ${min}).`)
    else if (v > max + 1e-9) warnings.push(`${l} is above the maximum of ${max}.`)
  }
  return { feasible: reasons.length === 0, reasons, warnings }
}
