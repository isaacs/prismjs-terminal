/**
 * Port of the `xonokai` PrismJS theme.
 */
export { theme as xonokai } from './xonokai.js'

/**
 * This theme just shows which token names are in use The list of tokens is
 * everything defined in the tsx PrismJS language grammar, since that is a
 * superset of JavaScript, TS, JSX, and HTML.
 */
export { theme as debug } from './debug.js'

/**
 * Inspired by vim Moria theme
 * https://github.com/vim-scripts/moria
 *
 * It's not *quite* as faithful as I'd like (and I *would* like, since it's the
 * color scheme I personally use in Vim, and so most natural for me), because
 * Vim and PrismJS make slightly different choices about how they label program
 * tokens.
 */
export { theme as moria } from './moria.js'

/**
 * Port of GHColors prismjs theme.
 * <https://github.com/PrismJS/prism-themes/blob/057c2a4430d78268528e65ba92860703c9cb56d8/themes/prism-ghcolors.css>
 */
export { theme as github } from './github.js'

/**
 * Port of the `prism-dark` PrismJS theme.
 * <https://github.com/PrismJS/prism/blob/867804573562ef0ac5acf470420b97e43488ccde/themes/prism-dark.css>
 *
 * Slightly tweaked a few colors so that they are a bit more readable on a
 * terminal, some terminals have rendering issues when contrast is too low.
 */
export { theme as prismDark } from './prism-dark.js'

/**
 * No styling, just the code as plain text.
 * Will add line numbers and padding if requested, of course.
 */
export { theme as plain } from './plain.js'
