#!/usr/bin/env node
// tools/art-generate.mjs — make a NEW plate in the style of an art pack (art/<id>) with an
// image model, from the pack's own recipe (`pack.json → generate`): the prompt base with
// `{subject}`, the pack's plates attached as style references, the flat background to ask
// for when the picture must be cut out, and the roster ratio for the chosen role.
//
// Why a tool and not a prompt: the recipe is what keeps a client's own subject — their
// warehouse, their product — inside the chosen direction instead of "just a picture". The
// same recipe produced the packs themselves, so a generated plate sits next to them as a
// sibling, not a stranger.
//
//   node tools/art-generate.mjs --pack <id|dir> --subject "<what to depict>"
//        [--role spot|plate|hero|band|paper|figure]   (default spot: a cut-out object)
//        [--out <file.webp>] [--name <basename>] [--holes] [--no-cutout] [--dry] [--json]
//
// Where the model comes from (first match wins):
//   NAIMI_IMAGE_URL + NAIMI_IMAGE_TOKEN   a relay that generates and meters (the studio sandbox)
//   GEMINI_API_KEY | GOOGLE_API_KEY       Google AI API directly
//   GOOGLE_CLOUD_PROJECT                  Vertex AI: GOOGLE_CLOUD_LOCATION (default global),
//                                         bearer from GOOGLE_ACCESS_TOKEN or the metadata server
//   NAIMI_IMAGE_MODEL                     model id (default gemini-3.1-flash-image — Nano Banana 2;
//                                         gemini-3-pro-image, gemini-3.1-flash-lite-image and the
//                                         older gemini-2.5-flash-image work too)
//
// Output: WebP at the roster size (≈1400 px long side, q82); a spot/figure goes through
// tools/art-cutout.mjs (chroma key → transparent WebP). Without ImageMagick the raw PNG is
// kept next to the requested path and named in the output. Zero dependencies.
// Exit 1 = bad input or the model returned no image; exit 2 = no backend configured;
// exit 3 = the backend refused (credits, quota, disabled) — the message says what to do.

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-image'
export const ROLES = Object.freeze({
  hero: { ratio: '16:9', keyed: false, hint: 'Wide composition for a 16:9 presentation cover; keep the upper-left third quiet, with no objects, so a headline can sit on it.' },
  plate: { ratio: '4:3', keyed: false, hint: 'A 4:3 plate that sits beside text; keep one third of the frame quiet.' },
  band: { ratio: '21:9', keyed: false, hint: 'A panoramic 21:9 strip: one even horizontal row across the frame, nothing else, nothing stacked.' },
  paper: { ratio: '16:9', keyed: false, hint: 'A blank surface texture only, filling the frame edge to edge: no objects, no marks, no vignette, no corners of a sheet.' },
  spot: { ratio: '1:1', keyed: true, hint: 'A single object, seen whole, filling most of a square frame.' },
  figure: { ratio: '3:4', keyed: true, hint: 'A single figure, seen whole, in a 3:4 portrait frame; natural anatomy, no face shown.' },
})
const KEY_COLORS = Object.freeze({ white: '#FFFFFF', green: '#00FF00', magenta: '#FF00FF' })
const MAX_SIDE = 1400
const WEBP_QUALITY = 82
const REQUEST_TIMEOUT_MS = 120_000

const HERE = path.dirname(fileURLToPath(import.meta.url))

function die(message, code = 1) {
  console.error(`art-generate: ${message}`)
  process.exit(code)
}

function usage() {
  console.log(`Generate a new plate in the style of an art pack.

  node tools/art-generate.mjs --pack <id|dir> --subject "<what to depict>" [options]

  --role <role>      hero | plate | band | paper | spot | figure   (default spot — a cut-out object)
  --out <file>       output file (default assets/art/plates/<name>.webp under the current folder)
  --name <basename>  file name without extension (default: made from the subject)
  --holes            spot/figure: also clear enclosed pockets of the key color (ink drawings on white)
  --no-cutout        spot/figure: keep the flat background, skip the keying
  --dry              print the prompt and the request plan, call nothing
  --json             print the result as one JSON line (for scripts)

The subject is what the picture shows — "a delivery van", "a warehouse with tall shelving",
"a coffee cup" — not the style: the pack's recipe supplies the technique, palette and finish.`)
}

export function parseArgs(argv) {
  const options = { pack: null, subject: null, role: 'spot', out: null, name: null, holes: false, cutout: true, dry: false, json: false, artDir: null }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = () => {
      const value = argv[i + 1]
      if (value === undefined) throw new Error(`${arg} needs a value`)
      i += 1
      return value
    }
    if (arg === '--help' || arg === '-h') { usage(); process.exit(0) }
    else if (arg === '--pack') options.pack = next()
    else if (arg === '--subject') options.subject = next()
    else if (arg === '--role') options.role = next()
    else if (arg === '--out') options.out = next()
    else if (arg === '--name') options.name = next()
    else if (arg === '--art-dir') options.artDir = next()
    else if (arg === '--holes') options.holes = true
    else if (arg === '--no-cutout') options.cutout = false
    else if (arg === '--dry') options.dry = true
    else if (arg === '--json') options.json = true
    else throw new Error(`unknown option ${arg}`)
  }
  if (!options.pack) throw new Error('--pack <id|dir> is required')
  if (!options.subject || !options.subject.trim()) throw new Error('--subject "<what to depict>" is required')
  if (!ROLES[options.role]) throw new Error(`--role must be one of ${Object.keys(ROLES).join(', ')}`)
  return options
}

/** A file name from the subject: "a delivery van" → "delivery-van". */
export function slugOf(subject) {
  const slug = String(subject).toLowerCase()
    .replace(/^(an?|the)\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
  return slug || 'plate'
}

/** The pack folder: an existing directory, or `<artDir>/<id>` where artDir defaults to the kit's art/. */
export function resolvePackDir(pack, { artDir = null, env = process.env } = {}) {
  if (fs.existsSync(path.join(pack, 'pack.json'))) return path.resolve(pack)
  const root = artDir ?? env.NAIMI_ART_DIR ?? path.join(HERE, '..', 'art')
  const dir = path.join(root, pack)
  if (!fs.existsSync(path.join(dir, 'pack.json'))) {
    throw new Error(`no art pack "${pack}" (looked for ${path.join(dir, 'pack.json')}) — pass a pack id from art/README.md or a pack folder`)
  }
  return dir
}

/**
 * The prompt for one plate. Keyed roles (spot, figure) use the pack's own template for
 * that role (`generate.spot` / `generate.figure`, with `{subject}`) — the same wording that
 * produced the pack's spots, so a cyanotype spot is "a print pasted as an object" and a
 * sticker is "a die-cut sticker", not "a photogram on white". Other roles use the base with
 * `{subject}` plus the role's composition hint. Then the isolation sentence for keyed roles
 * (that flat background is what the cut-out keys on) and the pack's rules last. The order
 * matters: models weigh the head of the prompt most, and the technique must win over the
 * subject, not the other way round.
 */
export function buildPrompt({ pack, subject, role }) {
  const recipe = pack.generate ?? {}
  const spec = ROLES[role]
  if (!spec) throw new Error(`unknown role ${role}`)
  const what = subject.trim()
  const fill = (template) => String(template).replaceAll('{subject}', what).trim()
  const parts = []
  const template = spec.keyed ? (recipe[role] ?? recipe.spot) : null
  if (template && String(template).includes('{subject}')) {
    parts.push(fill(template))
  } else if (String(recipe.base ?? '').includes('{subject}')) {
    parts.push(fill(recipe.base), spec.hint)
  } else {
    parts.push(`${String(recipe.base ?? pack.technique ?? '').trim()} The subject: ${what}.`, spec.hint)
  }
  const keyName = keyColorOf(pack)
  if (spec.keyed) {
    parts.push(
      `The subject is isolated and centered on a perfectly flat, uniform, pure ${keyName} (${KEY_COLORS[keyName]}) background that fills the entire frame edge to edge; nothing else in the frame, no floor, no cast shadow, no texture and no gradient on the background.`,
    )
  }
  if (recipe.rules) parts.push(String(recipe.rules).trim())
  return parts.join(' ')
}

/** The flat background a keyed plate is asked for: the pack's `spotBackground`, white otherwise. */
export function keyColorOf(pack) {
  const name = String(pack.generate?.spotBackground ?? 'white').toLowerCase()
  return KEY_COLORS[name] ? name : 'white'
}

/** Reference plates as inline images — the pack's `generate.references`, read from pack/plates/. */
export function loadReferences(packDir, pack) {
  const files = Array.isArray(pack.generate?.references) ? pack.generate.references : []
  const references = []
  for (const file of files) {
    const full = path.join(packDir, 'pack', 'plates', String(file))
    if (!fs.existsSync(full)) continue
    references.push({ mimeType: mimeOf(full), data: fs.readFileSync(full).toString('base64'), file: String(file) })
  }
  return references
}

const mimeOf = (file) => ({ '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' })[path.extname(file).toLowerCase()] ?? 'application/octet-stream'

/**
 * The Gemini `generateContent` body. Shared shape with the studio relay
 * (server/cloud/studio/image-gen.mjs builds the same request on its side): references first,
 * one text part naming them as style references, then the prompt; image-only output at the
 * roster ratio.
 */
export function buildGenerateBody({ prompt, references = [], aspectRatio }) {
  const parts = []
  if (references.length > 0) {
    parts.push({ text: 'Style references — match their technique, palette, finish and paper exactly; do not copy their subjects:' })
    for (const reference of references) parts.push({ inlineData: { mimeType: reference.mimeType, data: reference.data } })
  }
  parts.push({ text: prompt })
  return {
    contents: [{ role: 'user', parts }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio } },
  }
}

/**
 * What came back: the first image part, the token usage, or the reason there is no image
 * (safety block, an empty candidate). Same parser on the relay side.
 */
export function parseGenerateResponse(json) {
  const usageMeta = json?.usageMetadata ?? {}
  const usage = {
    inputTokens: Number(usageMeta.promptTokenCount) || 0,
    outputTokens: Number(usageMeta.candidatesTokenCount) || 0,
  }
  const candidate = Array.isArray(json?.candidates) ? json.candidates[0] : null
  const parts = candidate?.content?.parts ?? []
  const imagePart = parts.find((part) => part?.inlineData?.data && String(part.inlineData.mimeType ?? '').startsWith('image/'))
  if (imagePart) return { image: { mimeType: imagePart.inlineData.mimeType, data: imagePart.inlineData.data }, usage, blocked: null }
  const reason = json?.promptFeedback?.blockReason
    ?? candidate?.finishReason
    ?? (parts.find((part) => part?.text)?.text ? 'text_only' : 'empty')
  return { image: null, usage, blocked: String(reason) }
}

/** Which backend the environment offers. `null` = nothing configured (exit 2 with a hint). */
export function resolveBackend(env = process.env) {
  const model = String(env.NAIMI_IMAGE_MODEL ?? '').trim() || DEFAULT_IMAGE_MODEL
  if (env.NAIMI_IMAGE_URL && env.NAIMI_IMAGE_TOKEN) return { kind: 'relay', url: env.NAIMI_IMAGE_URL, token: env.NAIMI_IMAGE_TOKEN, model: null }
  const apiKey = String(env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY ?? '').trim()
  if (apiKey) return { kind: 'api-key', apiKey, model }
  const project = String(env.GOOGLE_CLOUD_PROJECT ?? '').trim()
  if (project) {
    const location = String(env.GOOGLE_CLOUD_LOCATION ?? 'global').trim() || 'global'
    return { kind: 'vertex', project, location, model, accessToken: String(env.GOOGLE_ACCESS_TOKEN ?? '').trim() || null, metadataHost: env.GCE_METADATA_HOST || 'metadata.google.internal' }
  }
  return null
}

/** Endpoint of a direct backend (api-key or vertex). */
export function endpointOf(backend) {
  if (backend.kind === 'api-key') {
    return { url: `https://generativelanguage.googleapis.com/v1beta/models/${backend.model}:generateContent`, headers: { 'x-goog-api-key': backend.apiKey } }
  }
  if (backend.kind === 'vertex') {
    const host = backend.location === 'global' ? 'aiplatform.googleapis.com' : `${backend.location}-aiplatform.googleapis.com`
    return {
      url: `https://${host}/v1/projects/${backend.project}/locations/${backend.location}/publishers/google/models/${backend.model}:generateContent`,
      headers: {},
    }
  }
  throw new Error(`no endpoint for backend ${backend.kind}`)
}

async function metadataAccessToken(host) {
  const res = await fetch(`http://${host}/computeMetadata/v1/instance/service-accounts/default/token`, { headers: { 'Metadata-Flavor': 'Google' } })
  if (!res.ok) throw new Error(`metadata server refused a token (${res.status}) — set GOOGLE_ACCESS_TOKEN or GEMINI_API_KEY`)
  const json = await res.json()
  if (!json?.access_token) throw new Error('metadata server returned no access_token')
  return json.access_token
}

class BackendRefusal extends Error {
  constructor(message, { code = null, status = null } = {}) {
    super(message)
    this.code = code
    this.status = status
  }
}

async function postJson(url, { headers = {}, body }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const text = await res.text()
    let json = null
    try { json = JSON.parse(text) } catch { json = null }
    return { status: res.status, ok: res.ok, json, text }
  } finally {
    clearTimeout(timer)
  }
}

/** One generation through whichever backend is configured → { image, usage, blocked, model, remaining }. */
export async function generate({ backend, prompt, references, aspectRatio, meta = {} }) {
  if (backend.kind === 'relay') {
    const res = await postJson(backend.url, {
      headers: { authorization: `Bearer ${backend.token}` },
      body: { prompt, references: references.map(({ mimeType, data }) => ({ mimeType, data })), aspectRatio, meta },
    })
    if (res.status === 422 && res.json?.code === 'image_blocked') {
      return { image: null, usage: res.json.usage ?? { inputTokens: 0, outputTokens: 0 }, blocked: res.json.reason ?? 'blocked', model: res.json.usage?.model ?? null, remaining: res.json.remaining ?? null }
    }
    if (!res.ok) {
      const message = res.json?.error ?? res.text.slice(0, 300) ?? `HTTP ${res.status}`
      throw new BackendRefusal(message, { code: res.json?.code ?? null, status: res.status })
    }
    return { image: res.json.image, usage: res.json.usage ?? {}, blocked: null, model: res.json.usage?.model ?? null, remaining: res.json.remaining ?? null }
  }
  const endpoint = endpointOf(backend)
  const headers = { ...endpoint.headers }
  if (backend.kind === 'vertex') {
    const token = backend.accessToken ?? await metadataAccessToken(backend.metadataHost)
    headers.authorization = `Bearer ${token}`
  }
  const res = await postJson(endpoint.url, { headers, body: buildGenerateBody({ prompt, references, aspectRatio }) })
  if (!res.ok) {
    const message = res.json?.error?.message ?? res.text.slice(0, 300) ?? `HTTP ${res.status}`
    throw new BackendRefusal(`${backend.kind} ${backend.model} refused (${res.status}): ${message}`, { status: res.status })
  }
  return { ...parseGenerateResponse(res.json), model: backend.model, remaining: null }
}

// ── post-processing: cut-out / WebP ─────────────────────────────────────────
const MAGICK_BIN = ['magick', 'convert'].find((bin) => spawnSync(bin, ['-version'], { encoding: 'utf8' }).status === 0) ?? null

function toWebp(rawFile, out) {
  const result = spawnSync(MAGICK_BIN, [rawFile, '-resize', `${MAX_SIDE}x${MAX_SIDE}>`, '-strip', '-define', 'webp:method=6', '-quality', String(WEBP_QUALITY), out], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`${MAGICK_BIN} failed: ${(result.stderr || '').trim()}`)
}

function cutout(rawFile, out, { key, holes }) {
  const args = [path.join(HERE, 'art-cutout.mjs'), rawFile, '--key', key, '--out', out, '--max-side', String(MAX_SIDE)]
  if (holes) args.push('--holes')
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`art-cutout failed: ${(result.stderr || result.stdout || '').trim()}`)
}

const extOf = (mimeType) => ({ 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' })[mimeType] ?? '.png'

async function main() {
  let options
  try {
    options = parseArgs(process.argv.slice(2))
  } catch (error) {
    console.error(`art-generate: ${error.message}`)
    usage()
    process.exit(1)
  }
  const packDir = resolvePackDir(options.pack, { artDir: options.artDir })
  const pack = JSON.parse(fs.readFileSync(path.join(packDir, 'pack.json'), 'utf8'))
  const role = ROLES[options.role]
  const prompt = buildPrompt({ pack, subject: options.subject, role: options.role })
  const references = loadReferences(packDir, pack)
  const name = options.name ?? slugOf(options.subject)
  const out = path.resolve(options.out ?? path.join('assets', 'art', 'plates', `${name}.webp`))
  const keyed = role.keyed && options.cutout
  const key = keyColorOf(pack)

  if (options.dry) {
    const plan = { pack: pack.id, role: options.role, aspectRatio: role.ratio, keyed, key: keyed ? key : null, references: references.map((r) => r.file), out, backend: resolveBackend()?.kind ?? null, prompt }
    console.log(options.json ? JSON.stringify(plan) : `${JSON.stringify({ ...plan, prompt: undefined }, null, 2)}\n\nPrompt:\n${prompt}`)
    return
  }

  const backend = resolveBackend()
  if (!backend) {
    die('no image backend: set GEMINI_API_KEY (Google AI), or GOOGLE_CLOUD_PROJECT for Vertex AI, or run inside the studio sandbox.', 2)
  }

  const startedAt = Date.now()
  let result
  try {
    result = await generate({ backend, prompt, references, aspectRatio: role.ratio, meta: { pack: pack.id, role: options.role, subject: options.subject } })
  } catch (error) {
    if (error instanceof BackendRefusal) die(`${error.message}${error.code ? ` [${error.code}]` : ''}`, 3)
    die(error.name === 'AbortError' ? `the model did not answer within ${REQUEST_TIMEOUT_MS / 1000}s — try again` : error.message)
  }
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
  const spent = result.usage?.outputTokens || result.usage?.inputTokens
    ? ` · tokens in ${result.usage.inputTokens ?? 0} / out ${result.usage.outputTokens ?? 0}`
    : ''
  if (!result.image) {
    die(`the model returned no image (${result.blocked}) after ${seconds}s${spent}. Rephrase the subject: name a concrete object, no people or faces, no brands.`)
  }

  fs.mkdirSync(path.dirname(out), { recursive: true })
  const raw = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'art-generate-')), `raw${extOf(result.image.mimeType)}`)
  fs.writeFileSync(raw, Buffer.from(result.image.data, 'base64'))

  let written = out
  let note = ''
  if (!MAGICK_BIN) {
    written = out.replace(/\.webp$/i, '') + extOf(result.image.mimeType)
    fs.copyFileSync(raw, written)
    note = keyed
      ? ' (ImageMagick is missing: kept the flat background and the raw format — key it out where the tool exists)'
      : ' (ImageMagick is missing: kept the raw format)'
  } else if (keyed) {
    cutout(raw, out, { key, holes: options.holes })
  } else {
    toWebp(raw, out)
  }
  fs.rmSync(path.dirname(raw), { recursive: true, force: true })

  const size = fs.statSync(written).size
  const rel = path.relative(process.cwd(), written)
  const summary = {
    file: rel, role: options.role, pack: pack.id, keyed: keyed && Boolean(MAGICK_BIN), bytes: size,
    model: result.model, usage: result.usage, remaining: result.remaining, seconds: Number(seconds),
  }
  if (options.json) {
    console.log(JSON.stringify(summary))
    return
  }
  console.log(`✓ ${rel}  ${(size / 1024).toFixed(0)} KB  (${pack.id} · ${options.role}${keyed && MAGICK_BIN ? ' · cut out' : ''}) in ${seconds}s${spent}${note}`)
  if (result.remaining !== null && result.remaining !== undefined) console.log(`  Images left in this session: ${result.remaining}.`)
  console.log(`  Look at it before using it (read the file). If the subject or the finish is off, generate once more`)
  console.log('  with a more concrete subject — not a third time; two misses mean the pack cannot draw it.')
}

// Run only when invoked directly: tests import the pure helpers. realpath — the studio
// image calls this file through a symlinked `naimi` wrapper.
const invokedAs = process.argv[1] ? fs.realpathSync(path.resolve(process.argv[1])) : ''
if (invokedAs === fileURLToPath(import.meta.url)) {
  main().catch((error) => die(error.message))
}
