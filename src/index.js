import { createFilter } from 'rollup-pluginutils'
import vueTransform from './vueTransform'

export default function vue2 (options = {}) {
  const filter = createFilter(options.include || '**/*.vue', options.exclude)
  const styles = {}

  return {
    name: 'vue2',
    options (options) {
      options.useStrict = false
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
      if (id.endsWith('vue.common.js')) {
        return vueCommon(code)
      }
      if (!filter(id)) {
        return
      }

      code = vueTransform(code, id)

      // Map of every stylesheet
      styles[id] = code.css

      return code
    },
    ongenerate (opts, rendered) {
      // Revert "with(this){"
      rendered.code = rendered.code.replace(/if\s*\(window.__VUE_WITH__\)/g, 'with(this)')
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
