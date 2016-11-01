/* global describe, it */
var vue = require('../')
var css = require('rollup-plugin-css-only')['default']
var assert = require('assert')
var fs = require('fs')
var rollup = require('rollup')
var path = require('path')

process.chdir(__dirname)

describe('rollup-plugin-vue2', function () {
  it('should rollup entry.js', function () {
    var actualCss = ''
    return rollup.rollup({
      format: 'cjs',
      entry: './fixtures/entry.js',
      plugins: [
        vue(),
        css({
          output (out) {
            actualCss = out
          }
        })
      ]
    }).then(function (bundle) {
      var result = bundle.generate()

      // Script and template
      var expected = read('expects/bundle.js')
      assertEqualFile(result.code, expected, 'should output script')

      // Styles
      var expectedCss = read('expects/bundle.css')
      assertEqualFile(expectedCss, actualCss, 'should output style')
    })
  })

  it('should handle components with only template', function () {
    return simpleRollup('OnlyTemplate.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/OnlyTemplate.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with only script', function () {
    return simpleRollup('OnlyScript.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/OnlyScript.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with only style', function () {
    return simpleRollup('OnlyStyle.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/OnlyStyle.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without style', function () {
    return simpleRollup('WithoutStyle.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/WithoutStyle.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without template', function () {
    return simpleRollup('WithoutTemplate.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/WithoutTemplate.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components without script', function () {
    return simpleRollup('WithoutScript.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/WithoutScript.js')
      assertEqualFile(result.code, expected)
    })
  })

  it('should handle components with src imports', function () {
    return simpleRollup('SrcImport.vue').then(function (bundle) {
      var result = bundle.generate()
      var expected = read('expects/SrcImport.js')
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
  return assert.equal(a.replace(/\r/g, ''), b.replace(/\r/g, ''), c)
}

// Assert equal except for line endings
function simpleRollup (fixture) {
  return rollup.rollup({
    format: 'cjs',
    entry: './fixtures/' + fixture,
    plugins: [
      vue(),
      css({ output: false })
    ]
  })
}
