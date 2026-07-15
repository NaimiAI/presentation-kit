#!/usr/bin/env node
// Pre-upload validation of the built bundle (dist/). Mirrors the checks the
// Naimi Web Pres server runs on upload, so problems surface before publishing.
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const MAX_FILE_COUNT = 250
const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_BYTES = 40 * 1024 * 1024
const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_.:-]{0,63}$/

const errors = []
const warnings = []

function isSafeBundlePath(filePath) {
  return Boolean(filePath)
    && !filePath.startsWith('/')
    && !filePath.includes('\\')
    && !filePath.split('/').includes('..')
}

async function collectFiles(rootDir) {
  const files = []
  async function visit(currentDir) {
    for (const entry of await fs.readdir(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = path.relative(rootDir, absolutePath).split(path.sep).join('/')
      if (entry.isDirectory()) {
        await visit(absolutePath)
      } else if (entry.isFile() && entry.name !== '.DS_Store') {
        files.push({ relativePath, buffer: await fs.readFile(absolutePath) })
      }
    }
  }
  await visit(rootDir)
  return files
}

function validateManifest(files) {
  const manifestFile = files.find((file) => file.relativePath === 'manifest.json')
  if (!manifestFile) {
    errors.push('manifest.json is missing from the build root (put it in public/)')
    return null
  }

  let manifest
  try {
    manifest = JSON.parse(manifestFile.buffer.toString('utf8'))
  } catch {
    errors.push('manifest.json is not valid JSON')
    return null
  }

  if (manifest.schemaVersion !== 'naimi.presentation.v1') {
    errors.push(`schemaVersion must be "naimi.presentation.v1", got: ${JSON.stringify(manifest.schemaVersion)}`)
  }
  if (!String(manifest.id ?? '').trim()) errors.push('manifest.id is empty')
  if (!String(manifest.name ?? '').trim()) errors.push('manifest.name is empty')

  const entry = String(manifest.entry ?? 'index.html')
  if (!files.some((file) => file.relativePath === entry)) {
    errors.push(`entry "${entry}" not found in the build`)
  }

  // preview is optional and does not fail the build. But if it is declared and
  // the file is not in the bundle, the card silently ends up without a cover;
  // warn (put the file in public/ or remove the preview field from the manifest).
  const preview = String(manifest.preview ?? '').trim()
  if (preview && !files.some((file) => file.relativePath === preview)) {
    warnings.push(`preview "${preview}" is declared in the manifest but the file is not in the build — the card will have no cover (put the file in public/ or remove the preview field)`)
  }

  const personalizationFields = manifest.personalization?.fields ?? []
  if (!Array.isArray(personalizationFields) || !personalizationFields.some((field) => field?.key === 'companyName')) {
    errors.push('personalization.fields must explicitly contain a companyName field')
  }
  for (const field of personalizationFields) {
    if (field?.key && !KEY_PATTERN.test(field.key)) {
      errors.push(`personalization key "${field.key}" does not match ${KEY_PATTERN}`)
    }
  }

  for (const field of manifest.demoData?.fields ?? []) {
    if (field?.key && !KEY_PATTERN.test(field.key)) {
      errors.push(`demoData key "${field.key}" does not match ${KEY_PATTERN}`)
    }
    // Opt-in anonymous client self-fill. Must be a boolean if present (the
    // server coerces with Boolean(), but a non-bool here is almost always a typo).
    if (field && 'collectFromClient' in field && typeof field.collectFromClient !== 'boolean') {
      errors.push(`demoData field "${field.key}": collectFromClient must be a boolean`)
    }
  }

  return manifest
}

function validateFiles(files) {
  if (files.length === 0) errors.push('the build is empty')
  if (files.length > MAX_FILE_COUNT) errors.push(`too many files: ${files.length} > ${MAX_FILE_COUNT}`)

  let totalBytes = 0
  for (const file of files) {
    totalBytes += file.buffer.length
    if (!isSafeBundlePath(file.relativePath)) {
      errors.push(`unsafe file path: ${file.relativePath}`)
    }
    if (file.buffer.length > MAX_FILE_BYTES) {
      errors.push(`file too large (> ${MAX_FILE_BYTES / 1024 / 1024} MB): ${file.relativePath}`)
    }
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    errors.push(`build too large: ${(totalBytes / 1024 / 1024).toFixed(1)} MB > ${MAX_TOTAL_BYTES / 1024 / 1024} MB`)
  }
  return totalBytes
}

function validateContent(files) {
  for (const file of files) {
    if (!/\.(html|css|js)$/.test(file.relativePath)) continue
    const text = file.buffer.toString('utf8')

    if (text.includes('data:image')) {
      warnings.push(`${file.relativePath}: inline data:image found — images must be shipped as files (assetsInlineLimit: 0)`)
    }
    if (/(src|href)=["']\/(assets|src)\//.test(text)) {
      errors.push(`${file.relativePath}: absolute /assets paths — check base: './' in vite.config.ts`)
    }
    if (/https?:\/\/(fonts\.googleapis|fonts\.gstatic|cdn\.|unpkg\.com|cdnjs\.)/.test(text)) {
      errors.push(`${file.relativePath}: external CDN links are blocked by the CSP inside the iframe`)
    }
  }
}

async function main() {
  const target = path.resolve(process.argv[2] ?? 'dist')
  try {
    const stat = await fs.stat(target)
    if (!stat.isDirectory()) throw new Error('not a directory')
  } catch {
    console.error(`Build directory not found: ${target}. Run npm run build first.`)
    process.exit(2)
  }

  const files = await collectFiles(target)
  const manifest = validateManifest(files)
  const totalBytes = validateFiles(files)
  validateContent(files)

  for (const warning of warnings) console.warn(`⚠ ${warning}`)
  if (errors.length > 0) {
    for (const error of errors) console.error(`✗ ${error}`)
    process.exit(1)
  }

  console.log(`✓ Bundle is valid: ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB`)
  if (manifest) {
    console.log(`  id: ${manifest.id}, name: ${manifest.name}`)
  }
}

await main()
