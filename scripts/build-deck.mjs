#!/usr/bin/env node
// Build a ported deck (presentation-kit/decks/<id>) into an uploadable ZIP by
// overlaying it onto the kit template and running `npm run package`.
//
//   node scripts/build-deck.mjs <deck-id> [outDir]
//   node scripts/build-deck.mjs --all   [outDir]
//
// The deck is a drop-in (slides/ + manifest.json + mock.json [+ assets/]); the
// runtime lives only in template/ and is never duplicated per deck.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATE_DIR = path.join(KIT_ROOT, 'template')
const DECKS_DIR = path.join(KIT_ROOT, 'decks')
const SKIP_COPY = new Set(['node_modules', 'dist'])

async function exists(p) {
  try { await fs.access(p); return true } catch { return false }
}

async function copyTemplate(destDir) {
  await fs.mkdir(destDir, { recursive: true })
  for (const entry of await fs.readdir(TEMPLATE_DIR, { withFileTypes: true })) {
    if (SKIP_COPY.has(entry.name)) continue
    await fs.cp(path.join(TEMPLATE_DIR, entry.name), path.join(destDir, entry.name), { recursive: true })
  }
  // Reuse the template's installed dependencies instead of npm ci per build.
  const templateModules = path.join(TEMPLATE_DIR, 'node_modules')
  if (!(await exists(templateModules))) {
    throw new Error(`template/node_modules missing — run "npm install" in ${TEMPLATE_DIR} first`)
  }
  await fs.symlink(templateModules, path.join(destDir, 'node_modules'), 'dir')
}

async function overlayDeck(deckId, destDir) {
  const deckDir = path.join(DECKS_DIR, deckId)
  if (!(await exists(deckDir))) throw new Error(`deck not found: ${deckDir}`)

  // slides
  const slidesDest = path.join(destDir, 'src/slides')
  await fs.rm(slidesDest, { recursive: true, force: true })
  await fs.cp(path.join(deckDir, 'slides'), slidesDest, { recursive: true })

  // manifest + mock
  await fs.copyFile(path.join(deckDir, 'manifest.json'), path.join(destDir, 'public/manifest.json'))
  await fs.copyFile(path.join(deckDir, 'mock.json'), path.join(destDir, 'mock/state.json'))

  // Deck cover: manifest.preview points at a file inside the bundle, so copy
  // preview.webp into public/ — otherwise the validator warns and the template
  // card is left without a cover.
  const previewFile = path.join(deckDir, 'preview.webp')
  if (await exists(previewFile)) {
    await fs.copyFile(previewFile, path.join(destDir, 'public/preview.webp'))
  }

  // assets (merge into template src/assets, which already ships fonts/)
  const assetsDir = path.join(deckDir, 'assets')
  if (await exists(assetsDir)) {
    await fs.cp(assetsDir, path.join(destDir, 'src/assets'), { recursive: true })
  }
}

async function buildOne(deckId, outDir) {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), `naimi-deck-${deckId}-`))
  try {
    await copyTemplate(workDir)
    await overlayDeck(deckId, workDir)

    const result = spawnSync('npm', ['run', 'package'], { cwd: workDir, stdio: 'inherit' })
    if (result.status !== 0) throw new Error(`package failed for ${deckId}`)

    // package.mjs names the zip after manifest.id; emit it as <deckId>.zip.
    const manifest = JSON.parse(await fs.readFile(path.join(workDir, 'public/manifest.json'), 'utf8'))
    const producedZip = path.join(workDir, `${String(manifest.id ?? deckId).trim() || deckId}.zip`)
    const zipName = `${deckId}.zip`
    await fs.mkdir(outDir, { recursive: true })
    await fs.copyFile(producedZip, path.join(outDir, zipName))
    console.log(`✓ ${deckId} → ${path.join(outDir, zipName)}`)
  } finally {
    await fs.rm(workDir, { recursive: true, force: true })
  }
}

async function main() {
  const [arg, outArg] = process.argv.slice(2)
  if (!arg) {
    console.error('usage: build-deck.mjs <deck-id>|--all [outDir]')
    process.exit(2)
  }
  const outDir = path.resolve(outArg ?? path.join(KIT_ROOT, 'dist-decks'))

  let deckIds
  if (arg === '--all') {
    deckIds = (await fs.readdir(DECKS_DIR, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  } else {
    deckIds = [arg]
  }

  for (const id of deckIds) {
    await buildOne(id, outDir)
  }
  console.log(`\nDone: ${deckIds.length} deck(s) → ${outDir}`)
}

await main()
