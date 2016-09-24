import parse5 from 'parse5'
import compiler from 'vue-template-compiler'

import { log, warn } from './log.js'

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
 * Only support for es5 modules
 *
 * @param script
 * @param template
 * @returns {string}
 */
function injectTemplate (script, template) {
  // Compile template
  const compiled = compiler.compile(template)
  const moduleFuncs = '\nrender: ' + toFunction(compiled.render) + ',' +
    '\nstaticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + ']'

  // There is no script tag
  if (!script || script.length < 20) {
    return 'export default {' + moduleFuncs + '\n}'
  }

  // Inject in actual script
  const matches = /(export default[^{]*\{)/g.exec(script)
  if (!matches) {
    throw new Error('[rollup-plugin-vue2] could not find place to inject template in script.')
  }
  return script.split(matches[1]).join(matches[1] + moduleFuncs + ',')
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

export default function vueTransform (code, id) {
  // Parse the file into an HTML tree
  const fragment = parse5.parseFragment(code)

  // Walk through the top level nodes and check for their types
  const nodes = {}
  for (let i = fragment.childNodes.length - 1; i >= 0; i--) {
    nodes[fragment.childNodes[i].nodeName] = fragment.childNodes[i]
  }

  // Process script
  var js = nodes.script && parse5.serialize(nodes.script) || 'export default {\n}'

  // Precompile and inject Vue template
  if (nodes.template && nodes.template.content) {
    let template = parse5.serialize(nodes.template.content)
    template = template.replace(/&amp;&amp;/g, '&&')
    js = injectTemplate(js, template)
    if (template.errors) {
      log(id)
      template.errors.forEach(warn)
    }
  }

  // Import css as a module
  // Example: import "./src/App.vue.component.css"
  var css
  if (nodes.style) {
    let lang = checkLang(nodes.style) || 'css'
    js = 'import ' + JSON.stringify(id + '.component.' + lang) + '\n' + js
    css = parse5.serialize(nodes.style)
  }

  return { js, css }
}
