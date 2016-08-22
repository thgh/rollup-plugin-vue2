import { createFilter } from 'rollup-pluginutils'
import { writeFile } from 'fs'

import vueTransform from './vueTransform'
import { emitted } from './log.js'

export default function vue2 (options = {}) {
  const filter = createFilter(options.include, options.exclude)
  const styles = {}
  let dest = options.css

  return {
    name: 'vue2',
    transform (source, id) {
      if (!filter(id) || !id.endsWith('.vue')) {
        if (id.endsWith('vue.common.js')) {
          return source.replace(/process\.env\.VUE_ENV/g, process.env.VUE_ENV || '')
            .replace(/process\.env\.NODE_ENV/g, process.env.NODE_ENV || '')
        }
        return null
      }

      const { js, css } = vueTransform(source, id)

      // Map of every stylesheet
      styles[id] = css || {}

      // Replace "with(this){" with something that works in strict mode
      // https://github.com/vuejs/vue-template-es2015-compiler/blob/master/index.js
      return js.replace(/with\(this\)/g, 'if("__VUE_WITH__")')
    },
    ongenerate (opts, rendered) {
      // Revert "with(this){"
      rendered.code = rendered.code.replace(/if\s*\("__VUE_WITH__"\)/g, 'with(this)')

      // No stylesheet needed
      if (options.css === false) {
        return
      }

      // Combine all stylesheets
      let css = ''
      Object.keys(styles).forEach((key) => {
        css += styles[key].content || ''
      })

      // Emit styles through callback
      if (typeof options.css === 'function') {
        options.css(css, styles)
        return
      }

      if (typeof dest !== 'string') {
        // Don't create unwanted empty stylesheets
        if (!css.length) {
          return
        }

        // Guess destination filename
        dest = opts.dest || 'bundle.js'
        if (dest.endsWith('.js')) {
          dest = dest.slice(0, -3)
        }
        dest = dest + '.css'
      }

      // Emit styles to file
      writeFile(dest, css, (err) => {
        if (err) {
          throw err
        }
        emitted(dest, css.length)
      })
    }
  }
}
