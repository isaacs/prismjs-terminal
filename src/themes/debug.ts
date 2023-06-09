import { Theme } from '../index.js'

/**
 * This theme just shows which token names are in use The list of tokens is
 * everything defined in the tsx PrismJS language grammar, since that is a
 * superset of JavaScript, TS, JSX, and HTML.
 */
export const theme: Theme = new Map(
  `
boolean
builtin
cdata
class-name
class-name boolean
class-name builtin
class-name comment
class-name constant
class-name function
class-name function-variable
class-name hashbang
class-name keyword
class-name number
class-name operator
class-name punctuation
class-name regex
class-name regex regex-delimiter
class-name regex regex-flags
class-name regex regex-source
class-name string
class-name string-property
class-name template-string
class-name template-string interpolation
class-name template-string interpolation interpolation-punctuation
class-name template-string interpolation rest
class-name template-string template-punctuation
comment
constant
decorator
decorator at
decorator function
doctype
doctype doctype-tag
doctype internal-subset
doctype name
doctype punctuation
doctype string
entity
function
function-variable
generic-function
generic-function function
generic-function generic
hashbang
keyword
number
operator
prolog
punctuation
regex
regex regex-delimiter
regex regex-flags
regex regex-source
script
script included-cdata
script included-cdata cdata
script included-cdata language-javascript
script included-cdata language-javascript class-name
script included-cdata language-javascript comment
script included-cdata language-javascript function-variable
script included-cdata language-javascript hashbang
script included-cdata language-javascript keyword
script included-cdata language-javascript literal-property
script included-cdata language-javascript number
script included-cdata language-javascript parameter
script included-cdata language-javascript regex
script included-cdata language-javascript string
script included-cdata language-javascript string-property
script included-cdata language-javascript template-string
script language-javascript
script language-javascript class-name
script language-javascript comment
script language-javascript function-variable
script language-javascript hashbang
script language-javascript keyword
script language-javascript literal-property
script language-javascript number
script language-javascript parameter
script language-javascript regex
script language-javascript regex regex-source
script language-javascript string
script language-javascript string-property
script language-javascript template-string
script language-javascript template-string interpolation
script language-javascript template-string interpolation interpolation-punctuation
script language-javascript template-string interpolation rest
script language-javascript template-string template-punctuation
string
string-property
style
style included-cdata
style included-cdata cdata
style included-cdata language-css
style included-cdata language-css atrule
style included-cdata language-css comment
style included-cdata language-css function
style included-cdata language-css important
style included-cdata language-css property
style included-cdata language-css punctuation
style included-cdata language-css selector
style included-cdata language-css string
style included-cdata language-css url
style language-css
style language-css atrule
style language-css atrule keyword
style language-css atrule rest
style language-css atrule rule
style language-css atrule selector-function-argument
style language-css comment
style language-css function
style language-css important
style language-css property
style language-css punctuation
style language-css selector
style language-css string
style language-css url
style language-css url function
style language-css url punctuation
style language-css url string
tag
tag attr-name
tag attr-name namespace
tag attr-value
tag attr-value punctuation
tag comment
tag punctuation
tag script
tag script rest
tag script script-punctuation
tag special-attr
tag spread
tag tag
tag tag class-name
tag tag namespace
tag tag punctuation
template-string
template-string interpolation
template-string interpolation interpolation-punctuation
template-string string
template-string template-punctuation
`
    .trim()
    .split('\n')
    .map(name => [name, (s: string) => `<${name}>${s}</${name}>`])
)

// add another match just to have a dupe rule that becomes an array
theme.set('a c d e f, f', [s => s])
theme.set('a b c d e, a c d e f, f', [s => s])
theme.set('a b c d e, a c d e f, f, g', [s => s])
theme.set('a b c d e, a c d e f, f, g, h', s => s)
