# Rollup plugin for Vue 2.0

### Transform .vue components & precompile templates

__&checkmark;__ Ready to __transpile ES6__ with [rollup-plugin-buble] & [rollup-plugin-babel]  
__&checkmark;__ Fastest bundle by __precompiling templates__ with [vue-template-compiler]  
__&checkmark;__ [Let's see the example config](#usage)
 
__&cross;__ No support for vue-hot-reload-api (help needed)  
__&cross;__ No support for css compilation, but can trigger another build tool

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/thgh/rollup-plugin-vue2/issues">
  <img src="https://img.shields.io/github/issues/thgh/rollup-plugin-vue2.svg" alt="Issues" />
</a>
<a href="http://standardjs.com/">
  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
</a>
<a href="https://npmjs.org/package/rollup-plugin-vue2">
  <img src="https://img.shields.io/npm/v/rollup-plugin-vue2.svg?style=flat-squar" alt="NPM" />
</a>
<a href="https://github.com/thgh/rollup-plugin-vue2/releases">
  <img src="https://img.shields.io/github/release/thgh/rollup-plugin-vue2.svg" alt="Latest Version" />
</a>
  
## Installation
```
npm install --save-dev rollup-plugin-vue2
```

## Usage
Put `vue()` before any transpiler like Bublé or Babel
```js
// rollup.config.js
import vue from 'rollup-plugin-vue2';
import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  plugins: [
    vue(),
    buble(),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs(),
    uglify()
  ]
}
```

Time to rollup!

```bash
# Build
#  -c will default to rollup.config.js
rollup -c

# Development
#  -w will watch for changes
rollup -c -w
```

### Options

There is only 1 option for now: `css`.
By default the plugin will base the filename for the css on the bundle destination.

```js
vue({
  // Filename to write all styles to
  css: 'bundle.scss',

  // Callback that will be called ongenerate with two arguments:
  // - styles: the contents of all style tags combined: 'body { color: green }'
  // - styleNodes: an array of style objects: [{lang: 'css', content: 'body { color: green }'}]
  css: function (styles, styleNodes) {
    writeFileSync('bundle.scss', styles)
  },

  // Disable any style output or callbacks
  css: false,

  // Default behaviour is to write all styles to the bundle destination where .js is replaced by .css
  css: null
})
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Testing

The linter will check for [JS Standard Style](http://standardjs.com/)

``` bash
# Unittests
npm run unit

# Linting
npm run lint

# Run all the above
npm run test
```

## Contributing

Contributions and feedback are very welcome.

To get it running:
  1. Clone the project.
  2. `npm install`
  3. `npm run build`

## Credits

- [Thomas Ghysels](https://github.com/thgh) - Support for &lt;style>, Bublé & Vue 2.0
- [Rahul Kadyan](https://github.com/znck) - Author of the original [rollup-plugin-vue]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-contributors]: ../../contributors
[rollup-plugin-vue]: https://www.npmjs.com/package/rollup-plugin-vue
[rollup-plugin-buble]: https://www.npmjs.com/package/rollup-plugin-buble
[rollup-plugin-babel]: https://www.npmjs.com/package/rollup-plugin-babel
[vue-template-compiler]: https://www.npmjs.com/package/vue-template-compiler
