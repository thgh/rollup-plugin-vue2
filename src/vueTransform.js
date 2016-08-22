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
  const matches = /(export default[^{]*\{)/g.exec(script)
  if (!matches) {
    throw new Error('[rollup-plugin-vue] could not find place to inject template in script.')
  }
  const compiled = compiler.compile(template)
  return script.split(matches[1])
    .join(matches[1] +
      '\nrender: ' + toFunction(compiled.render) + ',' +
      '\nstaticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + '],')
}

/**
 * @param {Node} node
 * @param {string} filePath
 * @param {string} content
 * @param {string} template
 */
function processScript (script, filePath, content, template) {
  script = parse5.serialize(script)

  // Precompile vue template
  if (template && template.content) {
    template = parse5.serialize(template.content)
    template = template.replace(/&amp;&amp;/g, '&&')
    script = injectTemplate(script, template)
    if (template.errors) {
      log(filePath)
      template.errors.forEach(warn)
    }
  }
  return script
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

export default function vueTransform (code, filePath) {
  // 1. Parse the file into an HTML tree
  const fragment = parse5.parseFragment(code, { locationInfo: true })

  // 2. Walk through the top level nodes and check for their types
  const nodes = {}
  for (let i = fragment.childNodes.length - 1; i >= 0; i--) {
    nodes[fragment.childNodes[i].nodeName] = fragment.childNodes[i]
  }

  // 3. Don't touch files that don't look like Vue components
  if (!nodes.template && !nodes.script) {
    throw new Error('There must be at least one script tag or one template tag per *.vue file.')
  }

  return {
    // 4. Process script & template
    js: processScript(nodes.script, filePath, code, nodes.template),

    // 5. Process styles
    css: nodes.style && {
      content: parse5.serialize(nodes.style),
      lang: checkLang(nodes.style)
    }
  }
}
