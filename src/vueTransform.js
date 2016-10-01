import parse5 from 'parse5'
import compiler from 'vue-template-compiler'
import MagicString from 'magic-string'

import { warn } from './log.js'

export default function vueTransform (code, id) {
  const nodes = toNodes(code)
  const s = new MagicString(code)

  // Process script
  var scriptOffset
  var exportOffset
  if (nodes.script) {
    var js = parse5.serialize(nodes.script)
    js = code.indexOf('\r') !== -1 ? js.replace(/\n/g, '\r\n') : js
    scriptOffset = s.toString().indexOf(js)
    exportOffset = getExportOffset(s, scriptOffset)

    if (scriptOffset >= exportOffset) {
      warn(id)
      throw new Error('[rollup-plugin-vue2] could not find place to inject template in script.')
    }

    s.remove(0, scriptOffset)
    s.remove(scriptOffset + js.length, s.original.length)
  } else {
    scriptOffset = 0
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
  var css
  if (nodes.style) {
    let lang = checkLang(nodes.style) || 'css'
    s.prepend('import ' + JSON.stringify(id + '.component.' + lang) + '\n')
    css = parse5.serialize(nodes.style)
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
    css
  }
}

function toNodes (code) {
  // Parse the file into an HTML tree
  const fragment = parse5.parseFragment(code)

  // Walk through the top level nodes and check for their types
  const nodes = {}
  for (let i = fragment.childNodes.length - 1; i >= 0; i--) {
    nodes[fragment.childNodes[i].nodeName] = fragment.childNodes[i]
  }

  return nodes
}

function getExportOffset (s, scriptOffset) {
  const script = scriptOffset > 0 ? s.original.substr(scriptOffset) : s.original
  return scriptOffset + script.indexOf('{', script.search(/export default[^{]*\{/g)) + 1
}

/**
 * Only support for es5 modules
 *
 * @param script
 * @param template
 * @returns {string}
 */
function injectTemplate (s, template, offset) {
  const script = s.toString()

  // There is no script tag
  if (!script || script.length < 17) {
    warn(script)
    throw new Error('[rollup-plugin-vue2] could not find place to inject template in script.')
  }

  // Compile template
  template = parse5.serialize(template).replace(/&amp;&amp;/g, '&&')
  const compiled = compiler.compile(template)

  // Show template compiler errors
  if (template.errors) {
    template.errors.forEach(warn)
  }

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
 * Check the lang attribute of a parse5 node.
 *
 * @param {Node} node
 * @return {String|undefined}
 */
function checkLang (node) {
  if (node.attrs) {
    let i = node.attrs.length
    while (i--) {
      const attr = node.attrs[i]
      if (attr.name === 'lang') {
        return attr.value
      }
    }
  }
  return undefined
}
