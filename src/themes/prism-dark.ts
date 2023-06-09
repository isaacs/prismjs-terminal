import chalk from 'chalk'
import type { Theme } from '../index.js'

/**
 * Port of the `prism-dark` PrismJS theme.
 * <https://github.com/PrismJS/prism/blob/867804573562ef0ac5acf470420b97e43488ccde/themes/prism-dark.css>
 *
 * Slightly tweaked a few colors so that they are a bit more readable on a
 * terminal, some terminals have rendering issues when contrast is too low.
 */
export const theme: Theme = {
  _: chalk.white.bgHex('#231E19'),
  lineNumber: chalk.dim,
  'comment, prolog, doctype, cdata': chalk.hex('#997F66'),
  'punctuation, namespace': chalk.dim,
  'property,tag,boolean,number,constant,symbol': chalk.hex('#9E93D1'),
  'selector,attr-name,string,char,builtin,inserted': chalk.hex('#BCE051'),
  'operator,entity,url,language-css string,style string,variable':
    chalk.hex('#F4B73D'),
  'atrule,attr-value,keyword': chalk.hex('#D1939E'),
  'regex,important': chalk.hex('#e90'),
  'important,bold': chalk.bold,
  italic: chalk.italic,
  deleted: chalk.red,
}
