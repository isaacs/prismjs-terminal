// TODO: start stack with [`language-${lang}`]

/**
 * A function that applies styles, typically one of the chalk builder functions
 */
export type StyleFn = (s: string) => string

/**
 * Either one {@link StyleFn} or several
 */
export type Styles = StyleFn | StyleFn[]

/**
 * Theme objects can be either a Map or object where the keys are the selectors
 * and the values are either a styling function or an array of styling
 * functions to be applied in order.
 *
 * The `_` style rule applies to the block as a whole, and is used
 * as the default style. This is where you'd usually port a PrismJS
 * theme's `code[class*="language-"]` css rule.
 *
 * The `lineNumber` style rule will apply to line numbers, if they
 * are used.
 *
 * The semantics are similar to CSS, where a nested property will be
 * applied to nodes within that nesting stack with a higher
 * priority the more tags that match, and later rules taking
 * precedence over earlier ones. It's _not_ a full CSS selector
 * syntax though, so things like `.token.italic.bold` aren't
 * supported. Just individual token class names, possibly nested.
 * Also, chalk is not CSS, and a terminal is not a browser, so
 * there are some differences and limitations of course.
 *
 * Aliases are also not supported, styles have to be applied to the
 * actual parsed class names PrismJS provides.
 */
export type Theme = Record<string, Styles> | Map<string, Styles>

type CompiledRule = [stack: string[], styles: StyleFn[]][]

/**
 * A theme that has been compiled for use in highlighting functions
 * Optimized for faster lookup of tokens, with rules sorted based on
 * priority.
 */
type CompiledTheme = Map<string, CompiledRule>

import chalk from 'chalk'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { parse } from 'path'
import Prism from 'prismjs'
import stringLength from 'string-length'

// primary use is to highlight ts/js programs, call
// loadLanguages() to support others.
import loadLanguages from 'prismjs/components/index.js'
loadLanguages(['tsx', 'typescript', 'javascript', 'jsx'])

const parseSelector = (s: string): string[][] => {
  const parsed: string[][] = []
  const selectors = s.split(',').map(s => s.trim())
  for (const s of selectors) {
    parsed.push(s.split(/\s+/))
  }
  return parsed
}

const arraysEq = (a: string[], b: string[]) =>
  a.length === b.length && !a.some((aa, i) => aa !== b[i])

const stackMatch = (
  // the stack defined in the rule
  ruleStack: string[],
  // the actual stack
  stack: string[]
) => {
  if (!ruleStack.length) return true
  let j = 0
  for (const t of ruleStack) {
    if (t === stack[j]) {
      j++
      if (j === ruleStack.length) return true
    }
  }
  return false
}

const filterRule = (stack: string[], rule: CompiledRule): CompiledRule =>
  rule.filter(([ruleStack]) => stackMatch(ruleStack, stack))

// return style functions sorted in *ascending* order of priority
const getStyles = (stack: string[], rule: CompiledRule): StyleFn[] => {
  const f = filterRule(stack, rule)
    .sort(([a], [b]) => a.length - b.length)
    .map(([_, r]) => r)
  return f.reduce((s: StyleFn[], r: StyleFn[]) => {
    s.push(...r)
    return s
  }, [])
}

const applyStyles = (
  content: string,
  tag: string,
  stack: string[],
  t: CompiledTheme
) => {
  const rule = t.get(tag)
  if (!rule) return content
  const styles = getStyles(stack, rule)
  for (let i = styles.length - 1; i > -1; i--) {
    content = styles[i](content)
  }
  return content
}

type Tokens = string | Prism.Token | (string | Prism.Token)[]

/**
 * Options for the highlighting functions
 */
export interface PrismJSTerminalOpts {
  /**
   * The theme to use. Either a {@link Theme} object, or a
   * string identifying one of the built-in themes.
   *
   * @default 'moria'
   */
  theme?: keyof typeof themes | Theme

  /**
   * The language of the supplied code to highlight. Defaults to `tsx` if no
   * filename is provided, or else tries to infer the language from the
   * filename. You must have previously called `loadLanguages([...])` from
   * `PrismJS` in order to highlight a given language, if you want something
   * that is not automatically included when `tsx` and `typescript` are
   * included.
   *
   * @default 'tsx'
   */
  language?: string

  /**
   * The minimum width to make the block on the screen.
   *
   * @default 0
   */
  minWidth?: number

  /**
   * The maximum width to make the block on the screen.
   *
   * @default `process.stdout.columns` or `80`.
   */
  maxWidth?: number

  /**
   * How many spaces to horizontally pad the code block.
   *
   * @default 1
   */
  padding?: number

  /**
   * Whether or not to prepend a line number to each line.
   *
   * @default false
   */
  lineNumbers?: boolean
}

const trimTrailingCR = (c: string) =>
  c.endsWith('\n') ? c.substring(0, c.length - 1) : c

const blockStyle = (
  code: string,
  c: CompiledTheme,
  {
    minWidth = 0,
    maxWidth = process.stdout.columns || 80,
    padding = 1,
    lineNumbers = false,
  }: PrismJSTerminalOpts
): string => {
  const lines = trimTrailingCR(code).split('\n')
  const lens: number[] = []
  let max = minWidth
  const npad = lineNumbers ? String(lines.length).length : 0
  const tpad = npad + padding * 2
  for (const l of lines) {
    const len = stringLength(l)
    lens.push(len)
    if (len < maxWidth - tpad && len > max) max = len
  }
  for (let i = 0; i < lens.length; i++) {
    const len = lens[i]
    const pad = max - len + padding
    const r = pad > 0 ? ' '.repeat(pad) : ''
    const l =
      ' '.repeat(padding) +
      (lineNumbers
        ? applyStyles(
            String(i + 1).padStart(npad) + ' ',
            'lineNumber',
            [],
            c
          )
        : '')
    lines[i] = l + lines[i] + r
  }
  code = lines.join('\n') + '\n'
  return applyStyles(code, '_', [], c)
}

/**
 * Highlight the string of code provided, returning the string of highlighted
 * code.
 */
export const highlight = (
  code: string,
  {
    language = 'tsx',
    theme = 'moria',
    minWidth,
    maxWidth,
    padding,
    lineNumbers,
  }: PrismJSTerminalOpts = {}
): string => {
  const t = typeof theme === 'string' ? themes[theme] : theme
  if (!t) {
    throw new Error('invalid theme: ' + theme)
  }
  const c = compileTheme(t)
  return blockStyle(
    stringify(Prism.tokenize(code, Prism.languages[language]), c),
    c,
    { minWidth, maxWidth, padding, lineNumbers }
  )
}

const detectLanguage = (filename: string): string => {
  const { ext } = parse(filename)
  switch (ext) {
    case '.ts':
    case '.mts':
    case '.cts':
      return 'typescript'
    case '.js':
    case '.cjs':
    case '.mjs':
      return 'javascript'
    case '.htm':
      return 'html'
    case '':
    case '.':
      throw new Error('could not detect language for file: ' + filename)
    default:
      // cross our fingers, I guess
      return ext.substring(1)
  }
}

/**
 * Read the filename provided, and highlight its code. If a language is not
 * provided in the opts, it will attempt to infer from the filename.
 */
export const highlightFile = async (
  filename: string,
  opts: PrismJSTerminalOpts = {}
): Promise<string> => {
  if (!opts.language) opts.language = detectLanguage(filename)
  return highlight(await readFile(filename, 'utf8'), opts)
}

/**
 * Read the filename provided, and highlight its code. If a language is not
 * provided in the opts, it will attempt to infer from the filename.
 *
 * Synchronous {@link highlightFile}
 */
export const highlightFileSync = (
  filename: string,
  opts: PrismJSTerminalOpts = {}
): string => {
  if (!opts.language) opts.language = detectLanguage(filename)
  return highlight(readFileSync(filename, 'utf8'), opts)
}

const stringify = (
  tok: Tokens,
  theme: CompiledTheme,
  stack: string[] = []
): string => {
  if (typeof tok === 'string') return tok
  if (Array.isArray(tok)) {
    return tok.map(t => stringify(t, theme, stack)).join('')
  } else {
    return applyStyles(
      stringify(tok.content, theme, [...stack, tok.type]),
      tok.type,
      stack,
      theme
    )
  }
}

const compiledThemes = new Map<Theme, CompiledTheme>()
const compileTheme = (t: Theme): CompiledTheme => {
  const pre = compiledThemes.get(t)
  if (pre) return pre
  if (!(t instanceof Map)) {
    const c = compileTheme(new Map(Object.entries(t)))
    compiledThemes.set(t, c)
    return c
  }
  const c: CompiledTheme = new Map()
  for (const [s, tr] of t.entries()) {
    const selectors = parseSelector(s)
    for (const sel of selectors) {
      // sel is a stack, so `x y z` becomes `['x', 'y', 'z']`
      // add the stack with the rule to the last item,
      // so we add [['x', 'y'], tr] to 'z'
      const last = sel[sel.length - 1]
      sel.pop()
      const cr = c.get(last) || []
      let pushed = false
      for (const [stack, rules] of cr) {
        if (arraysEq(sel, stack)) {
          rules.push(...(Array.isArray(tr) ? tr : [tr]))
          pushed = true
          break
        }
      }
      if (!pushed) cr.push([sel, Array.isArray(tr) ? tr : [tr]])
      if (!c.has(last)) c.set(last, cr)
    }
  }

  const def = c.get('_')
  if (!def) c.set('_', [[[], [chalk.reset]]])

  compiledThemes.set(t, c)
  return c
}

import * as themes from './themes/index.js'
export { themes }
