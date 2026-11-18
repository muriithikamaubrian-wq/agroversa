export type IntakeUnit = 'flock' | 'kg' | 'g'
/** Daily feed for the whole flock in kg. 'flock' = kg per day, 'kg' = kg per animal, 'g' = g per animal. */
export function intakeKgPerDay(value: number, unit: IntakeUnit, animals: number) {
  return unit === 'flock' ? value : unit === 'kg' ? value * animals : (value * animals) / 1000
}
export const daysLasting = (feedKg: number, kgPerDay: number) => (kgPerDay > 0 ? feedKg / kgPerDay : 0)
