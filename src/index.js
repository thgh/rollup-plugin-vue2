import { createFilter } from 'rollup-pluginutils'
import vueTransform from './vueTransform'

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
    transform (source, id) {
      if (!filter(id) || !id.endsWith('.vue')) {
        return
      }

      const { js, css } = vueTransform(source, id)

      // Map of every stylesheet
      styles[id] = css

      // Replace "with(this){" with something that works in strict mode
      // https://github.com/vuejs/vue-template-es2015-compiler/blob/master/index.js
      return js.replace(/with\(this\)/g, 'if(window.__VUE_WITH__)')
    },
    transformBundle (code) {
      return code
        .replace(/process\.env\.VUE_ENV/g, JSON.stringify(process.env.VUE_ENV || ''))
        .replace(/process\.env\.NODE_ENV/g, JSON.stringify(process.env.NODE_ENV || ''))
    },
    ongenerate (opts, rendered) {
      // Revert "with(this){"
      rendered.code = rendered.code.replace(/if\s*\(window.__VUE_WITH__\)/g, 'with(this)')
    }
  }
}
