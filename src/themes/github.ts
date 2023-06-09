import chalk from 'chalk'
import type { Theme } from '../index.js'

/**
 * Port of GHColors prismjs theme.
 * <https://github.com/PrismJS/prism-themes/blob/057c2a4430d78268528e65ba92860703c9cb56d8/themes/prism-ghcolors.css>
 */
export const theme: Theme = {
  _: chalk.hex('#393A34').bgHex('#fff'),
  lineNumber: chalk.dim,
  'comment, prolog, doctype, cdata': chalk.hex('#999988').italic,
  namespace: chalk.dim,
  'string, attr-value': chalk.hex('#e3116c'),
  'punctuation, operator': chalk.hex('#393A34'),
  'entity, url, symbol, number, boolean, variable, constant, property, regex, inserted':
    chalk.hex('#36acaa'),
  'atrule, keyword, attr-name, language-autohotkey selector':
    chalk.hex('#00a4db'),
  'function,deleted,language-autohotkey tag': chalk.hex('#9a050f'),
  'tag, selector,language-autohotkey keyword': chalk.hex('#00009f'),
  'important, function, bold': chalk.bold,
  italic: chalk.italic,
}
