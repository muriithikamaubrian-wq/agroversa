// Builds dist/agroversa.html: one file you can open in any browser, with no server.
// Usage: node scripts/build.mjs   (or: npm run build)
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build.manifest.json'), 'utf8'))
const read = f => fs.readFileSync(path.join(root, f), 'utf8')
const html = read('apps/desktop/index.html')
  .replace('/*STYLES*/', () => manifest.css.map(read).join('\n'))
  .replace('/*SCRIPT*/', () => manifest.js.map(f => `/* ${f} */\n${read(f)}`).join('\n'))
fs.mkdirSync(path.join(root, 'dist'), { recursive: true })
fs.writeFileSync(path.join(root, 'dist/agroversa.html'), html)
console.log(`Built dist/agroversa.html (${(html.length / 1024).toFixed(0)} KB) from ${manifest.js.length} script and ${manifest.css.length} style files`)
