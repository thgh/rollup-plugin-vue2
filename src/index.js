import { createFilter } from 'rollup-pluginutils'
import compiler from 'vue-template-compiler'
import transpile from 'vue-template-es2015-compiler'
import MagicString from 'magic-string'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default function vue2 (options = {}) {
  const filter = createFilter(options.include || '**/*.vue', options.exclude)
  const styles = {}

  return {
    name: 'vue2',
    resolveId (id) {
      if (id.indexOf('.vue.component.') !== -1) {
        return id
      }
    },
    load (id) {
      if (id.indexOf('.vue.component.') !== -1) {
        id = id.slice(0, id.lastIndexOf('.vue.component.') + 4)
        return styles[id] || ''
      }
    },
    transform (code, id) {
      if (id.endsWith('vue.common.js') || id.endsWith('vue.runtime.common.js')) {
        return vueCommon(code)
      }
      if (!filter(id)) {
        return
      }

      code = vueTransform(code, id)

      // Map of every stylesheet
      styles[id] = code.css

      return code
    }
  }
}

function vueCommon (code) {
  code = code
    .replace(/process\.env\.VUE_ENV/g, JSON.stringify(process.env.VUE_ENV || ''))
    .replace(/process\.env\.NODE_ENV/g, JSON.stringify(process.env.NODE_ENV || ''))

  return {
    code: code,
    map: { mappings: '' }
  }
}

function vueTransform (code, id) {
  const nodes = compiler.parseComponent(code)
  const s = new MagicString(code)
  let exportOffset = 0
  if (nodes.script) {
    if (nodes.script.src) {
      const script = readSrc(id, nodes.script.src)
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
    let componentMixins = []
    if (nodes.customBlocks) {
      nodes.customBlocks.forEach((block) => {
        if (block.type === 'component' && block.attrs.name) {
          let render = compileToFunctions(block.content)
          let exportGlobal = !!('export' in block.attrs)
          if (exportGlobal) {
            exportGlobal = `
  export: true,`
          } else {
            exportGlobal = ''
          }
          let mixinText = `{
  name: '${block.attrs.name}',${exportGlobal}
  render: ${render.render},
  staticRenderFns: ${render.staticRenderFns},
}`
          componentMixins.push(mixinText)
        }
      })
    }
    if (componentMixins.length) {
      componentMixins = '[' + componentMixins.join(',') + ']'
    }
    injectTemplate(s, nodes.template, exportOffset, id, componentMixins)
  }

  // Import css as a module
  // Example: import "./src/App.vue.component.css"
  let css
  if (nodes.styles) {
    nodes.styles.forEach(style => {
      if (style.src) {
        s.prepend('import ' + JSON.stringify(style.src) + '\n')
      } else {
        const lang = style.lang || 'css'
        s.prepend('import ' + JSON.stringify(id + '.component.' + lang) + '\n')
        css = (css || '') + style.content
      }
    })
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
function injectTemplate (s, node, offset, id, componentMixins) {
  const t = node.src ? readSrc(id, node.src) : node.content

  // Compile template
  const compiled = compileToFunctions(t)
  let renderFuncs = '\nrender: ' + compiled.render + ',' +
    '\nstaticRenderFns: ' + compiled.staticRenderFns + ','
  if (componentMixins.length) {
    renderFuncs += '\ncomponentMixins: ' + componentMixins + ','
  }
  s.appendLeft(offset, renderFuncs)
  return renderFuncs
}

function compileToFunctions (template) {
  let compiled = compiler.compile(template)
  return {
    render: toFunction(compiled.render),
    staticRenderFns: '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'
  }
}

/**
 * Wrap a piece of code in a function
 *
 * @param {String} code
 * @return {String}
 */
function toFunction (code) {
  return transpile('(function(){' + code + '})').slice(1, -1)
}
