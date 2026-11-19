import { test } from 'node:test'
import assert from 'node:assert/strict'
import { batchNumber } from '../src/traceability/batchNumber.ts'
import { formatEggs, toBase } from '../src/calculations/units.ts'
import { checkFeasibility } from '../src/validation/feasibilityChecker.ts'
import { intakeKgPerDay, daysLasting } from '../src/productivity/feedIntake.ts'
import { weightedTotals } from '../src/calculations/nutrientAnalysis.ts'

test('batch numbers', () => {
  const d = new Date(2026, 10, 15)
  assert.equal(batchNumber('Broiler', 'Starter', 0, { date: d }).no, 'B.S-001-151126')
  assert.equal(batchNumber('Broiler', 'Grower', 3, { date: d }).no, 'B.G-004-151126')
  assert.equal(batchNumber('Broiler', 'Starter', 0, { date: d, scaled: true }).no, 'SC.B.S-001-151126')
})
test('eggs and trays', () => {
  assert.equal(formatEggs(100), '3 trays 10 eggs')
  assert.equal(formatEggs(30), '1 tray')
  assert.equal(formatEggs(0), '0 eggs')
  assert.deepEqual(toBase(2.5, 't'), { base: 'kg', value: 2500 })
})
test('feasibility', () => {
  const req = { cp: { min: 22, max: 26 } }, lab = { cp: 'Crude protein' }
  const low = checkFeasibility({ cp: 18 }, req, lab, 100)
  assert.equal(low.feasible, false); assert.match(low.reasons[0], /below the minimum/)
  const high = checkFeasibility({ cp: 28 }, req, lab, 100)
  assert.equal(high.feasible, true); assert.equal(high.warnings.length, 1)
  assert.equal(checkFeasibility({ cp: 24 }, req, lab, 97).feasible, false)
})
test('feed intake in kg or g', () => {
  assert.equal(intakeKgPerDay(12, 'flock', 100), 12)
  assert.equal(intakeKgPerDay(0.12, 'kg', 100), 12)
  assert.equal(intakeKgPerDay(120, 'g', 100), 12)
  assert.equal(daysLasting(200, 10), 20)
})
test('weighted totals', () => {
  const t = weightedTotals([{ pct: 60, nutrients: { cp: 10 } }, { pct: 40, nutrients: { cp: 40 } }], ['cp'])
  assert.equal(t.cp, 22)
})
