export type Method = 'cost' | 'target' | 'scale'
export interface FormulationLine { ingredientId: string; name: string; pct: number; kg: number; pricePerKg: number }
export interface FormulationRun { id: string; batchNo: string; name: string; method: Method; stageId: string; totalKg: number; costPerKg: number; batchCost: number; feasible: boolean; reasons: string[]; scaledFrom?: string; ratio?: number; lines: FormulationLine[]; savedAt: string }
