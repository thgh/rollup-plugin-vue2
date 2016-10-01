import { createFilter } from 'rollup-pluginutils'
import vueTransform from './vueTransform'
import MagicString from 'magic-string'

export default function vue2 (options = {}) {
  const filter = createFilter(options.include, options.exclude)
  const styles = {}

  return {
    name: 'vue2',
    options (options) {
      options.useStrict = false
      return options
    },
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
      if (!filter(id) || !id.endsWith('.vue')) {
        return
      }

      code = vueTransform(code, id)

      // Map of every stylesheet
      styles[id] = code.css

      return code
    },
    transformBundle (code) {
      const s = new MagicString(code)
      magicReplace(s, /process\.env\.VUE_ENV/g, 19, JSON.stringify(process.env.VUE_ENV || ''))
      magicReplace(s, /process\.env\.NODE_ENV/g, 20, JSON.stringify(process.env.NODE_ENV || ''))
      return {
        code: s.toString(),
        map: s.generateMap({ hires: true })
      }
    },
    ongenerate (opts, rendered) {
      // Revert "with(this){"
      rendered.code = rendered.code.replace(/if\s*\(window.__VUE_WITH__\)/g, 'with(this)')
    }
  }
}

function magicReplace (s, needle, needlen, replacement) {
  var match
  /* eslint-disable */
  while (match = needle.exec(s.original)) {
    s.overwrite(match.index, match.index + needlen, replacement)
  }
}
