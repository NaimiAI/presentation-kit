#!/usr/bin/env node
// tools/ingest-source.mjs — pull reusable image assets out of a client's source files
// (PDF, PPTX, loose images) so a deck can carry the real photos, portraits and logos
// instead of inventing placeholders.
//
// Why a script and not the model: the extraction is mechanical and full of traps that are
// invisible on a rendered page. Soft masks live in a separate channel (a white logo comes
// out as an "empty" file without them), sources are CMYK or ICC, the same logo repeats on
// every page, full-page photos unpack into multi-megabyte PNGs that no bundle accepts.
// The script does the mechanical part; deciding what belongs on which slide stays with
// the model looking at the page previews.
//
// Vector art (charts, diagrams, shapes drawn with PDF operators) is deliberately NOT
// extracted: rebuilding it as HTML/CSS is the whole point of a web deck.
//
// What the pages LOOK like — the brand, which logo is the document's own, what matters — is
// not measured here: the model sees the pages themselves. One thing is printed as it stands in
// the file: the theme a PPTX declares (its colour and font scheme), because nothing renders a
// PPTX for the model to look at.
//
// Zero dependencies: plain Node plus command line tools from poppler and ImageMagick.
// Nothing is installed at runtime.
//
//   node tools/ingest-source.mjs <file...> [--out assets-src] [--min-side 200]
//        [--max-side 1920] [--budget-mb 35] [--max-files 60] [--no-pages] [--pages 61-84]
//        [--no-guide]
//
// Output: <out>/*.webp, <out>/pages/*.jpg (page previews) and <out>/manifest.json with one
// record per asset. Warnings go to stdout next to the summary — one stream, one story. Hard failures go to stderr: exit 2 = a required tool is missing,
// exit 1 = bad input. `--no-guide` prints what was found without the next steps — for a
// caller that gives its own directions (the AI studio's sandbox wraps this script).
//
// A source of hundreds of pages is taken a range at a time (`--pages 61-84`): images and
// previews of those pages only, the rest of the file untouched. Without a range the first
// PAGE_PREVIEW_LIMIT pages get previews and the whole file gets its images.

import { spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// Platform limits the output has to live inside (bundle rules): 5 MB per file, 40 MB
// unpacked. The default budget leaves room for the deck itself on top of the assets.
const FILE_LIMIT_BYTES = 5 * 1024 * 1024
const DEFAULTS = { out: 'assets-src', minSide: 200, maxSide: 1920, budgetMb: 35, maxFiles: 60, pages: true, range: null, guide: true }
const PAGE_PREVIEW_DPI = 50
const PAGE_PREVIEW_LIMIT = 60
// Quality/size ladder: the first step that fits the limits wins, so the common case is a
// single encode. Only oversized art walks down the ladder.
const ENCODE_STEPS = [
  { quality: 82, scale: 1 },
  { quality: 70, scale: 1 },
  { quality: 55, scale: 1 },
  { quality: 70, scale: 0.5 },
  { quality: 55, scale: 0.35 },
]
const READY_IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff'])
const SKIP_MEDIA_EXT = new Set(['.emf', '.wmf', '.svm', '.mp4', '.mov', '.m4v', '.wmv', '.avi', '.mp3', '.wav', '.m4a'])

const warnings = []
function warn(message) {
  warnings.push(message)
  console.log(`warning: ${message}`)
}

function die(message, code = 1) {
  console.error(`ingest-source: ${message}`)
  process.exit(code)
}

function missingTool(tool, why) {
  console.error(`ingest-source: '${tool}' not found — ${why}`)
  console.error('  macOS:          brew install poppler imagemagick')
  console.error('  Debian/Ubuntu:  sudo apt-get install -y poppler-utils imagemagick')
  console.error('Then run the command again. If you cannot install it, ask the user to send')
  console.error('the images (photos, portraits, logos) as separate files instead.')
  process.exit(2)
}

// ------------------------------------------------------------------ command line

function usage() {
  console.log(`Extract reusable images from client source files (PDF, PPTX, images).

  node tools/ingest-source.mjs <file...> [options]

  --out <dir>        where to write assets      (default ${DEFAULTS.out})
  --min-side <px>    drop images smaller than   (default ${DEFAULTS.minSide})
  --max-side <px>    downscale longer side to   (default ${DEFAULTS.maxSide})
  --budget-mb <mb>   total size of all assets   (default ${DEFAULTS.budgetMb})
  --max-files <n>    stop after this many       (default ${DEFAULTS.maxFiles})
  --no-pages         skip page previews
  --pages <a-b>      only these pages of a PDF: images and previews of the range
  --no-guide         print what was found, without the next steps
`)
}

// `--pages 61-84` (or a single page `61`) → { first, last }; anything else is a bad input.
function parsePageRange(value) {
  const m = /^(\d+)(?:-(\d+))?$/.exec(String(value ?? '').trim())
  if (!m) return null
  const first = Number(m[1])
  const last = m[2] === undefined ? first : Number(m[2])
  if (first < 1 || last < first) return null
  return { first, last }
}

function parseCli(argv) {
  const opts = { ...DEFAULTS, inputs: [] }
  const numeric = {
    '--min-side': 'minSide', '--max-side': 'maxSide', '--budget-mb': 'budgetMb', '--max-files': 'maxFiles',
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') { usage(); process.exit(0) }
    if (arg === '--no-pages') { opts.pages = false; continue }
    if (arg === '--no-guide') { opts.guide = false; continue }
    if (arg === '--out') { opts.out = argv[++i] ?? die('--out needs a directory'); continue }
    if (arg === '--pages') {
      opts.range = parsePageRange(argv[++i]) ?? die('--pages needs a range like 61-84 (first page 1, last not before first)')
      continue
    }
    if (numeric[arg]) {
      const value = Number(argv[++i])
      if (!Number.isFinite(value) || value <= 0) die(`${arg} needs a positive number`)
      opts[numeric[arg]] = value
      continue
    }
    if (arg.startsWith('--')) die(`unknown option ${arg} (--help for the list)`)
    opts.inputs.push(arg)
  }
  return opts
}

// ------------------------------------------------------------------ external tools

function run(cmd, args, extra = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...extra })
  if (res.error?.code === 'ENOENT') return { missing: true, ok: false, stdout: '', stderr: '' }
  return { missing: false, ok: res.status === 0, stdout: res.stdout ?? '', stderr: res.stderr ?? '' }
}

function hasBinary(cmd) {
  const res = spawnSync(cmd, ['-v'], { stdio: 'ignore' })
  return !(res.error?.code === 'ENOENT')
}

// Junk by size: a picture is kept when its shorter side reaches --min-side; below that are
// spacers, bullets, icons and rules. Smaller images on request — a lower --min-side.
const tooSmall = (width, height, minSide) => Math.min(width, height) < minSide

// ImageMagick 7 ships `magick`, ImageMagick 6 (still the default on Debian/Ubuntu) ships
// `convert` with the same argument order — accept either, or work without one at all.
function resolveMagick(tmpDir) {
  const bin = ['magick', 'convert'].find((cmd) => hasBinary(cmd))
  if (!bin) return { mode: 'raw' }
  // The webp delegate is a separate build option: probe once instead of failing per file.
  const probe = path.join(tmpDir, 'probe.webp')
  const res = run(bin, ['xc:red', '-quality', '80', probe])
  const webp = res.ok && fs.existsSync(probe) && fs.statSync(probe).size > 0
  fs.rmSync(probe, { force: true })
  return { mode: 'magick', bin, webp }
}

// ------------------------------------------------------------------ image probing

// Dimensions and alpha straight from the file header — cheaper than spawning `identify`
// once per asset, and it also works in the degraded (no ImageMagick) mode.
function probeImage(buf) {
  if (buf.length >= 26 && buf.readUInt32BE(0) === 0x89504e47) {
    const colorType = buf[25]
    const alpha = colorType === 4 || colorType === 6 || (colorType === 3 && buf.includes('tRNS', 0, 'latin1'))
    return { format: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), alpha }
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off += 1; continue }
      const marker = buf[off + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { off += 2; continue }
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSof) return { format: 'jpeg', width: buf.readUInt16BE(off + 7), height: buf.readUInt16BE(off + 5), alpha: false }
      off += 2 + buf.readUInt16BE(off + 2)
    }
    return null
  }
  if (buf.length >= 30 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') {
    const chunk = buf.toString('latin1', 12, 16)
    if (chunk === 'VP8X') {
      return {
        format: 'webp',
        width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
        height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
        alpha: (buf[20] & 0x10) !== 0,
      }
    }
    if (chunk === 'VP8 ') {
      return { format: 'webp', width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff, alpha: false }
    }
    if (chunk === 'VP8L') {
      const bits = buf.readUInt32LE(21)
      return {
        format: 'webp',
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >> 14) & 0x3fff),
        alpha: ((bits >> 28) & 1) === 1,
      }
    }
    return { format: 'webp', width: 0, height: 0, alpha: false }
  }
  if (buf.length >= 10 && buf.toString('latin1', 0, 4) === 'GIF8') {
    return { format: 'gif', width: buf.readUInt16LE(6), height: buf.readUInt16LE(8), alpha: true }
  }
  return null
}

// ------------------------------------------------------------------ naming

// Cyrillic to Latin by code point, U+0430..U+044F (this file stays ASCII: it ships in the
// public kit). A file named in Cyrillic gets a readable slug instead of a bare fallback.
const CYRILLIC_LATIN = [
  'a', 'b', 'v', 'g', 'd', 'e', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
  'r', 's', 't', 'u', 'f', 'kh', 'ts', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya',
]
function transliterate(text) {
  let out = ''
  for (const char of text) {
    const code = char.codePointAt(0)
    if (code >= 0x430 && code <= 0x44f) out += CYRILLIC_LATIN[code - 0x430]
    else if (code === 0x451) out += 'e'
    else out += char
  }
  return out
}

// The slug names everything a source produces: its assets, its page previews. So it has to tell
// two sources apart — a pure function of the file name, the same in every run (a later
// `--pages` run adds to the previews of the first one). Whenever the readable part cannot carry
// the name — a letter or a digit of a script it has no Latin for, a cut to `max` — a short hash
// of the name follows it: `brochure-2026.pdf` stays `brochure-2026`, two long names with a
// common head or two names in another script no longer share one slug (the previews of the
// second used to overwrite the first). Punctuation and spaces are separators, not a loss.
// `max` limits the readable part.
function slugify(name, max = 28) {
  const stem = path.basename(name, path.extname(name))
  // NFKD splits an accented letter into the letter and its mark; the marks are dropped.
  const latin = transliterate(stem.normalize('NFKD').toLowerCase()).replace(/\p{M}+/gu, '')
  const base = latin.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  let readable = base
  if (base.length > max) {
    // Cut on a word boundary when one is close enough — half-words read like typos.
    const cut = base.slice(0, max)
    const lastDash = cut.lastIndexOf('-')
    readable = (base[max] === '-' || lastDash < 8 ? cut : cut.slice(0, lastDash)).replace(/-+$/, '')
  }
  const whole = readable === base && !/[^a-z0-9]/.test(latin.replace(/[^\p{L}\p{N}]+/gu, ''))
  if (whole && readable) return readable
  const hash = crypto.createHash('sha1').update(path.basename(name)).digest('hex').slice(0, 6)
  return `${readable || 'source'}-${hash}`
}

const usedNames = new Set()
function uniqueName(base, ext) {
  let candidate = `${base}${ext}`
  let n = 2
  while (usedNames.has(candidate)) { candidate = `${base}-${n}${ext}`; n += 1 }
  usedNames.add(candidate)
  return candidate
}

// ------------------------------------------------------------------ collecting: PDF

// `pdfimages -list` columns: page num type width height color comp bpc enc interp
// object-num object-gen x-ppi y-ppi size ratio. Inline images print "[inline]" as a single
// token instead of the object pair, hence the branch.
function parseImageList(text) {
  const rows = []
  for (const line of text.split('\n')) {
    const f = line.trim().split(/\s+/)
    if (f.length < 12 || !/^\d+$/.test(f[0]) || !/^\d+$/.test(f[1])) continue
    rows.push({
      page: Number(f[0]),
      num: Number(f[1]),
      type: f[2],
      width: Number(f[3]),
      height: Number(f[4]),
      color: f[5],
      comp: Number(f[6]),
      enc: f[8],
      object: f[10] === '[inline]' ? `inline-${f[1]}` : f[10],
      // Resolution of the image as placed on the page: its size on the page is width / xPpi inches.
      xPpi: Number(f[f[10] === '[inline]' ? 11 : 12]),
      yPpi: Number(f[f[10] === '[inline]' ? 12 : 13]),
    })
  }
  return rows
}

// Which streams may be copied out instead of decoded — the single decision this whole
// hybrid rests on. `-png` alone rewrites every raster: on an 18-page brochure of full-page
// 300 dpi photos that is 20 seconds of pure transcoding out of 24. Adding `-j` copies a
// DCT stream out as the JPEG it already is (0.5 s for the same file, pixel-identical), and
// everything else still comes out as PNG. The copy stays faithful only while the stream
// stands on its own: a JPEG in DeviceRGB or DeviceGray does, one in an ICC, CMYK or indexed
// space does not — that colour transform lives in the PDF, not in the stream, and copying
// the stream silently drops it. Those objects are decoded by poppler in a second pass, page
// by page (`decodePass`), so decoding is paid for exactly where it changes the picture.
const NATIVE_JPEG_COLOR = new Set(['rgb', 'gray'])
function needsDecoding(row) {
  return row.enc === 'jpeg' && !NATIVE_JPEG_COLOR.has(row.color)
}

// How the second pass decodes. CMYK, DeviceN, indexed and four-component ICC art needs poppler's
// conversion to RGB, and only `-png` does it (`-tiff` keeps CMYK as CMYK). A three- or one-
// component ICC stream is RGB or gray once decoded, and `-tiff` writes exactly the pixels `-png`
// writes — poppler applies the profile either way — without PNG's deflate: a 124-page catalogue
// exported from InDesign (an ICC JPEG on every page) spent 77 s of its ingest in that deflate.
// Uncompressed pixels are big (430 MB for that catalogue, and a studio sandbox has 2 GiB of disk),
// so the pass runs DECODE_CHUNK_PAGES pages at a time, drops what the deck cannot use and turns
// the rest into a near-lossless JPEG at once (a photo was a JPEG in the source; the profile is
// baked into its pixels now). Without ImageMagick nothing could read a TIFF back — `-png` then.
const DECODE_CHUNK_PAGES = 6
const decodesAsTiff = (row, ctx) => ctx.encoder.mode === 'magick' && row.color === 'icc' && (row.comp === 3 || row.comp === 1)

function decodePass(file, rows, ctx, dir) {
  const byNum = new Map(rows.map((row) => [row.num, row]))
  // A page goes the safe way (`-png`) as soon as one of its streams needs it.
  const modeOf = new Map()
  for (const row of rows) {
    if (!needsDecoding(row)) continue
    if (modeOf.get(row.page) !== 'png') modeOf.set(row.page, decodesAsTiff(row, ctx) ? 'tiff' : 'png')
  }
  const decoded = new Map()
  for (const mode of ['png', 'tiff']) {
    const pages = [...modeOf].filter(([, m]) => m === mode).map(([page]) => page).sort((a, b) => a - b)
    for (const [first, last] of pageRanges(pages)) {
      for (let from = first; from <= last; from += DECODE_CHUNK_PAGES) {
        const to = Math.min(last, from + DECODE_CHUNK_PAGES - 1)
        const chunk = path.join(dir, `decoded-${from}`)
        fs.mkdirSync(chunk)
        run('pdfimages', [`-${mode}`, '-p', '-f', String(from), '-l', String(to), file, path.join(chunk, 'img')])
        // Only a decoded stream the deck may use outlives its chunk: the rest of the page (masks,
        // non-JPEG art — the first pass has them) and the images the size filter drops go now.
        const keep = []
        for (const [num, body] of indexDecoded(chunk, rows)) {
          const row = byNum.get(num)
          if (needsDecoding(row) && !tooSmall(row.width, row.height, ctx.minSide)) keep.push([num, body])
          else fs.rmSync(body, { force: true })
        }
        for (const [num, body] of mode === 'tiff' ? compactDecoded(keep, chunk, ctx) : keep) decoded.set(num, body)
      }
    }
  }
  return decoded
}

// The TIFFs of a chunk as JPEG (quality 95, full chroma) in one ImageMagick run; a TIFF that did not
// convert stays — the encoder reads it all the same, it only holds more disk.
function compactDecoded(entries, chunk, ctx) {
  if (!entries.length) return entries
  run(ctx.encoder.bin, [...entries.map(([, body]) => body), '-quality', '95', '-set', 'filename:base', '%t', '+adjoin', path.join(chunk, '%[filename:base].jpg')])
  return entries.map(([num, body]) => {
    const jpeg = body.replace(/\.tif$/, '.jpg')
    if (!fs.existsSync(jpeg) || fs.statSync(jpeg).size === 0) return [num, body]
    fs.rmSync(body, { force: true })
    return [num, jpeg]
  })
}

// Consecutive pages collapse into one `-f/-l` range: one poppler start-up instead of one
// per page, and a document that needs decoding everywhere costs exactly one full pass.
function pageRanges(pages) {
  const ranges = []
  for (const page of pages) {
    const last = ranges[ranges.length - 1]
    if (last && page === last[1] + 1) last[1] = page
    else ranges.push([page, page])
  }
  return ranges
}

// Whole-document run: files are <root>-<page>-<num>.<ext>, and the num column is the
// reliable key (page padding widens on documents with more than 999 pages). The extension
// now varies with how the stream was stored, hence the loose character class.
function indexExtracted(dir) {
  const files = new Map()
  for (const entry of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const m = /^img-\d+-(\d+)\.[a-z0-9]+$/.exec(entry)
    if (m) files.set(Number(m[1]), path.join(dir, entry))
  }
  return files
}

// A page-restricted run restarts poppler's image counter, so the number in the file name is
// local to that run and only the page part carries over. Pairing is therefore positional
// inside a page: `-list` and the extractor walk the same content streams in the same order.
// A page whose counts disagree is left out entirely rather than paired off by one — the
// whole-document run already has a usable file for it.
function indexDecoded(dir, rows) {
  const byPage = new Map()
  for (const entry of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const m = /^img-0*(\d+)-0*(\d+)\.[a-z0-9]+$/.exec(entry)
    if (!m) continue
    const page = Number(m[1])
    if (!byPage.has(page)) byPage.set(page, [])
    byPage.get(page).push({ order: Number(m[2]), file: path.join(dir, entry) })
  }
  const decoded = new Map()
  for (const [page, entries] of byPage) {
    const pageRows = rows.filter((row) => row.page === page)
    if (entries.length !== pageRows.length) continue
    entries.sort((a, b) => a.order - b.order)
    entries.forEach((entry, i) => decoded.set(pageRows[i].num, entry.file))
  }
  return decoded
}

// The page count of a PDF (`pdfinfo`, poppler) — for the report and for clamping a range; null
// when unknown. Not a hard dependency: the extraction works without it.
function pdfPageCount(file) {
  const res = run('pdfinfo', [file])
  if (!res.ok) return null
  const pages = Number(/^Pages:\s+(\d+)/m.exec(res.stdout)?.[1])
  return Number.isInteger(pages) && pages > 0 ? pages : null
}

// `-f/-l` of a page range for the poppler tools; empty without a range. Both `-list` and the
// extraction get the same range, so their image numbering (local to a run) stays paired.
const rangeArgs = (range) => (range ? ['-f', String(range.first), '-l', String(range.last)] : [])

function collectFromPdf(file, ctx) {
  if (!hasBinary('pdfimages')) missingTool('pdfimages', 'it comes with poppler')
  const listed = run('pdfimages', ['-list', ...rangeArgs(ctx.range), file])
  if (!listed.ok) {
    warn(`${path.basename(file)}: pdfimages could not read it (${listed.stderr.trim() || 'unknown error'}) — skipped`)
    return []
  }
  const rows = parseImageList(listed.stdout)
  if (!rows.length) {
    warn(`${path.basename(file)}: no raster images ${ctx.range ? `on pages ${ctx.range.first}-${ctx.range.last}` : 'inside'} (charts and shapes are vector — rebuild them in HTML/CSS)`)
    return []
  }

  // Masks are listed right after the image they belong to and share its object id.
  const images = []
  for (const row of rows) {
    if (row.type === 'image') { images.push(row); continue }
    if (row.type !== 'smask' && row.type !== 'mask') continue
    const owner = images.filter((img) => img.object === row.object).pop()
    if (owner) owner.mask = row
  }

  const dir = fs.mkdtempSync(path.join(ctx.tmpDir, 'pdf-'))
  const nativeDir = path.join(dir, 'native')
  fs.mkdirSync(nativeDir)
  const extracted = run('pdfimages', ['-png', '-j', '-p', ...rangeArgs(ctx.range), file, path.join(nativeDir, 'img')])
  if (extracted.missing) missingTool('pdfimages', 'it comes with poppler')
  const native = indexExtracted(nativeDir)
  if (!extracted.ok && !native.size) {
    warn(`${path.basename(file)}: pdfimages failed to extract (${extracted.stderr.trim() || 'unknown error'}) — skipped`)
    return []
  }

  // Second pass only for the pages that hold a stream the copy would distort (see above).
  // Most documents need none at all; a catalogue from InDesign needs it on every page.
  const decoded = rows.some(needsDecoding) ? decodePass(file, rows, ctx, dir) : new Map()
  const bodyOf = (row) => (needsDecoding(row) ? decoded.get(row.num) ?? native.get(row.num) : native.get(row.num))

  const slug = slugify(file)
  const candidates = []
  let dropped = 0
  for (const row of images) {
    const body = bodyOf(row)
    if (!body) continue
    if (tooSmall(row.width, row.height, ctx.minSide)) { dropped += 1; continue }
    candidates.push({
      file: body,
      mask: row.mask ? bodyOf(row.mask) ?? null : null,
      source: path.basename(file),
      page: row.page,
      alpha: Boolean(row.mask),
      width: row.width,
      height: row.height,
      name: `${slug}-p${String(row.page).padStart(2, '0')}-${String(row.num).padStart(2, '0')}`,
    })
  }
  if (dropped > 0) {
    warn(`${path.basename(file)}: ${dropped} image(s) under ${ctx.minSide}px dropped — spacers, bullets, `
      + 'icons, rules and small logos. Need them anyway? Re-run with a lower --min-side.')
  }
  return candidates
}

// Previews of the first PAGE_PREVIEW_LIMIT pages, or of the requested range (clamped to the same
// limit): `<out>/pages/<slug>-<page>.jpg`, page numbers real. Returns what was rendered.
function renderPagePreviews(file, ctx) {
  if (!hasBinary('pdftoppm')) missingTool('pdftoppm', 'it comes with poppler')
  const dir = path.join(ctx.outDir, 'pages')
  fs.mkdirSync(dir, { recursive: true })
  const slug = slugify(file)
  const root = path.join(dir, slug)
  const first = ctx.range?.first ?? 1
  const last = Math.min(ctx.range?.last ?? Infinity, first + PAGE_PREVIEW_LIMIT - 1)
  const res = run('pdftoppm', ['-r', String(PAGE_PREVIEW_DPI), '-jpeg', '-f', String(first), '-l', String(last), file, root])
  if (!res.ok) {
    warn(`${path.basename(file)}: page previews failed (${res.stderr.trim() || 'unknown error'})`)
    return null
  }
  const prefix = path.basename(root)
  const pages = fs.readdirSync(dir)
    .map((entry) => (entry.startsWith(`${prefix}-`) && entry.endsWith('.jpg') ? Number(entry.slice(prefix.length + 1, -4)) : NaN))
    .filter((page) => Number.isInteger(page) && page >= first && page <= last)
  if (!pages.length) return null
  return { file: path.basename(file), slug, first: Math.min(...pages), last: Math.max(...pages), count: pages.length, total: pdfPageCount(file) }
}

// ------------------------------------------------------------------ collecting: PPTX

function collectFromPptx(file, ctx) {
  if (!hasBinary('unzip')) missingTool('unzip', 'it is part of the base system (apt-get install unzip)')
  const dir = fs.mkdtempSync(path.join(ctx.tmpDir, 'pptx-'))
  const res = run('unzip', ['-o', '-q', '-j', file, 'ppt/media/*', '-d', dir])
  if (res.missing) missingTool('unzip', 'it is part of the base system (apt-get install unzip)')
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []
  if (!entries.length) {
    const hint = path.extname(file).toLowerCase() === '.ppt'
      ? 'legacy .ppt is not a zip container — ask the user to re-save it as .pptx'
      : 'no ppt/media/* inside'
    warn(`${path.basename(file)}: ${hint} — skipped`)
    return []
  }
  const slug = slugify(file)
  const candidates = []
  let dropped = 0
  for (const entry of entries) {
    const ext = path.extname(entry).toLowerCase()
    if (SKIP_MEDIA_EXT.has(ext)) {
      warn(`${path.basename(file)}: ${entry} is ${ext.slice(1)} (vector or media, not convertible here) — rebuild it in HTML/CSS`)
      continue
    }
    const full = path.join(dir, entry)
    const probe = probeImage(fs.readFileSync(full))
    if (probe && tooSmall(probe.width, probe.height, ctx.minSide)) { dropped += 1; continue }
    candidates.push({
      file: full,
      mask: null,
      source: path.basename(file),
      page: null,
      alpha: probe?.alpha ?? false,
      width: probe?.width ?? 0,
      height: probe?.height ?? 0,
      name: `${slug}-${slugify(entry, 16)}`,
    })
  }
  if (dropped > 0) {
    warn(`${path.basename(file)}: ${dropped} media file(s) under ${ctx.minSide}px dropped — `
      + 're-run with a lower --min-side if you need them.')
  }
  return candidates
}

// The theme a PPTX declares: the colour scheme (dark 1/2, light 1/2, accents 1-6) and the font
// scheme (headings, body) of `ppt/theme/theme1.xml`, and the colours its slides use, counted over
// their XML. Data of the file, read as it stands — nothing renders a PPTX for the model to look at.
const OFFICE_ACCENTS = new Set([
  '4472C4 ED7D31 A5A5A5 FFC000 5B9BD5 70AD47', // Office 2013-2022
  '4F81BD C0504D 9BBB59 8064A2 4BACC6 F79646', // Office 2007-2010
  '156082 E97132 196B24 0F9ED5 A02B93 4EA72E', // Office 2023+
])
const SCHEME_ALIASES = { tx1: 'dk1', bg1: 'lt1', tx2: 'dk2', bg2: 'lt2' }
const SLIDE_COLOURS = 6

function pptxTheme(file) {
  const theme = run('unzip', ['-p', file, 'ppt/theme/theme1.xml'])
  if (!theme.ok || !theme.stdout.includes('clrScheme')) return null
  const xml = theme.stdout
  const scheme = {}
  for (const slot of ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6']) {
    const inner = new RegExp(`<a:${slot}>([\\s\\S]*?)</a:${slot}>`).exec(xml)?.[1] ?? ''
    const value = /srgbClr val="([0-9a-f]{6})"/i.exec(inner)?.[1] ?? /lastClr="([0-9a-f]{6})"/i.exec(inner)?.[1]
    if (value) scheme[slot] = `#${value.toUpperCase()}`
  }
  const accents = [1, 2, 3, 4, 5, 6].map((n) => scheme[`accent${n}`]).filter(Boolean)
  const font = (kind) => new RegExp(`<a:${kind}>[\\s\\S]*?<a:latin typeface="([^"]*)"`).exec(xml)?.[1] || null
  const uses = new Map()
  const slides = run('unzip', ['-p', file, 'ppt/slides/slide*.xml'])
  if (slides.ok) {
    for (const m of slides.stdout.matchAll(/<a:(srgbClr|schemeClr) val="([^"]+)"/g)) {
      const hex = m[1] === 'srgbClr'
        ? (/^[0-9a-f]{6}$/i.test(m[2]) ? `#${m[2].toUpperCase()}` : null)
        : scheme[SCHEME_ALIASES[m[2]] ?? m[2]] ?? null
      if (hex) uses.set(hex, (uses.get(hex) ?? 0) + 1)
    }
  }
  return {
    file: path.basename(file),
    scheme,
    accents,
    officeDefault: OFFICE_ACCENTS.has(accents.map((hex) => hex.slice(1)).join(' ')),
    fonts: { headings: font('majorFont'), body: font('minorFont') },
    slides: [...uses].sort((a, b) => b[1] - a[1]).slice(0, SLIDE_COLOURS),
  }
}

function themeLines({ file, scheme, accents, officeDefault, fonts, slides }) {
  const base = [['dark', scheme.dk1], ['light', scheme.lt1], ['dark 2', scheme.dk2], ['light 2', scheme.lt2]]
    .filter(([, hex]) => hex).map(([name, hex]) => `${name} ${hex}`).join(' · ')
  const lines = [`Theme of ${file}, as the file declares it:`]
  if (base) lines.push(`  theme colours  ${base}`)
  if (accents.length) lines.push(`  accents        ${accents.join(' · ')}${officeDefault ? ' (the default Office palette)' : ''}`)
  if (slides.length) lines.push(`  on the slides  ${slides.map(([hex, uses]) => `${hex} x${uses}`).join(' · ')}`)
  const type = fonts.headings && fonts.body && fonts.headings !== fonts.body
    ? `headings ${fonts.headings} · body ${fonts.body}`
    : fonts.headings || fonts.body
  if (type) lines.push(`  fonts          ${type}`)
  return lines
}

// ------------------------------------------------------------------ collecting: images

function collectFromImage(file, ctx) {
  const ext = path.extname(file).toLowerCase()
  const probe = ext === '.svg' ? null : probeImage(fs.readFileSync(file))
  if (probe && tooSmall(probe.width, probe.height, ctx.minSide)) {
    warn(`${path.basename(file)}: ${probe.width}x${probe.height} is below --min-side ${ctx.minSide}px — skipped`)
    return []
  }
  return [{
    file,
    mask: null,
    source: path.basename(file),
    page: null,
    alpha: probe?.alpha ?? false,
    width: probe?.width ?? 0,
    height: probe?.height ?? 0,
    name: slugify(file),
    // SVG is already web-ready and cannot be re-encoded — it travels as is.
    passthrough: ext === '.svg',
  }]
}

// ------------------------------------------------------------------ dedupe

// The same logo drawn on every page comes out of pdfimages once per page. Hash the
// extracted bytes (plus the mask, so a masked and an unmasked copy stay apart), keep the
// first occurrence and remember every page it showed up on.
function dedupe(candidates) {
  const seen = new Map()
  const kept = []
  for (const cand of candidates) {
    const hash = crypto.createHash('sha256')
    hash.update(fs.readFileSync(cand.file))
    if (cand.mask) hash.update(fs.readFileSync(cand.mask))
    const key = hash.digest('hex')
    const first = seen.get(key)
    if (first) {
      if (cand.page && !first.pages.includes(cand.page)) first.pages.push(cand.page)
      continue
    }
    cand.pages = cand.page ? [cand.page] : []
    seen.set(key, cand)
    kept.push(cand)
  }
  return kept
}

// ------------------------------------------------------------------ encoding

function assetExt(cand, ctx) {
  if (cand.passthrough) return path.extname(cand.file).toLowerCase()
  if (ctx.encoder.mode === 'raw') return path.extname(cand.file).toLowerCase() || '.png'
  if (ctx.encoder.webp) return '.webp'
  return cand.alpha ? '.png' : '.jpg'
}

function encodeOnce(cand, outPath, step, ctx) {
  const side = Math.max(64, Math.round(ctx.maxSide * step.scale))
  const args = [cand.file]
  if (cand.mask) args.push(cand.mask, '-compose', 'CopyOpacity', '-composite')
  args.push('-colorspace', 'sRGB', '-strip', '-resize', `${side}x${side}>`)
  if (!(cand.alpha && !ctx.encoder.webp)) args.push('-quality', String(step.quality))
  if (cand.alpha && ctx.encoder.webp) args.push('-define', 'webp:alpha-quality=100')
  args.push(outPath)
  const res = run(ctx.encoder.bin, args)
  return res.ok && fs.existsSync(outPath) && fs.statSync(outPath).size > 0
}

// Walk the ladder until the file fits both the hard per-file limit and what is left of the
// budget. Nothing fits — the asset is dropped with a warning, never silently truncated.
function emitAsset(cand, ctx) {
  const ext = assetExt(cand, ctx)
  const outName = uniqueName(cand.name, ext)
  const outPath = path.join(ctx.outDir, outName)
  const limit = Math.min(FILE_LIMIT_BYTES, ctx.budgetBytes - ctx.usedBytes)

  if (ctx.encoder.mode === 'raw' || cand.passthrough) {
    const size = fs.statSync(cand.file).size
    if (size > limit) {
      usedNames.delete(outName)
      warn(`${cand.source}: ${outName} is ${mb(size)} and cannot be re-encoded here — dropped`)
      return null
    }
    fs.copyFileSync(cand.file, outPath)
    const probe = probeImage(fs.readFileSync(outPath))
    return finishAsset(cand, outName, size, probe, ctx)
  }

  if (limit <= 0) {
    usedNames.delete(outName)
    warn(`${cand.source}: ${cand.name} does not fit the remaining budget (0 MB left) — dropped`)
    return null
  }

  let encoded = false
  for (const step of ENCODE_STEPS) {
    if (!encodeOnce(cand, outPath, step, ctx)) break
    encoded = true
    const size = fs.statSync(outPath).size
    if (size <= limit) {
      const probe = probeImage(fs.readFileSync(outPath))
      return finishAsset(cand, outName, size, probe, ctx)
    }
  }
  fs.rmSync(outPath, { force: true })
  usedNames.delete(outName)
  warn(encoded
    ? `${cand.source}: ${cand.name} does not fit the remaining budget (${mb(Math.max(0, limit))}) — dropped`
    : `${cand.source}: ${cand.name} could not be converted by ${ctx.encoder.bin} — dropped`)
  return null
}

function finishAsset(cand, outName, size, probe, ctx) {
  ctx.usedBytes += size
  // Key order follows the manifest contract: file, source, page(s), w, h, alpha, bytes.
  const record = { file: outName, source: cand.source }
  if (cand.pages.length === 1) record.page = cand.pages[0]
  else if (cand.pages.length > 1) record.pages = cand.pages.slice().sort((a, b) => a - b)
  record.w = probe?.width || cand.width || 0
  record.h = probe?.height || cand.height || 0
  record.alpha = probe?.alpha ?? cand.alpha
  record.bytes = size
  return record
}

function mb(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ------------------------------------------------------------------ main

function main() {
  const opts = parseCli(process.argv.slice(2))
  if (!opts.inputs.length) { usage(); die('nothing to ingest — pass at least one file') }

  const inputs = []
  for (const input of opts.inputs) {
    const full = path.resolve(input)
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) die(`no such file: ${input}`)
    inputs.push(full)
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'naimi-ingest-'))
  const outDir = path.resolve(opts.out)
  // Never delete what is already there (it may be curated by hand), but remember it: the
  // manifest describes THIS run, and a leftover file from an earlier one would look like
  // an asset the manifest forgot.
  const before = fs.existsSync(outDir)
    ? fs.readdirSync(outDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && entry.name !== 'manifest.json')
      .map((entry) => entry.name)
    : []
  fs.mkdirSync(outDir, { recursive: true })

  const ctx = {
    tmpDir,
    outDir,
    minSide: opts.minSide,
    maxSide: opts.maxSide,
    maxFiles: opts.maxFiles,
    range: opts.range,
    budgetBytes: Math.round(opts.budgetMb * 1024 * 1024),
    usedBytes: 0,
    encoder: resolveMagick(tmpDir),
  }
  if (ctx.encoder.mode === 'raw') {
    warn('ImageMagick is missing: soft masks are NOT merged (logos with transparency will look empty) '
      + 'and nothing is re-compressed. Install it — brew install imagemagick / apt-get install -y imagemagick.')
  } else if (!ctx.encoder.webp) {
    warn('ImageMagick has no webp delegate — writing png/jpeg instead (larger files, same pixels).')
  }

  const previews = []
  const themes = []
  let candidates = []
  try {
    for (const file of inputs) {
      const ext = path.extname(file).toLowerCase()
      if (ext === '.pdf') {
        candidates = candidates.concat(collectFromPdf(file, ctx))
        if (opts.pages) {
          const twin = previews.find((entry) => entry.slug === slugify(file))
          if (twin) {
            // Names that differ only by case or by the separator between words: one slug for
            // both, and the previews of one would replace the other's.
            warn(`${path.basename(file)}: its name reads the same as ${twin.file} — page previews skipped. `
              + 'Rename one of the two files, or ingest them one at a time.')
          } else {
            const rendered = renderPagePreviews(file, ctx)
            if (rendered) previews.push(rendered)
          }
        }
      } else if (ext === '.pptx' || ext === '.ppt' || ext === '.potx') {
        candidates = candidates.concat(collectFromPptx(file, ctx))
        const theme = ext === '.ppt' ? null : pptxTheme(file)
        if (theme) themes.push(theme)
      } else if (READY_IMAGE_EXT.has(ext) || ext === '.svg') {
        candidates = candidates.concat(collectFromImage(file, ctx))
      } else {
        warn(`${path.basename(file)}: unsupported type ${ext || '(none)'} — skipped`)
      }
    }

    const unique = dedupe(candidates)
    const assets = []
    let overflow = 0
    for (const cand of unique) {
      if (assets.length >= ctx.maxFiles) { overflow += 1; continue }
      const record = emitAsset(cand, ctx)
      if (record) assets.push(record)
    }
    if (overflow > 0) {
      warn(`--max-files ${ctx.maxFiles} reached: ${overflow} more image(s) left behind. `
        + 'Raise --max-files or ingest the pages you need one at a time.')
    }

    const stale = before.filter((entry) => !usedNames.has(entry))
    if (stale.length) {
      warn(`${opts.out}/ already held ${stale.length} file(s) from an earlier run `
        + `(${stale.slice(0, 3).join(', ')}${stale.length > 3 ? ', …' : ''}) — manifest.json lists only this run.`)
    }

    fs.writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(assets, null, 2)}\n`)
    report(assets, { outDir: opts.out, previews, themes, sources: inputs.length, ctx, guide: opts.guide })
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

// One line per PDF whose pages were rendered: which pages of how many, and how to get the rest.
function previewLines(previews, outDir) {
  return previews.map(({ file, first, last, count, total }) => {
    const span = first === last ? `page ${first}` : `pages ${first}-${last}`
    const rest = total && last < total ? ` — the rest on request: --pages ${last + 1}-${Math.min(total, last + PAGE_PREVIEW_LIMIT)}` : ''
    return `Page previews of ${file}: ${outDir}/pages/*.jpg (${count} page(s) at ${PAGE_PREVIEW_DPI} dpi, ${span}${total ? ` of ${total}` : ''}${rest}).`
  })
}

// ------------------------------------------------------------------ report
//
// Short on purpose: the reader is often a model, and every line of it rides along in each of its
// later requests. The theme a PPTX declares first, then one line per image — facts only: file,
// size, alpha, pages (as ranges, no column padding: a logo on 120 pages used to widen every row
// to its page list) — then where things are. The next steps only for a person or an agent working on its
// own; a caller with directions of its own passes --no-guide.

// Pages as ranges: 1-3, 7, 9-12; a long scatter keeps its first runs and the count.
function pageSpan(pages) {
  const runs = pageRanges([...pages].sort((a, b) => a - b)).map(([first, last]) => (first === last ? `${first}` : `${first}-${last}`))
  return runs.length > 4 ? `${runs.slice(0, 3).join(', ')}, … (${pages.length} pages)` : runs.join(', ')
}

function assetLine(asset) {
  const size = `${asset.w}x${asset.h}${asset.alpha ? ' alpha' : ''}`
  const where = asset.pages ? `p.${pageSpan(asset.pages)}` : asset.page ? `p.${asset.page}` : null
  return `  ${[asset.file, size, where, mb(asset.bytes)].filter(Boolean).join('  ')}`
}

function report(assets, { outDir, previews, themes, sources, ctx, guide }) {
  console.log('')
  for (const theme of themes) for (const line of themeLines(theme)) console.log(line)
  if (themes.length) console.log('')
  if (!assets.length) {
    console.log(`No images extracted from ${sources} source file(s)${ctx.range ? ` (pages ${ctx.range.first}-${ctx.range.last})` : ''}.`)
    if (guide) {
      console.log('Rebuild the layout in HTML/CSS and ask the user for photos or logos as separate files.')
      for (const line of previewLines(previews, outDir)) console.log(line)
    }
    if (warnings.length) console.log(`\n${warnings.length} warning(s) above — read them before you continue.`)
    return
  }
  console.log(`Extracted ${assets.length} image(s) from ${sources} source file(s) into ${outDir}/ — ${mb(ctx.usedBytes)} total:`)
  for (const asset of assets) console.log(assetLine(asset))
  console.log('')
  if (guide && previews.length) {
    for (const line of previewLines(previews, outDir)) console.log(line)
    console.log('Read them to see where each image sits and what it means before you place it.')
  }
  console.log(`Manifest: ${outDir}/manifest.json (file, source, page, size, alpha).`)
  if (guide) {
    const steps = [
      'Pick what the deck actually needs — portraits, product photos, logos.',
      `Copy them into assets/ with meaningful names (cp/mv only, never edit image bytes):\n     cp ${outDir}/<file> assets/team-cto.webp`,
      'Reference them relatively: <img src="assets/team-cto.webp" alt="...">\n     No absolute URLs and no CDN — the bundle is served under a strict CSP.',
      'Keep the bundle under 40 MB unpacked and 5 MB per file.',
    ]
    console.log('')
    console.log('Next steps:')
    steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`))
    console.log('Charts, diagrams and decorative shapes are not here on purpose: rebuild those in HTML/CSS.')
  }
  if (warnings.length) console.log(`\n${warnings.length} warning(s) above — read them before you continue.`)
}

main()
