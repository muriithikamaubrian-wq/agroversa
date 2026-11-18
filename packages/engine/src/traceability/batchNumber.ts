export const initials = (s: string) => s.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('.')
const p2 = (n: number) => String(n).padStart(2, '0')
export const ddmmyy = (d = new Date()) => p2(d.getDate()) + p2(d.getMonth() + 1) + String(d.getFullYear()).slice(2)
/** Broiler + Starter, 1st production, 15 Nov 2026 -> B.S-001-151126. Scaled feeds get an SC. prefix. */
export function batchNumber(species: string, stage: string, existingWithSameCode: number, opts: { scaled?: boolean; date?: Date } = {}) {
  const code = (opts.scaled ? 'SC.' : '') + initials(`${species} ${stage}`)
  return { code, no: `${code}-${String(existingWithSameCode + 1).padStart(3, '0')}-${ddmmyy(opts.date)}` }
}
