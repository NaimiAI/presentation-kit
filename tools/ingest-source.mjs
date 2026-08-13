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
// Zero dependencies: plain Node plus command line tools from poppler and ImageMagick.
// Nothing is installed at runtime.
//
//   node tools/ingest-source.mjs <file...> [--out assets-src] [--min-side 200]
//        [--max-side 1920] [--budget-mb 35] [--max-files 60] [--no-pages]
//
// Output: <out>/*.webp, <out>/pages/*.jpg (page previews) and <out>/manifest.json with one
// record per asset. Warnings go to stdout next to the summary — one stream, one story.
// Hard failures go to stderr: exit 2 = a required tool is missing, exit 1 = bad input.

import { spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// Platform limits the output has to live inside (bundle rules): 5 MB per file, 40 MB
// unpacked. The default budget leaves room for the deck itself on top of the assets.
const FILE_LIMIT_BYTES = 5 * 1024 * 1024
const DEFAULTS = { out: 'assets-src', minSide: 200, maxSide: 1920, budgetMb: 35, maxFiles: 60, pages: true }
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
`)
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
    if (arg === '--out') { opts.out = argv[++i] ?? die('--out needs a directory'); continue }
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

function slugify(name, max = 28) {
  const base = path.basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (base.length <= max) return base || 'source'
  // Cut on a word boundary when one is close enough — half-words read like typos.
  const cut = base.slice(0, max)
  const lastDash = cut.lastIndexOf('-')
  const trimmed = base[max] === '-' || lastDash < 8 ? cut : cut.slice(0, lastDash)
  return trimmed.replace(/-+$/, '') || 'source'
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
      object: f[10] === '[inline]' ? `inline-${f[1]}` : f[10],
    })
  }
  return rows
}

function collectFromPdf(file, ctx) {
  if (!hasBinary('pdfimages')) missingTool('pdfimages', 'it comes with poppler')
  const listed = run('pdfimages', ['-list', file])
  if (!listed.ok) {
    warn(`${path.basename(file)}: pdfimages could not read it (${listed.stderr.trim() || 'unknown error'}) — skipped`)
    return []
  }
  const rows = parseImageList(listed.stdout)
  if (!rows.length) {
    warn(`${path.basename(file)}: no raster images inside (charts and shapes are vector — rebuild them in HTML/CSS)`)
    return []
  }

  // Masks are listed right after the image they belong to and share its object id.
  const images = []
  for (const row of rows) {
    if (row.type === 'image') { images.push(row); continue }
    if (row.type !== 'smask' && row.type !== 'mask') continue
    const owner = images.filter((img) => img.object === row.object).pop()
    if (owner) owner.maskNum = row.num
  }

  const dir = fs.mkdtempSync(path.join(ctx.tmpDir, 'pdf-'))
  const extracted = run('pdfimages', ['-png', '-p', file, path.join(dir, 'img')])
  if (extracted.missing) missingTool('pdfimages', 'it comes with poppler')
  if (!extracted.ok && !fs.readdirSync(dir).length) {
    warn(`${path.basename(file)}: pdfimages failed to extract (${extracted.stderr.trim() || 'unknown error'}) — skipped`)
    return []
  }

  // Files come out as <root>-<page>-<num>.png; the num column is the reliable key
  // (page padding widens on documents with more than 999 pages).
  const files = new Map()
  for (const entry of fs.readdirSync(dir)) {
    const m = /^img-\d+-(\d+)\.[a-z]+$/.exec(entry)
    if (m) files.set(Number(m[1]), path.join(dir, entry))
  }

  const slug = slugify(file)
  const candidates = []
  let tooSmall = 0
  for (const row of images) {
    const body = files.get(row.num)
    if (!body) continue
    if (Math.min(row.width, row.height) < ctx.minSide) { tooSmall += 1; continue }
    candidates.push({
      file: body,
      mask: row.maskNum !== undefined ? files.get(row.maskNum) ?? null : null,
      source: path.basename(file),
      page: row.page,
      alpha: row.maskNum !== undefined,
      width: row.width,
      height: row.height,
      name: `${slug}-p${String(row.page).padStart(2, '0')}-${String(row.num).padStart(2, '0')}`,
    })
  }
  if (tooSmall > 0) {
    warn(`${path.basename(file)}: ${tooSmall} image(s) smaller than ${ctx.minSide}px dropped — spacers, bullets, `
      + 'icons and low-res partner logos. Need them anyway? Re-run with a lower --min-side.')
  }
  return candidates
}

function renderPagePreviews(file, ctx) {
  if (!hasBinary('pdftoppm')) missingTool('pdftoppm', 'it comes with poppler')
  const dir = path.join(ctx.outDir, 'pages')
  fs.mkdirSync(dir, { recursive: true })
  const root = path.join(dir, slugify(file))
  const res = run('pdftoppm', ['-r', String(PAGE_PREVIEW_DPI), '-jpeg', '-l', String(PAGE_PREVIEW_LIMIT), file, root])
  if (!res.ok) {
    warn(`${path.basename(file)}: page previews failed (${res.stderr.trim() || 'unknown error'})`)
    return 0
  }
  const prefix = path.basename(root)
  return fs.readdirSync(dir).filter((entry) => entry.startsWith(`${prefix}-`) && entry.endsWith('.jpg')).length
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
    if (probe && Math.min(probe.width, probe.height) < ctx.minSide) { dropped += 1; continue }
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
    warn(`${path.basename(file)}: ${dropped} media file(s) smaller than ${ctx.minSide}px dropped — `
      + 're-run with a lower --min-side if you need them.')
  }
  return candidates
}

// ------------------------------------------------------------------ collecting: images

function collectFromImage(file, ctx) {
  const ext = path.extname(file).toLowerCase()
  const probe = ext === '.svg' ? null : probeImage(fs.readFileSync(file))
  if (probe && Math.min(probe.width, probe.height) < ctx.minSide) {
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
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`
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
    ? fs.readdirSync(outDir).filter((entry) => entry !== 'manifest.json' && entry !== 'pages')
    : []
  fs.mkdirSync(outDir, { recursive: true })

  const ctx = {
    tmpDir,
    outDir,
    minSide: opts.minSide,
    maxSide: opts.maxSide,
    maxFiles: opts.maxFiles,
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

  let pageCount = 0
  let candidates = []
  try {
    for (const file of inputs) {
      const ext = path.extname(file).toLowerCase()
      if (ext === '.pdf') {
        candidates = candidates.concat(collectFromPdf(file, ctx))
        if (opts.pages) pageCount += renderPagePreviews(file, ctx)
      } else if (ext === '.pptx' || ext === '.ppt' || ext === '.potx') {
        candidates = candidates.concat(collectFromPptx(file, ctx))
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
    report(assets, { outDir: opts.out, pageCount, sources: inputs.length, ctx })
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

function report(assets, { outDir, pageCount, sources, ctx }) {
  console.log('')
  if (!assets.length) {
    console.log(`No images extracted from ${sources} source file(s).`)
    console.log('Rebuild the layout in HTML/CSS and ask the user for photos or logos as separate files.')
    return
  }
  console.log(`Extracted ${assets.length} image(s) from ${sources} source file(s) into ${outDir}/ — ${mb(ctx.usedBytes)} total.`)
  console.log('')
  const rows = assets.map((a) => [
    a.file,
    a.pages ? `p.${a.pages.join(',')}` : a.page ? `p.${a.page}` : '-',
    `${a.w}x${a.h}${a.alpha ? ' alpha' : ''}`,
    mb(a.bytes),
  ])
  const widths = [0, 1, 2, 3].map((i) => Math.max(...rows.map((r) => r[i].length)))
  for (const row of rows) {
    console.log(`  ${row.map((cell, i) => cell.padEnd(widths[i])).join('  ')}`)
  }
  console.log('')
  if (pageCount) {
    console.log(`Page previews: ${outDir}/pages/*.jpg (${pageCount} page(s) at ${PAGE_PREVIEW_DPI} dpi).`)
    console.log('Read them to see where each image sits and what it means before you place it.')
  }
  console.log(`Manifest: ${outDir}/manifest.json (file, source, page, size, alpha).`)
  console.log('')
  console.log('Next steps:')
  console.log('  1. Pick what the deck actually needs — portraits, product photos, logos.')
  console.log('  2. Copy them into assets/ with meaningful names (cp/mv only, never edit image bytes):')
  console.log(`     cp ${outDir}/<file> assets/team-cto.webp`)
  console.log('  3. Reference them relatively: <img src="assets/team-cto.webp" alt="...">')
  console.log('     No absolute URLs and no CDN — the bundle is served under a strict CSP.')
  console.log('  4. Keep the bundle under 40 MB unpacked and 5 MB per file.')
  console.log('Charts, diagrams and decorative shapes are not here on purpose: rebuild those in HTML/CSS.')
  if (warnings.length) console.log(`\n${warnings.length} warning(s) above — read them before you continue.`)
}

main()
