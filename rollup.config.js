import buble from 'rollup-plugin-buble'

const pack = require('./package.json')
const YEAR = new Date().getFullYear()

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/rollup-plugin-vue2.common.js',
      format: 'cjs'
    },
    {
      file: 'dist/rollup-plugin-vue2.es.js',
      format: 'esm'
    }
  ],
  plugins: [buble()],
  banner () {
    return `/*!
 * ${pack.name} v${pack.version}
 * (c) ${YEAR} ${pack.author}
 * Release under the ${pack.license} License.
 */`
  },

  // Cleaner console
  onwarn (warning) {
    warning = (warning && warning.message) || warning || ''
    if (warning.startsWith('Treating')) {

    }
  }
}
