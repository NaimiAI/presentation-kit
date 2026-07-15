#!/usr/bin/env node
// Validate dist/ and zip it into <manifest.id>.zip, ready for upload.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import AdmZip from 'adm-zip'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(projectRoot, 'dist')

const validation = spawnSync(process.execPath, [path.join(projectRoot, 'scripts', 'validate.mjs'), distDir], {
  stdio: 'inherit',
})
if (validation.status !== 0) {
  process.exit(validation.status ?? 1)
}

const manifest = JSON.parse(await fs.readFile(path.join(distDir, 'manifest.json'), 'utf8'))
const outputName = `${String(manifest.id ?? 'presentation').trim() || 'presentation'}.zip`
const outputPath = path.join(projectRoot, outputName)

const zip = new AdmZip()

async function addDirectory(currentDir) {
  for (const entry of await fs.readdir(currentDir, { withFileTypes: true })) {
    const absolutePath = path.join(currentDir, entry.name)
    const relativePath = path.relative(distDir, absolutePath).split(path.sep).join('/')
    if (entry.isDirectory()) {
      await addDirectory(absolutePath)
    } else if (entry.isFile() && entry.name !== '.DS_Store') {
      zip.addFile(relativePath, await fs.readFile(absolutePath))
    }
  }
}

await addDirectory(distDir)
zip.writeZip(outputPath)

const stat = await fs.stat(outputPath)
console.log(`✓ Done: ${outputName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`)
console.log('  Upload: npm run upload  (or manually via /app/templates)')
