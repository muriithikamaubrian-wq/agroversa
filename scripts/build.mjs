// Builds the app into dist/: agroversa.html (single file), index.html (same file, for hosting),
// plus the files that make it installable (manifest, service worker, icons).
// Usage: node scripts/build.mjs   (or: npm run build)
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build.manifest.json'), 'utf8'))
const read = f => fs.readFileSync(path.join(root, f), 'utf8')
const html = read('apps/desktop/index.html')
  .replace('/*STYLES*/', () => manifest.css.map(read).join('\n'))
  .replace('/*SCRIPT*/', () => manifest.js.map(f => `/* ${f} */\n${read(f)}`).join('\n'))
fs.mkdirSync(dist, { recursive: true })
fs.writeFileSync(path.join(dist, 'agroversa.html'), html)
fs.writeFileSync(path.join(dist, 'index.html'), html)
const pub = path.join(root, 'apps/desktop/public')
for (const f of fs.readdirSync(pub)) {
  const src = path.join(pub, f)
  if (f === 'sw.js') fs.writeFileSync(path.join(dist, f), fs.readFileSync(src, 'utf8').replace('__BUILD__', String(Date.now())))
  else fs.copyFileSync(src, path.join(dist, f))
}
console.log(`Built dist/ (${(html.length / 1024).toFixed(0)} KB app, ${fs.readdirSync(pub).length} install files) from ${manifest.js.length} script and ${manifest.css.length} style files`)
