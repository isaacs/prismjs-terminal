import { readdirSync, readFileSync } from 'fs'
import { basename, dirname, resolve } from 'path'
import t from 'tap'
import { fileURLToPath } from 'url'
import {
  highlight,
  highlightFile,
  highlightFileSync,
  Theme,
  themes,
} from '../src/index.js'
t.type(highlight, 'function')
t.type(highlightFile, 'function')
t.type(highlightFileSync, 'function')
t.type(themes, 'object')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixturesDir = resolve(__dirname, 'fixtures')
const files = readdirSync(fixturesDir)
const fixtures = files.map(f => resolve(fixturesDir, f))
const contents = fixtures.map(f => [f, readFileSync(f, 'utf8')])

for (const [f, code] of contents as [string, string][]) {
  t.test(basename(f), t => {
    for (const [name, theme] of Object.entries(themes) as [
      keyof typeof themes,
      Theme
    ][]) {
      const c = highlight(code, { theme: name, lineNumbers: true })
      t.matchSnapshot(c, name)
      t.equal(
        highlight(code, { theme, lineNumbers: true }),
        c,
        'same when using theme object'
      )
      t.equal(
        highlight(code.trimEnd(), { theme: name, lineNumbers: true }),
        c,
        'same when code lacks trailing CR'
      )
    }
    t.end()
  })
}

t.test('js file', async t => {
  const file = resolve(__dirname, '../dist/esm/index.js')
  const a = await highlightFile(file)
  t.matchSnapshot(a, 'async')
  const s = highlightFileSync(file)
  t.matchSnapshot(s, 'sync')
  t.equal(s, a, 'sync matches async')
  const e = highlightFileSync(file, {
    language: 'javascript',
  })
  t.equal(e, s, 'explicit language matches detection')
})

t.test('htm file', async t => {
  const file = resolve(fixturesDir, 'file.htm')
  const a = await highlightFile(file)
  t.matchSnapshot(a, 'async')
  const s = highlightFileSync(file)
  t.matchSnapshot(s, 'sync')
  t.equal(s, a, 'sync matches async')
  const e = highlightFileSync(file, {
    language: 'html',
  })
  t.equal(e, s, 'explicit language matches detection')
})

t.test('tsx file', async t => {
  const file = resolve(fixturesDir, 'file.tsx')
  const a = await highlightFile(file)
  t.matchSnapshot(a, 'async')
  const s = highlightFileSync(file)
  t.matchSnapshot(s, 'sync')
  t.equal(s, a, 'sync matches async')
  const e = highlightFileSync(file, {
    language: 'tsx',
  })
  t.equal(e, s, 'explicit language matches detection')
})

t.test('ts file', async t => {
  const file = resolve(fixturesDir, 'file.ts')
  const a = await highlightFile(file)
  t.matchSnapshot(a, 'async')
  const s = highlightFileSync(file)
  t.matchSnapshot(s, 'sync')
  t.equal(s, a, 'sync matches async')
  const e = highlightFileSync(file, {
    language: 'typescript',
  })
  t.equal(e, s, 'explicit language matches detection')
})

t.test('unknown extensions', t => {
  const dir = t.testdir({
    'no-extension-file': 'hello',
    'no-extension-dot.': 'world',
  })
  const noext = resolve(dir, 'no-extension-file')
  t.rejects(highlightFile(noext))
  t.throws(() => highlightFileSync(noext))
  const dotext = resolve(dir, 'no-extension-dot.')
  t.rejects(highlightFile(dotext))
  t.throws(() => highlightFileSync(dotext))
  t.end()
})

t.test('invalid theme', t => {
  //@ts-expect-error
  t.throws(() => highlight('some code', { theme: 'no theme here' }))
  t.end()
})
