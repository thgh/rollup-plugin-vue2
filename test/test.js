/* global describe, it */
const vue = require('../')
const css = require('rollup-plugin-css-only')
const assert = require('assert')
const fs = require('fs')
const rollup = require('rollup')
const path = require('path')

process.chdir(__dirname)

describe('rollup-plugin-vue2', function () {
  it('should rollup entry.js', function () {
    let actualCss = ''
    return rollup.rollup({
      input: './fixtures/entry.js',
      plugins: [
        vue(),
        css({
          output (out) {
            actualCss = out
          }
        })
      ]
    }).then(async (bundle) => {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      // Script and template
      const expected = read('expects/bundle.js')
      assertEqualFile(result.code, expected, 'should output script')

      // Styles
      const expectedCss = read('expects/bundle.css')
      assertEqualFile(expectedCss, actualCss, 'should output style')
    })
  })

  it('should handle components with only template', function () {
    return simpleRollup('OnlyTemplate.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/OnlyTemplate.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with only script', function () {
    return simpleRollup('OnlyScript.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/OnlyScript.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with only style', function () {
    return simpleRollup('OnlyStyle.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/OnlyStyle.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without style', function () {
    return simpleRollup('WithoutStyle.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/WithoutStyle.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without template', function () {
    return simpleRollup('WithoutTemplate.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/WithoutTemplate.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without script', function () {
    return simpleRollup('WithoutScript.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/WithoutScript.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with src imports', function () {
    return simpleRollup('SrcImport.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/SrcImport.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should not rollup render methods', function () {
    return simpleRollup('WithoutRollupRender.vue').then(async function (bundle) {
      const { output: [result] } = await bundle.generate({ format: 'es' })
      const expected = read('expects/WithoutRollupRender.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should rollup component templates', function () {
    return simpleRollup('ComponentRender.vue').then(function (bundle) {
      var result = bundle.generate({ format: 'es' })
      // fs.writeFileSync(path.resolve(__dirname, 'expects/ComponentRender.js'), result.code, 'utf-8')
      var expected = read('expects/ComponentRender.js')
      assertEqualFile(result.code, expected)
    })
  })

  // it('should fail to bundle components with template tag & render function', function () {
  //   assert.throws(
  //     () => simpleRollup('ConflictRender.vue'),
  //     Error
  //   )
  // })
})

function read (file) {
  return fs.readFileSync(path.resolve(__dirname, file), 'utf-8')
}

// Assert equal except for line endings
function assertEqualFile (a, b, c) {
  return assert.strictEqual(a.replace(/\r/g, ''), b.replace(/\r/g, ''), c)
}

// Rollup with basic config and no css output
function simpleRollup (fixture) {
  return rollup.rollup({
    input: './fixtures/' + fixture,
    plugins: [
      vue(),
      css({ output: false })
    ]
  })
}
