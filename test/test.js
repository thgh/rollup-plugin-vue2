/* global describe, it */
var vue = require('../')
var css = require('rollup-plugin-css')
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
      assertEqualFile(result.code.replace(/\r/g, ''), expected, 'should output script')

      // Styles
      var css = read('expects/bundle.css')
      assertEqualFile(actualCss, css, 'should output style')
    })
  })

  // it('should handle components without script', function () {
  //   return simpleRollup('WithoutScript.vue').then(function (bundle) {
  //     var result = bundle.generate()
  //     var expected = read('expects/without-script.js')
  //     assertEqualFile(result.code, expected)
  //   })
  // })

  // it('should handle components without template', function () {
  //   return simpleRollup('WithoutTemplate.vue').then(function (bundle) {
  //     var result = bundle.generate()
  //     var expected = read('expects/without-template.js')
  //     assertEqualFile(result.code, expected)
  //   })
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
// function simpleRollup (fixture) {
//   return rollup.rollup({
//     format: 'cjs',
//     entry: './fixtures/' + fixture,
//     plugins: [vue({ css: false })]
//   })
// }
