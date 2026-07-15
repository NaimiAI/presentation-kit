#!/usr/bin/env node
// Upload the packaged template to a Naimi Web Pres instance via API.
//
//   NAIMI_URL=https://app.naimi.ai NAIMI_TOKEN=naimi_pk_... npm run upload
//   npm run upload -- --list                  # list existing templates
//   npm run upload -- --update <templateId>   # push a new revision
//   npm run upload -- --name "Name" --description "Description"
//
// The API token is created in the app: /app/authoring → "API tokens".
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv) {
  const args = { list: false, update: '', name: '', description: '', zip: '' }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--list') args.list = true
    else if (arg === '--update') { args.update = String(argv[index + 1] ?? ''); index += 1 }
    else if (arg === '--name') { args.name = String(argv[index + 1] ?? ''); index += 1 }
    else if (arg === '--description') { args.description = String(argv[index + 1] ?? ''); index += 1 }
    else if (arg === '--zip') { args.zip = String(argv[index + 1] ?? ''); index += 1 }
  }
  return args
}

function requireEnv() {
  const baseUrl = String(process.env.NAIMI_URL ?? '').trim().replace(/\/+$/, '')
  const token = String(process.env.NAIMI_TOKEN ?? '').trim()
  if (!baseUrl || !token) {
    console.error('NAIMI_URL and NAIMI_TOKEN environment variables are required.')
    console.error('Create the token in the app: /app/authoring → "API tokens".')
    process.exit(2)
  }
  return { baseUrl, token }
}

async function api(baseUrl, token, pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`${pathname} → HTTP ${response.status}: ${body?.error ?? 'unknown error'}`)
  }
  return body
}

async function resolveZipPath(explicitPath) {
  if (explicitPath) return path.resolve(explicitPath)
  try {
    const manifest = JSON.parse(await fs.readFile(path.join(projectRoot, 'dist', 'manifest.json'), 'utf8'))
    return path.join(projectRoot, `${String(manifest.id ?? 'presentation').trim() || 'presentation'}.zip`)
  } catch {
    console.error('dist/manifest.json not found. Run npm run package first.')
    process.exit(2)
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { baseUrl, token } = requireEnv()

  if (args.list) {
    const { templates } = await api(baseUrl, token, '/api/templates')
    for (const template of templates ?? []) {
      const source = template.source ?? 'builtin'
      console.log(`${template.id}\t[${source}]\t${template.name}`)
    }
    return
  }

  const zipPath = await resolveZipPath(args.zip)
  let zipBuffer
  try {
    zipBuffer = await fs.readFile(zipPath)
  } catch {
    console.error(`ZIP not found: ${zipPath}. Run npm run package first.`)
    process.exit(2)
  }

  const formData = new FormData()
  formData.append('bundle', new Blob([zipBuffer], { type: 'application/zip' }), path.basename(zipPath))
  if (args.name) formData.append('name', args.name)
  if (args.description) formData.append('description', args.description)

  const endpoint = args.update
    ? `/api/templates/${encodeURIComponent(args.update)}/revisions`
    : '/api/templates/upload'

  const result = await api(baseUrl, token, endpoint, { method: 'POST', body: formData })
  const template = result.template

  if (args.update) {
    console.log(`✓ New revision of template "${template?.name}" (${template?.id})`)
    console.log('  Existing presentations stay on the old revision; new presentations get this one.')
  } else {
    console.log(`✓ Template uploaded: "${template?.name}" (${template?.id})`)
  }
  console.log(`  Open: ${baseUrl}/app/templates`)
}

main().catch((error) => {
  console.error(`✗ ${error.message}`)
  process.exit(1)
})
