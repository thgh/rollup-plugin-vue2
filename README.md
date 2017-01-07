### Check first if [rollup-plugin-vue] works for you, it also supports Vue 2 and it's better maintained!

> The repository you are looking at is not actively maintained and boils down to a subset of [rollup-plugin-vue].

# Rollup plugin for Vue 2

### Transform .vue components & precompile templates

__&checkmark;__ Ready to __transpile ES6__ with [rollup-plugin-buble] & [rollup-plugin-babel]  
__&checkmark;__ Fastest bundle by __precompiling templates__ with [vue-template-compiler]  
__&checkmark;__ [Let's see the example config](#usage)
 
__&cross;__ No support for vue-hot-reload-api (help needed)  

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

**Warning**: rollup-plugin-vue2 will transform the style tags to imports. You need one of these plugins to handle these:

- [rollup-plugin-scss]
- [rollup-plugin-css-only]
- [rollup-plugin-postcss]

## Usage
Put `vue()` before any transpiler like Bublé or Babel
```js
// rollup.config.js
import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  sourcemaps: true,
  plugins: [
    vue(),
    css(),
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
- [jetiny](https://github.com/jetiny) - Implement component parser of vue-template-compiler
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-contributors]: ../../contributors
[rollup-plugin-vue]: https://www.npmjs.com/package/rollup-plugin-vue
[rollup-plugin-vue2]: https://www.npmjs.com/package/rollup-plugin-vue2
[rollup-plugin-css-only]: https://www.npmjs.com/package/rollup-plugin-css-only
[rollup-plugin-postcss]: https://www.npmjs.com/package/rollup-plugin-postcss
[rollup-plugin-scss]: https://www.npmjs.com/package/rollup-plugin-scss
[rollup-plugin-buble]: https://www.npmjs.com/package/rollup-plugin-buble
[rollup-plugin-babel]: https://www.npmjs.com/package/rollup-plugin-babel
[vue-template-compiler]: https://www.npmjs.com/package/vue-template-compiler
