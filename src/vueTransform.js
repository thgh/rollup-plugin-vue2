import compiler from 'vue-template-compiler'
import transpile from 'vue-template-es2015-compiler'
import MagicString from 'magic-string'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default function vueTransform (code, id, scripts) {
  const nodes = compiler.parseComponent(code)
  const s = new MagicString(code)
  let exportOffset = 0
  if (nodes.script) {
    if (nodes.script.src) {
      let script = readSrc(id, nodes.script.src)
      exportOffset = indexOfExport(script, 0)
      if (exportOffset) {
        s.overwrite(0, exportOffset, script.slice(0, exportOffset))
        s.overwrite(exportOffset, code.length, script.slice(exportOffset))
      }
    } else {
      s.remove(nodes.script.end, s.original.length)
      s.remove(0, nodes.script.start)
      exportOffset = indexOfExport(s.toString(), nodes.script.start)
    }
  }

  // The script cannot be valid so let's overwrite it
  if (exportOffset < 15) {
    exportOffset = 16
    s.overwrite(0, 16, 'export default {')
    s.overwrite(16, code.length, '\nstub: 1\n}')
  }

  // Precompile and inject Vue template

  if (nodes.template) {
    scripts[id] = injectTemplate(s, nodes.template, exportOffset, id)
  }

  // Import css as a module
  // Example: import "./src/App.vue.component.css"
  let css
  if (nodes.styles) {
    if (nodes.styles.src) {
      s.prepend('import ' + JSON.stringify(nodes.styles.src) + '\n')
    } else {
      let lang = checkLang(nodes.styles) || 'css'
      s.prepend('import ' + JSON.stringify(id + '.component.' + lang) + '\n')
      css = nodes.styles.map((it) => {
        return it.content
      }).join('\n')
    }
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
    css
  }
}

function readSrc (id, src) {
  if (src.startsWith('./') || src.startsWith('/') || src.startsWith('../')) {
    src = resolve(id, '..', src)
  } else {
    src = require.resolve(src)
  }
  return readFileSync(src, 'utf8')
}

function indexOfExport (code, start) {
  var match = /export\s+default\s+\{/.exec(code)
  if (match && match[0]) {
    return match.index + match[0].length + start
  }
  return 0
}

/**
 * Only support for es5 modules
 *
 * @param script
 * @param template
 * @returns {string}
 */
function injectTemplate (s, node, offset, id) {
  const t = node.src ? readSrc(id, node.src) : node.content

  // Compile template
  const compiled = compiler.compile(t)
  const renderFuncs = '\nrender: ' + transpile(`function render(){${compiled.render}}`) + ',' +
    '\nstaticRenderFns: ' + transpile(`[${compiled.staticRenderFns.map(toFunction).join(',')}]`) + ','
  // Inject render function
  // Replace "with(this){" with something that works in strict mode
  // https://github.com/vuejs/vue-template-es2015-compiler/blob/master/index.js
  // s.insertLeft(offset, '__VUE_ID__:' + JSON.stringify(id) + ',')
  // s.insertLeft(offset, renderFuncs.replace(/with\(this\)/g, 'if(window.__VUE_WITH__)'))
  s.insertLeft(offset, renderFuncs)
  return renderFuncs
}

/**
 * Wrap a piece of code in a function
 *
 * @param {String} code
 * @return {String}
 */
function toFunction (code) {
  return 'function(){' + code + '}'
}

/**
 * Check the lang attribute node.
 *
 * @param {Node} node
 * @return {String|undefined}
 */
function checkLang (nodes) {
  let lang
  nodes.map((it) => {
    if (it.lang !== 'css') {
      lang = it.lang
    }
  })
  return lang
}
