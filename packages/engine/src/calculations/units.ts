export type Unit = 'g' | 'kg' | 't' | 'mL' | 'L' | 'egg' | 'tray'
export const EGGS_PER_TRAY = 30
export const BASE: Record<Unit, { base: 'kg' | 'L' | 'tray'; factor: number }> = {
  g: { base: 'kg', factor: 0.001 }, kg: { base: 'kg', factor: 1 }, t: { base: 'kg', factor: 1000 },
  mL: { base: 'L', factor: 0.001 }, L: { base: 'L', factor: 1 },
  egg: { base: 'tray', factor: 1 / EGGS_PER_TRAY }, tray: { base: 'tray', factor: 1 },
}
export function toBase(value: number, unit: Unit) { const b = BASE[unit]; return { base: b.base, value: value * b.factor } }
/** 100 eggs -> { trays: 3, eggs: 10 } */
export function splitEggs(eggs: number) { const n = Math.round(eggs); return { trays: Math.floor(n / EGGS_PER_TRAY), eggs: n % EGGS_PER_TRAY } }
export function formatEggs(eggs: number) {
  const { trays, eggs: e } = splitEggs(eggs)
  return [trays ? `${trays} tray${trays === 1 ? '' : 's'}` : '', e || !trays ? `${e} egg${e === 1 ? '' : 's'}` : ''].filter(Boolean).join(' ')
}
