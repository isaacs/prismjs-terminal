import chalk from 'chalk'
import { Theme } from '../index.js'

/**
 * Inspired by vim Moria theme
 * https://github.com/vim-scripts/moria
 *
 * It's not *quite* as faithful as I'd like (and I *would* like, since it's the
 * color scheme I personally use in Vim, and so most natural for me), because
 * Vim and PrismJS make slightly different choices about how they label program
 * tokens.
 */
export const theme: Theme = {
  _: chalk.ansi256(252).bgAnsi256(234),
  lineNumber: chalk.hex('#8fa5d1'),
  punctuation: chalk.hex('#93CDFF'),
  'prolog, doctype, cdata': chalk.dim.bold,
  'interpolation rest': chalk.ansi256(252).bgAnsi256(234),
  'entity, url, symbol, boolean, number, regex, string, attr-name, template-string':
    chalk.ansi256(113).bgAnsi256(234),
  'template-string interpolation': chalk.ansi256(252).bgAnsi256(234),
  'template-string interpolation-punctuation': chalk.hex('#d7af87'),
  'builtin, variable': chalk.hex('#F67C4F'),
  comment: chalk.hex('#d75fff').bgAnsi256(234).italic,
  'keyword, string-property': chalk.hex('#79c0ff'),
}
