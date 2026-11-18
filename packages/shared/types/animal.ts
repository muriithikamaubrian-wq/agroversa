import type { Requirements } from './requirement.ts'
export interface Stage { id: string; species: string; name: string; duration?: { from: number; fromUnit: 'day'|'week'|'month'; to: number; toUnit: 'day'|'week'|'month' }; requirements: Requirements }
