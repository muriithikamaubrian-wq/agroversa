// Opens the built app in a fake browser and walks through the main flows.
// Run: npm run build && npm run test:smoke   (needs: npm install)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { webcrypto } from 'node:crypto'
import { JSDOM } from 'jsdom'

const html = fs.readFileSync(new URL('../../dist/agroversa.html', import.meta.url), 'utf8').replace(/<link[^>]*>/, '')
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://app.test/', pretendToBeVisual: true,
  beforeParse(w) { Object.defineProperty(w, 'crypto', { value: webcrypto }); w.TextEncoder = TextEncoder; w.addEventListener('error', e => { throw e.error || new Error(e.message) }) } })
const w = dom.window, $ = s => w.document.querySelector(s), E = c => w.eval(c), sleep = ms => new Promise(r => setTimeout(r, ms))

test('create an account and open every screen', async () => {
  $('.lnk').click()
  for (const [i, v] of [['fn', 'Test User'], ['un', 'tester'], ['pw', 'abcdefg1'], ['pc', 'abcdefg1']]) $('#' + i).value = v
  $('#af').dispatchEvent(new w.Event('submit', { cancelable: true })); await sleep(1500)
  assert.ok($('nav'), 'signed in')
  for (const h of ['dashboard', 'animals', 'inventory', 'formulations', 'productivity', 'reports', 'notifications', 'preferences']) {
    w.location.hash = h; await sleep(50); assert.ok($('main').innerHTML.length > 200, h)
  }
})
test('formulate, save once, produce and consume stock', async () => {
  w.location.hash = 'formulations'; await sleep(50)
  w.setupDone()
  for (let i = 0; i < 7; i++) w.togIng(E(`D.ing[${i}].id`))
  w.runCalc(); assert.ok(E('D.F.calc'))
  $('#rn').value = 'Broiler wrl5'; w.saveRun(); const no = E('D.runs[0].no'); assert.match(no, /^B\.S-001-\d{6}$/)
  w.saveRun(); assert.equal(E('D.runs.length'), 1, 'second save does not duplicate')
  $('#pr').value = E('D.runs[0].id'); $('#pk').value = 100; w.mkBatch()
  const stock = E('D.ing[0].stock'); w.confirmB(E('D.batches[0].id'), 1)
  assert.ok(E('D.ing[0].stock') < stock, 'stock reduced')
})
test('scaling gets the SC. prefix', async () => {
  E('D.F.method="scale"'); w.setupDone(); w.pickSrc(E('D.batches[0].id')); w.setRatio(0.3); w.runCalc()
  $('#rn').value = ''; w.saveRun(); assert.match(E('D.runs[0].no'), /^SC\./); assert.match(E('D.runs[0].name'), /^SC\. /)
})
test('productivity: group, quick add in eggs, totals in trays', async () => {
  w.location.hash = 'productivity'; await sleep(50)
  w.grModal(); $('#gn').value = 'Layer pen 2'; $('#gs').value = 'Layer'; w.gst(); $('#gc').value = 100; $('#gon').value = 'Eggs'; $('#gou').value = 'egg'
  await w.saveGr(); const id = E('D.gr[0].id'); w.qaModal(id); $('#qv').value = 45; w.qaAdd(id, E('iso(new Date())'))
  $('#qv').value = 30; w.qaAdd(id, E('iso(new Date())')); assert.equal(E('outStr(D.perf[0])'), '75 eggs (2 trays 15 eggs)')
})
test('reports draw charts', async () => {
  w.location.hash = 'reports'; await sleep(50); assert.ok(w.document.querySelectorAll('svg.ch').length >= 5)
})
test.after(() => w.close())
