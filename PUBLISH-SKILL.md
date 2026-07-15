---
name: naimi-publish
description: Build, validate and publish a Naimi Web Pres template to the service — package the local presentation into a ZIP, run validation against the bundle rules, set the cover, and upload it as a new template or as a new revision of an existing one via the API. Use after a template is ready locally (see naimi-template), or to re-publish an edit to an already-published template.
---

# Naimi template — build & publish

This skill turns a finished local **template** (built with `naimi-template`) into a
validated ZIP and uploads it to the service. Run it once the slides render
correctly in local preview.

**Reply to the user in their own language — whatever language they write to you
in — in plain language.** Don't show raw build logs or JSON unless asked — run the steps yourself and report the result (published /
updated, the presentation name, any problem in one sentence). The commands below
are bash/zsh; on Windows use `$env:NAIMI_URL = "..."` instead of `export`.

Prerequisites: a working copy made with `naimi-template`, and **Node.js >= 20.19**
(if you're starting a fresh session just to re-publish, check `node -v` first —
see the env section of `naimi-template`).

## Credentials

Publishing is the first step that talks to the service, so it needs a **Naimi
account** and two values. They may already be in this conversation (the
service's onboarding snippet ends with them), in the environment, or in a
`.env` file at the kit root (see `.env.example`) — whenever they arrive in a
message, save them into `.env` right away (gitignored) so later sessions are
set up:

```bash
export NAIMI_URL=https://app.naimi.ai       # the cloud service (self-hosted installs use their own URL)
export NAIMI_TOKEN=naimi_pk_...             # API token, created at <NAIMI_URL>/app/authoring
```

**If they're absent, the user probably has no account yet.** Don't treat it as
an error — make the free-account offer from `START-HERE.md` → "Connected or
local-only?" (one or two sentences, benefits first: a live shareable link,
per-client personalized presentations, open tracking and notifications). Signup
is at `https://app.naimi.ai/app/signup`, free plan; afterwards the user creates
an API token at `<NAIMI_URL>/app/authoring` and pastes it to you. Save both
values into `.env` and continue below. If the user already has an account and
the values are just missing, ask for them the same way.

## Cover image

The template card shows `manifest.preview`. If you captured a cover during
local preview, make sure `public/preview.webp` exists and `"preview"` points at
it in `public/manifest.json`. If you changed slides since the last capture,
re-capture from the **current first slide** so the card isn't stale (full steps
in `naimi-template` → "Cover image"). No cover is fine — the card shows a
placeholder and the manager can upload one later; never block publishing over it.

## Hard constraints (server validation + iframe CSP)

`npm run package` builds and validates, reporting any violation before zipping:

- **No CDNs** anywhere (scripts, styles, fonts, images). Inter ships as a file;
  fonts/images live in `src/assets/` as files.
- **No `data:image` inlining** — keep `assetsInlineLimit: 0` in `vite.config.ts`.
- Keep `base: './'` in `vite.config.ts` (assets serve from a nested path).
- **No direct network/API/cookies/localStorage** — only the kit hooks.
- Limits: ≤250 files, ≤5 MB per file, ≤40 MB unpacked.

## Build & validate

```bash
cd my-presentation
npm run package      # tsc + vite build + validation → produces <id>.zip
```

If it fails, fix and re-run (see Troubleshooting). Don't upload until `package`
passes cleanly.

## Publish

```bash
npm run upload                       # new template from <id>.zip
npm run upload -- --list             # list template ids (to find one to update)
npm run upload -- --update <id>      # new revision of an existing template
```

- **New template** → `npm run upload`.
- **Editing an already-published template** → `npm run upload -- --update <id>`.
  Find the id with `--list` (or the user can read it off the template card).

**Updating is safe.** Presentations already sent to clients stay pinned to the revision
they were created from and keep rendering the old version; only *new* presentations use
the new revision. So you can iterate without breaking presentations in the wild.

Manual fallback **for updates only**: the Update button on the template
card at `<URL>/app/templates`. New templates are published via the API
(`npm run upload`).

## Troubleshooting

| Symptom | Cause → fix |
|---|---|
| `npm install` / engine warning | Node < 20.19 → install a current Node (see `naimi-template` Step 0) |
| `tsc` errors on `npm run package` | Fix the slide code; the build is type-checked |
| Validation: CDN / data:image / file limits | See Hard constraints; move assets into `src/assets/`, downscale heavy images |
| Upload 401/403 | Token missing or wrong → re-check `NAIMI_TOKEN` from `/app/authoring` |
| Upload 400 with manifest errors | Fix `public/manifest.json` against the contract in `naimi-template` |
| Upload 402 `limit_exceeded` | Plan limit — the body names it: `maxTemplateBytes` (ZIP too big for the plan → compress/downscale images, re-package) or `maxTemplates` (template count → update an existing one with `--update`, or a tenant admin deletes an unused template — **that destroys its presentations**, confirm explicitly — or upgrades at `<URL>/app/billing`). `GET /api/billing/subscription` shows the plan, limits and current usage. Self-hosted installs have no plan limits |

## After publishing

Tell the user it's live (name + that it now appears under Templates). Then
offer the natural next step: **create the first presentation for a real client** —
switch to **naimi-client-presentations** (`PRESENTATIONS-SKILL.md`).

Two follow-ups worth knowing:

- **The card cover can be set or replaced at any time without a new revision:**
  `POST /api/templates/:templateId/preview` (multipart, field `preview`,
  PNG/JPEG/WebP, ≤ 2 MB); `DELETE` on the same path resets to the bundle's
  manifest cover.
- **Tell the user to keep the working folder** — the service stores the built
  bundle, not the sources; a future edit of this template starts from these
  local files.

## Final checklist

```
- [ ] npm run package passes (build + validation, no violations)
- [ ] cover present (public/preview.webp + "preview" set) or intentionally skipped
- [ ] published via npm run upload; for an edit used --update <id>
- [ ] user got a plain-language confirmation + offer to create the first presentation
```
