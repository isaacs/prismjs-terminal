import chalk from 'chalk'
import type { Theme } from '../index.js'

/**
 * Port of xonokai PrismJS theme
 * <https://github.com/PrismJS/prism-themes/blob/fe8d8fd7b80fb7d6bc0ed1a7b53009e5632701d7/themes/prism-xonokai.css>
 */
export const theme: Theme = {
  // default style
  _: chalk.hex('#76d9e6').bgHex('#2a2a2a'),
  'namespace, lineNumber': chalk.dim,
  'comment, prolog, doctype, cdata': chalk.hex('#6f705e'),
  'operator, boolean, number': chalk.hex('#a77afe'),
  'attr-name, string, entity, url, language-css string, style string, tag attr-value':
    chalk.hex('#e6d06c'),
  'selector, inserted, tag attr-name': chalk.hex('#a6e22d'),
  'atrule, attr-value, keyword, important, deleted, tag':
    chalk.hex('#ef3b7d'),
  'regex, statement, style, script, script keyword': chalk.hex('#76d9e6'),
  'placeholder, variable': chalk.hex('#fff'),
  'important, statement, bold': chalk.bold,
  punctuation: chalk.hex('#bebec5'),
  italic: chalk.italic,
}
