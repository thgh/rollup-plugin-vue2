import compiler from 'vue-template-compiler'
import MagicString from 'magic-string'

export default function vueTransform (code, id) {
  const nodes = compiler.parseComponent(code)
  const s = new MagicString(code)
  let exportOffset
  if (nodes.script) {
    s.remove(nodes.script.end, s.original.length)
    s.remove(0, nodes.script.start)
    exportOffset = s.toString().search(/export default[^{]*\{/g)
    if (exportOffset >= 0) {
      exportOffset += nodes.script.start + 16
    }
  }
  if (!(exportOffset > 16)) {
    exportOffset = 16
    s.overwrite(0, 16, 'export default {')
    s.overwrite(16, code.length, '\nstub: 1\n}')
  }
  // Precompile and inject Vue template
  if (nodes.template && nodes.template.content) {
    injectTemplate(s, nodes.template.content, exportOffset)
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

/**
 * Only support for es5 modules
 *
 * @param script
 * @param template
 * @returns {string}
 */
function injectTemplate (s, template, offset) {
  // Compile template
  const compiled = compiler.compile(template)

  const renderFuncs = '\nrender: ' + toFunction(compiled.render) + ',' +
    '\nstaticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + '],'

  // Inject render function
  // Replace "with(this){" with something that works in strict mode
  // https://github.com/vuejs/vue-template-es2015-compiler/blob/master/index.js
  s.insertLeft(offset, renderFuncs.replace(/with\(this\)/g, 'if(window.__VUE_WITH__)'))
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
