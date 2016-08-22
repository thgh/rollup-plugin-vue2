export function log (text) {
  console.log(text)
}

export function warn (text) {
  console.log(red(text))
}

export function emitted (text, bytes) {
  console.log(green(text), getSize(bytes))
}

export function green (text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}

export function red (text) {
  return '\u001b[1m\u001b[31m' + text + '\u001b[39m\u001b[22m'
}

export function getSize (bytes) {
  return bytes < 10000
    ? bytes.toFixed(0) + ' B'
    : bytes < 1024000
    ? (bytes / 1024).toPrecision(3) + ' kB'
    : (bytes / 1024 / 1024).toPrecision(4) + ' MB'
}
