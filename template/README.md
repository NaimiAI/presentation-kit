# Naimi presentation starter

Starter **template** project for [Naimi Web Pres](../README.md), using the same
stack as the product decks: React + Vite + Tailwind + framer-motion. It builds
into a static ZIP and uploads to the service.

Full instructions for an AI agent (Claude Code, Cursor, Codex, or another coding
agent) are in the kit skills at the repository root: `TEMPLATE-SKILL.md` for
authoring and `PUBLISH-SKILL.md` for build/upload. Start with `START-HERE.md`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — preview with data from mock/state.json
                     # http://localhost:5173/#gallery — component and theme gallery
npm run package      # build + validation + <id>.zip
NAIMI_URL=https://app.naimi.ai NAIMI_TOKEN=naimi_pk_... npm run upload
```

Building and previewing needs no account; uploading does (free —
see the kit `README.md`). The token is created at `<NAIMI_URL>/app/authoring`.

## Structure

| Path | Purpose |
|---|---|
| `src/slides/` | **Slides: the main workspace.** Slide order is set in `src/slides/index.ts` |
| `public/manifest.json` | Presentation contract: id, name, personalization fields, interactive keys |
| `mock/state.json` | Local preview data that simulates the service response |
| `src/theme.css` | Design tokens and themes; the active theme is `data-theme` in `index.html` |
| `src/kit/` | Kit runtime: player, SDK, components. **Do not edit**; it is updated with new template versions |
| `scripts/` | validate / package / publish |

## Core rules

- `companyName` comes from personalization: `personalization.companyName`.
- Interactive values must go through `useDemoField('key', { defaultValue })`;
  declare those keys in `manifest.json` -> `demoData.fields`.
- Images and fonts must be files in `src/assets/`; no CDNs and no `data:image`.
- Keep `base: './'` and `assetsInlineLimit: 0` in `vite.config.ts`.
