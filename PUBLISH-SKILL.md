---
name: naimi-publish
description: Validate, zip and publish a Naimi Web Pres template to the service — check the bundle rules, refresh the slide index and cover, pack the working folder into a ZIP and upload it as a new template or as a new revision of an existing one via the API. No build step — the folder is the bundle. Use after a template is ready locally (see naimi-template), or to re-publish an edit to an already-published template.
---

# Naimi template — publish

Turns the working folder made with `naimi-template` into a ZIP and uploads it. There
is no build: **the folder is the bundle** — publishing is a check, a zip and one API
call. **Reply in the user's language**, don't show raw logs or JSON; report the result
in one plain sentence.

## Credentials

This is the first step that needs a **free Naimi account** — everything up to here is
local. `NAIMI_URL` + `NAIMI_TOKEN` reach you in the user's message, the environment
or `.env` at the kit root; whenever they arrive in a message, save them to `.env`
(see `START-HERE.md` → "Connected or local-only?"). The cloud service is
`https://app.naimi.ai` — sign-up at `/app/signup`, tokens at `/app/authoring`; a
self-hosted install uses its own URL.

```bash
export NAIMI_URL=https://app.naimi.ai
export NAIMI_TOKEN=naimi_pk_...
```

If the user has no account yet, say in one sentence what publishing unlocks (a share
link, per-client presentations, open tracking) and let them decide — never block the
local work over it.

Commands here are bash; on Windows use `$env:NAIMI_URL = "..."` — `curl.exe` works
the same.

## Pre-flight

1. **Slide grammar**: every direct `<section>` of `#deck` has a marker comment before
   it and a unique `data-nk-slide` (see naimi-template). Fix the deck if not.
2. **Slide index**: set `manifest.json → "slides": [{ "id", "title" }, …]` — `id` from
   `data-nk-slide`, `title` from the marker comment, order = DOM order. Regenerate it
   after any slide add/rename/reorder — the service uses it to label per-slide
   analytics and slide links without opening the bundle.
3. **Bundle rules.** The upload is rejected (400) for: script/executable file types;
   more than 250 files, over 5 MB in one file, over 40 MB unpacked; a missing or
   unreadable `manifest.json`; the manifest's `entry` (`index.html`) not at the folder
   root. Everything else is on you — **nothing rejects it, it just breaks for the
   viewer**: the deck runs in a sandboxed iframe under a CSP that allows no CDN and no
   absolute URLs at all, so fonts, styles, scripts and images must be files inside the
   folder. `mock/state.json` is only for your local preview; keep it, but the service
   never reads it.
4. **Cover**: `preview.webp` fresh (re-capture if slides changed) and referenced by
   `manifest.preview` — or the key dropped. Never block publishing over a cover.

## Zip

Zip the folder's **contents** — `index.html` must sit at the ZIP root:

```bash
cd my-presentation && zip -r ../retail-roi-offer.zip . -x ".*" -x "*/.*" && cd ..
```

PowerShell: `Compress-Archive -Path my-presentation\* -DestinationPath retail-roi-offer.zip -Force`

## Upload

```bash
# new template (add -F "status=draft" to keep it hidden from managers for now)
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" \
  -F "bundle=@retail-roi-offer.zip;type=application/zip" \
  "$NAIMI_URL/api/templates/upload"

# find an existing template's id
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" "$NAIMI_URL/api/templates"

# new revision of an existing template
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" \
  -F "bundle=@retail-roi-offer.zip;type=application/zip" \
  "$NAIMI_URL/api/templates/<templateId>/revisions"
```

New template → `upload`; editing an already-published one → `…/revisions`.
**Updating is safe**: presentations already sent to clients stay pinned to the
revision they were created from; only new presentations use the new one — iterate
freely. Manual fallback for updates: the Update button on the template card at
`<URL>/app/templates`.

**`upload` creates a new template every single time it is called.** Publishing the
same folder twice — a re-run, or "yes, send it" after you already published — leaves
the user with a twin template instead of an update. So save the id the first upload
returns next to the deck (hidden files never enter the ZIP) and read it back before
every later publish of that folder:

```bash
echo "<templateId>" > my-presentation/.naimi-template-id   # after the first upload
```

No id saved and the user is not sure whether this deck is already up there? List their
templates and ask which one it is — that costs one call, a twin costs them confusion.

## After publishing

1. **Apply the start mode agreed in naimi-template**: templates open as slides by
   default; if the user chose the scrolling feed, set it now (it's a template
   setting, not part of the bundle — survives future revisions). A **document**
   template (`data-nk-format="document"`) has no start mode — skip this step:

```bash
curl -sf -X PATCH -H "Authorization: Bearer $NAIMI_TOKEN" -H "Content-Type: application/json" \
  -d '{"defaultViewMode":"scroll"}' "$NAIMI_URL/api/templates/<templateId>"   # back: "slides"
```

2. Tell the user it's live (name + it now appears under Templates), then offer the
   natural next step: **create the first presentation** — switch to
   **naimi-client-presentations** (`PRESENTATIONS-SKILL.md`).

Worth knowing:

- **Cover without a new revision**: `POST /api/templates/<id>/preview` (multipart,
  field `preview`, PNG/JPEG/WebP ≤2 MB); `DELETE` on the same path resets.
- **Keep the working folder** — the service stores the bundle; future edits start
  from these local files.

## Troubleshooting

| Symptom | Cause → fix |
|---|---|
| 400 "manifest" errors | Fix `manifest.json` against the contract in naimi-template |
| 400 file type / limits | Bundle rules above: drop stray files, downscale images, re-zip |
| Deck renders but a font / image / script is missing | It is loaded from a CDN or an absolute URL — the viewer's CSP blocks those. Make it a file inside the folder and re-publish (no upload error tells you this) |
| 400 entry/manifest not found | ZIP has a folder at its root → re-zip the folder's *contents* |
| 401 / 403 | Token missing or wrong → re-check `NAIMI_TOKEN` from `/app/authoring` |
| 402 `limit_exceeded` | Plan limit, body names it: `maxTemplateBytes` → compress images and re-zip; `maxTemplates` → update an existing template instead, or a tenant admin deletes an unused one (**that destroys its presentations** — confirm explicitly) or upgrades at `<URL>/app/billing`. `GET /api/billing/subscription` shows plan and usage. Self-hosted installs have no plan limits |

## Final checklist

```
- [ ] grammar checked; manifest.slides regenerated; bundle rules pass
- [ ] cover fresh (or intentionally skipped)
- [ ] zip has index.html at its root; uploaded via upload (first time) or revisions
      (this folder was published before — check .naimi-template-id)
- [ ] start mode applied (PATCH defaultViewMode) if the user chose the feed (not for documents)
- [ ] user got a plain-language confirmation + offer to create the first presentation
```
