import buble from 'rollup-plugin-buble'

const pack = require('./package.json')
const YEAR = new Date().getFullYear()

export default {
  entry: 'src/index.js',
  dest: 'dist/rollup-plugin-vue2.common.js',
  plugins: [
    buble()
  ],
  banner   () {
    return `/*!
 * ${pack.name} v${pack.version}
 * (c) ${YEAR} ${pack.author}
 * Release under the ${pack.license} License.
 */`
  },

  // Cleaner console
  onwarn (msg) {
    if (msg && msg.startsWith('Treating')) {
      return
    }
  }
}
