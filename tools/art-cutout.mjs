#!/usr/bin/env node
// tools/art-cutout.mjs — turn a generated picture on a flat chroma background into a
// transparent cut-out (WebP with alpha) that can float over any slide.
//
// Why: image models do not output transparency. The workaround is to ask for the object
// on a flat, uniform background — green #00FF00, magenta #FF00FF or pure white — and key
// that color out here. Flood-fill from the frame edges removes the background without
// eating the same color inside the object; a second, tighter global pass clears holes
// enclosed by the object (default for green/magenta, opt-in for white — white also lives
// inside most objects).
//
// Zero dependencies: plain Node plus ImageMagick (`magick`, or IM6 `convert`). Nothing is installed at runtime.
//
//   node tools/art-cutout.mjs <in.png> [--out <file>] [--key auto|green|magenta|white|#RRGGBB]
//        [--fuzz 18] [--holes|--no-holes] [--erode 1] [--max-side 1200] [--pad 8] [--png]
//
// Output: <in>.webp next to the input unless --out is given (--png writes a PNG instead).
// Exit 2 = ImageMagick is missing, exit 1 = bad input.

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const KEYS = { green: '#00FF00', magenta: '#FF00FF', white: '#FFFFFF' }
const DEFAULTS = { key: 'auto', fuzz: 18, erode: 1, maxSide: 1200, pad: 8, png: false, holes: null }

function die(message, code = 1) {
  console.error(`art-cutout: ${message}`)
  process.exit(code)
}

function usage() {
  console.log(`Key a flat chroma background out of a generated picture → transparent cut-out.

  node tools/art-cutout.mjs <in.png> [options]

  --out <file>       output file                      (default: <in>.webp next to the input)
  --key <color>      auto | green | magenta | white | #RRGGBB   (default auto: sampled at the corners)
  --fuzz <percent>   color tolerance of the edge flood-fill      (default ${DEFAULTS.fuzz})
  --holes            also clear enclosed pockets of the key color (default for green/magenta)
  --no-holes         never touch pixels not connected to the frame edge (default for white)
  --erode <px>       shave the edge to drop the tinted fringe    (default ${DEFAULTS.erode}; 0 = off)
  --max-side <px>    downscale the longer side to                (default ${DEFAULTS.maxSide}; never upscales)
  --pad <px>         transparent margin around the trimmed object (default ${DEFAULTS.pad})
  --png              write a PNG instead of WebP

Ask the model for "a single object, centered, on a perfectly flat uniform pure green
(#00FF00) background filling the whole frame, nothing else" — then run this.`)
}

function parseArgs(argv) {
  const options = { ...DEFAULTS, input: null, out: null }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = () => {
      const value = argv[i + 1]
      if (value === undefined) die(`${arg} needs a value`)
      i += 1
      return value
    }
    if (arg === '--help' || arg === '-h') { usage(); process.exit(0) }
    else if (arg === '--out') options.out = next()
    else if (arg === '--key') options.key = next()
    else if (arg === '--fuzz') options.fuzz = Number(next())
    else if (arg === '--erode') options.erode = Number(next())
    else if (arg === '--max-side') options.maxSide = Number(next())
    else if (arg === '--pad') options.pad = Number(next())
    else if (arg === '--holes') options.holes = true
    else if (arg === '--no-holes') options.holes = false
    else if (arg === '--png') options.png = true
    else if (arg.startsWith('--')) die(`unknown option ${arg}`)
    else if (options.input) die('one input file at a time')
    else options.input = arg
  }
  if (!options.input) { usage(); process.exit(1) }
  for (const name of ['fuzz', 'erode', 'maxSide', 'pad']) {
    if (!Number.isFinite(options[name]) || options[name] < 0) die(`--${name} must be a non-negative number`)
  }
  return options
}

// ImageMagick 7 ships `magick`; ImageMagick 6 (still the default on Debian/Ubuntu, and in
// the studio sandbox image) ships `convert` with the same argument order. Accept either.
// The one primitive that differs is the flood-fill target: `alpha` in IM7, `matte` in IM6.
const MAGICK_BIN = ['magick', 'convert'].find((bin) => spawnSync(bin, ['-version'], { encoding: 'utf8' }).status === 0) ?? null
const ALPHA_PRIMITIVE = MAGICK_BIN === 'convert' ? 'matte' : 'alpha'

function magick(args, { capture = false } = {}) {
  if (!MAGICK_BIN) {
    console.error("art-cutout: ImageMagick ('magick' or 'convert') not found — it does the keying.")
    console.error('  macOS:          brew install imagemagick')
    console.error('  Debian/Ubuntu:  sudo apt-get install -y imagemagick')
    process.exit(2)
  }
  const result = spawnSync(MAGICK_BIN, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.status !== 0) die(`${MAGICK_BIN} failed: ${(result.stderr || '').trim()}`)
  return capture ? result.stdout : ''
}

/** Hex → [r, g, b]. */
function rgbOf(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) die(`bad color ${hex} — use green, magenta, white or #RRGGBB`)
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

/**
 * The key color: a named preset, a hex, or — auto — the color at the four corners. JPEG
 * noise makes the corners differ by a few units, so they are averaged and snapped to the
 * nearest preset when one is close; otherwise the averaged color itself is the key.
 */
const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`

/** The background color the model actually painted: the four corner pixels, averaged. */
function sampleCorners(input) {
  const [w, h] = magick([input, '-format', '%w %h', 'info:'], { capture: true }).trim().split(' ').map(Number)
  const corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]
  const format = corners.map(([x, y]) => `%[hex:p{${x},${y}}]`).join(' ')
  const samples = magick([input, '-format', format, 'info:'], { capture: true }).trim().split(/\s+/).map((s) => rgbOf(`#${s.slice(0, 6)}`))
  const mean = [0, 1, 2].map((i) => Math.round(samples.reduce((sum, s) => sum + s[i], 0) / samples.length))
  const spread = Math.max(...samples.map((s) => distance(s, mean)))
  return { mean, spread, samples }
}

function resolveKey(input, key) {
  if (key !== 'auto') return KEYS[key] ?? (rgbOf(key), key.startsWith('#') ? key : `#${key}`)
  const { mean, spread, samples } = sampleCorners(input)
  if (spread > 40) die(`corners disagree (${samples.map(toHex).join(', ')}) — pass --key explicitly`)
  for (const preset of Object.values(KEYS)) if (distance(rgbOf(preset), mean) < 60) return preset
  return toHex(mean)
}

/**
 * The color to clear inside enclosed holes. Models rarely paint the exact preset (a
 * "pure green" comes back as #03FB29), so the holes pass keys the color the corners
 * actually show whenever it is close to the requested key; the edge flood-fill already
 * compares against the seed pixel and does not need this.
 */
function holeKey(input, key) {
  const { mean, spread } = sampleCorners(input)
  return spread <= 40 && distance(rgbOf(key), mean) < 60 ? toHex(mean) : key
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const input = path.resolve(options.input)
  if (!fs.existsSync(input)) die(`no such file: ${options.input}`)
  const key = resolveKey(input, options.key)
  const [r, g, b] = rgbOf(key)
  const isWhite = r > 235 && g > 235 && b > 235
  const holes = options.holes ?? !isWhite
  const out = path.resolve(options.out ?? input.replace(/\.[^.]+$/, '') + (options.png ? '.png' : '.webp'))

  const [w, h] = magick([input, '-format', '%w %h', 'info:'], { capture: true }).trim().split(' ').map(Number)
  // Seeds along the whole frame edge: a background touching the edge anywhere gets removed
  // even when a corner is covered by the object.
  const seeds = []
  for (const x of [0, Math.floor(w / 2), w - 1]) for (const y of [0, Math.floor(h / 2), h - 1]) {
    if (x === Math.floor(w / 2) && y === Math.floor(h / 2)) continue
    seeds.push(`${ALPHA_PRIMITIVE} ${x},${y} floodfill`)
  }

  const args = [input, '-alpha', 'set', '-fuzz', `${options.fuzz}%`, '-fill', 'none']
  for (const seed of seeds) args.push('-draw', seed)
  if (holes) args.push('-fuzz', `${Math.max(3, Math.round(options.fuzz / 3))}%`, '-transparent', holeKey(input, key))
  args.push('-channel', 'A')
  if (options.erode > 0) args.push('-morphology', 'Erode', `Diamond:${options.erode}`)
  args.push('-blur', '0x0.6', '+channel')
  args.push('-trim', '+repage', '-bordercolor', 'none', '-border', String(options.pad))
  args.push('-resize', `${options.maxSide}x${options.maxSide}>`)
  if (!options.png) args.push('-define', 'webp:method=6', '-quality', '88')
  args.push(out)
  magick(args)

  const size = fs.statSync(out).size
  const dims = magick([out, '-format', '%w×%h', 'info:'], { capture: true }).trim()
  console.log(`${path.relative(process.cwd(), out)}  ${dims}  ${(size / 1024).toFixed(0)} KB  (key ${key}, holes ${holes ? 'on' : 'off'})`)
}

main()
