# Changelog

All notable changes to `rollup-plugin-vue2` will be documented in this file.

## [Unreleased]

## [0.6.0] - 2016-11-30
### Changed
- #7 Strip `with` by transpiling render methods

## [0.5.0] - 2016-11-04
### Changed
- #5 Freeze render methods to avoid renamed methods

## [0.4.0] - 2016-11-02
### Added
- #2 Support for src imports

## [0.3.0] - 2016-11-01
### Changed
- #4 Replace parse5 by vue-template-compiler from [jetiny](https://github.com/jetiny).

## [0.2.0] - 2016-09-30
### Added
- Sourcemap support

## [0.1.0] - 2016-09-28
### Changed
- Force strict mode to avoid trouble with other formats.

## [0.0.8] - 2016-09-24
### Added
- Add support for Vue components without script and/or template.

### Changed
- Try fixing compatibility with uglifyjs.

### Removed
- #1 Option `css` is removed. Styles are transformed into an `import` statement.

## [0.0.1] - 2016-08-23
### Added
- Same API as [rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue)
- Use vue-template-compiler to compile *.vue files.

[Unreleased]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.6.0...HEAD
[0.7.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.0.8...v0.1.0
[0.0.8]: https://github.com/thgh/rollup-plugin-vue2/compare/v0.0.1...v0.0.8
[0.0.1]: https://github.com/thgh/rollup-plugin-vue2/releases
