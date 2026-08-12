---
name: naimi-client-presentations
description: Operate Naimi Web Pres via its REST API — create personalized client presentations from a template, edit a presentation's personalization, track deal statuses, view stats and the client's own self-fill answers, manage clients and their accumulated facts, export a presentation as PDF. Also routes service and account questions — notifications, team, plan and billing, custom domains, how a presentation opens. Use for any operational request about Naimi presentations, clients or the service. No build step and no kit needed — pure API.
---

# Naimi — client presentations

The objects you operate on:

- **Template** — a reusable presentation **blueprint** uploaded to the service; its
  manifest declares which fields get personalized. API object `template`
  (`/api/templates`).
- **Presentation** — a personalized instance of a template for **one** client, with a
  public URL that opens without login; carries personalization, deal status, view
  stats and values saved during the call. API object `presentation`
  (`/api/presentations`, field `shareUrl`).
- **Client** — CRM card: contacts, notes and **facts** — key→value knowledge
  accumulated from all of that client's presentations, used as defaults for the next.

To the user always say *presentation* / *template*, never the API names. Routing:
"create/change a presentation for client X", "who opened it" → this skill (pure API).
"Make/fix a template, slides, design, fields" → `naimi-template` + `naimi-publish`.
In doubt, ask whether the change is for **one client** (presentation) or **for
everyone** (template).

The user is non-technical: run the calls yourself and reply with results (links,
statuses, numbers) in plain language — no raw curl/JSON unless asked. **Reply in the
user's language.** A presentation doesn't need a tidy brief: from a **call
transcript, chat export, notes** or one sentence, extract the client and the field
values, fill the schema by meaning, confirm anything you invented, return the link.

## Setup

`NAIMI_URL` and `NAIMI_TOKEN` reach you in the user's message, the environment or
`.env` at the kit root (`START-HERE.md` → "Connected or local-only?"; the cloud
service is `https://app.naimi.ai`, tokens at `<NAIMI_URL>/app/authoring`). Every call sends
`Authorization: Bearer $NAIMI_TOKEN`; bodies are JSON; errors are
`{ "error": "<message>" }`. Recurring ones: `402` + `code: "limit_exceeded"` — a plan
limit (body names the resource; upgrades at `<URL>/app/billing`, tenant admin);
`403` — usually needs a tenant admin. The curl examples are bash; on Windows use
`$env:NAIMI_TOKEN = "..."` (`curl.exe` works the same). Smoke test:

```bash
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" "$NAIMI_URL/api/auth/me"
```

## API map

| Task | Call |
|---|---|
| List templates | `GET /api/templates` |
| Personalization schema of one | `GET /api/templates/:templateId` → `manifest.personalization` |
| How the template opens for clients | `PATCH /api/templates/:templateId` `{ "defaultViewMode": "scroll" \| "slides" }` (scroll = feed; viewers keep the toggle) |
| Find clients by name | `GET /api/clients?q=<substring>` |
| Client card + all its presentations | `GET /api/clients/:clientId` |
| Create / update a client | `POST /api/clients`, `PATCH /api/clients/:clientId` — `companyName`, `contactName`, `email`, `phone`, `notes` |
| List/search presentations (stats, shareUrl) | `GET /api/presentations` (`?q=` searches by company server-side) |
| One presentation + its editing schema | `GET /api/presentations/:presentationId` |
| Create a presentation | `POST /api/presentations` (recipe below) |
| Edit personalization | `PATCH /api/presentations/:presentationId` (full replace, recipe below) |
| Deal status | `PATCH /api/presentations/:presentationId/status` `{ "status": "in_progress" \| "successful" \| "lost" }` |
| Pre-seed interactive values | `PATCH /api/presentations/:presentationId/data` `{ "data": { "<key>": <value> } }` |
| Upload a picture for an `image` field | `POST /api/personalization-images` (multipart, field `image`) → `{ url }` |
| Export as PDF | `GET /api/presentations/:presentationId/export.pdf` — vector, one page per slide; slow (~0.5–2 min), save the binary as `<slug>.pdf`; `402` = monthly export quota; `503` = no Chromium on the install |
| Client's own answers (self-fill) | `presentation.clientResponses` — `{ value, updatedAt }` per key |
| Plan, limits, usage (cloud) | `GET /api/billing/subscription` |

Mapping requests: "who viewed it / how often" → `presentation.stats` (`openCount`,
`uniqueVisitorCount`, `lastOpenedAt`, `totalViewSeconds`); "what did the client
answer" → `presentation.clientResponses`; "what do we know about the client" →
`client.facts` + their presentation list; "send me the link" → `presentation.shareUrl`.

Not supported via the API: deleting presentations or clients — say so. Deleting a
template exists but **destroys all its presentations** (tenant admin only) — never
call it unless explicitly asked.

## Recipe: create a personalized presentation

```
- [ ] 1. Pick the template: GET /api/templates (ask if ambiguous)
- [ ] 2. Read its schema: GET /api/templates/:templateId → manifest.personalization
- [ ] 3. Find or create the client: GET /api/clients?q=<name>; reuse client.facts as defaults
- [ ] 4. Fill personalization per the rules below (confirm invented wording)
- [ ] 5. POST /api/presentations → reply with presentation.shareUrl
```

```
POST /api/presentations
{
  "templateId": "prs_...",
  "clientId": "cli_...",           // or "client": { "companyName": "...", "contactName": "..." }
  "personalization": { ... }
}
```

→ `201 { presentation }`. The link works immediately, no publish step; keep
`presentation.id` for later edits. Passing `client: {...}` inline creates (or reuses)
the client automatically.

If this is the user's **first** presentation, close the loop: offer to open
`shareUrl` together, and to set up open notifications (`<URL>/app/notifications`).

## Recipe: edit an existing presentation

1. Find it: `GET /api/presentations?q=<company>`.
2. `GET /api/presentations/:presentationId` → `{ presentation, personalizationSchema }`.
   The schema belongs to the revision this presentation actually renders (pinned at
   creation) — edit against it, not the template list.
3. `PATCH /api/presentations/:presentationId` with
   `{ "companyName": "...", "personalization": { ...the full object... } }`.

**PATCH replaces the whole personalization — no merge.** Take
`presentation.personalization` from step 2, change what's needed, send everything
back. Top-level `companyName` is required. The shareUrl never changes on edit —
links already sent keep working.

## Personalization rules

- `fields`: `[{ key, label, placeholder, type, required }]`, `type` is `text | date |
  textarea | image`; `date` expects `YYYY-MM-DD`. Fill by meaning — `label` and
  `placeholder` explain the intent.
- `type: "image"` — value is the **URL of an uploaded picture**. Upload first, then
  pass the returned `url` exactly as returned (it's relative — resolves on whatever
  domain serves the presentation):

```bash
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" \
  -F "image=@project.webp" "$NAIMI_URL/api/personalization-images"
# → { "imageId": "pimg_...", "url": "/api/personalization-images/pimg_.../image.webp" }
```

  PNG/JPEG/WebP ≤5 MB. Uploads are write-once: to change, upload a new file and PATCH
  the new URL in; to remove, send the field empty.
- `companyName` comes from the client — no need to pass it inside `personalization`.
- Declared keys go at the top level: `{ "contactName": "John", "fleetSize": "120" }`;
  non-standard keys are stored as `customFields` — decks resolve both the same way.
  `customFields: [{ key, value }]` is the explicit form when the schema sets
  `showCustomFields: true`.
- Required fields are enforced: missing → 400 with `missingFields: [...]`.
- `stagesJson` (when `showStagesEditor: true`): stages/pricing as a JSON **string**;
  `rows` is one line per work item, `Title | Description`:

```json
"[{\"title\":\"Stage 1. Customer-care agent\",\"costRub\":80000,\"rows\":\"CRM integration | Connect to Retail CRM\\nTesting | Validate on real requests\"}]"
```

## Interactive values (demoData)

`manifest.demoData.fields` lists the interactive slide values (calculators, sliders) —
normally set by the **manager during the call** and saved on the presentation; keys
marked `promoteToClientFacts` also land in `client.facts`. Pre-seed before a call via
`PATCH …/data`. Fields with `collectFromClient: true` also capture the **anonymous
client's own** input into the separate `clientResponses` bucket (never overwriting the
manager's values); whether a field is collectable is a **template** decision — to
collect a new answer, the template must declare the flag.

## The rest of the service — route, don't improvise

These live in the service UI (most need a tenant admin). Give the page and one plain
sentence; don't invent API calls not in the map:

- **Open notifications** — `<URL>/app/notifications`: Telegram or an outgoing webhook
  (JSON + HMAC), with a test send. Per-user.
- **Team** — `<URL>/app/users` (admin): managers see their own clients and
  presentations; admins see everything.
- **Plan & billing** — `<URL>/app/billing` (admin). The "Made with Naimi" badge on
  public presentations switches off there on paid plans.
- **Custom domain** — `<URL>/app/domain` (admin, business plan).
- **Kit, API tokens, examples gallery** — `<URL>/app/authoring`.

Self-hosted installs may lack billing/domain pages, and in the AI studio the agent
token has no billing access: if `GET /api/billing/subscription` returns 404/403 or an
empty plan, don't bring up plans or limits at all.

## Checklist before replying

```
- [ ] required schema fields filled; dates are YYYY-MM-DD
- [ ] image fields: file uploaded, value = returned url
- [ ] stagesJson is a valid JSON string (decks with showStagesEditor)
- [ ] existing client found via ?q= (not duplicated); facts reused as defaults
- [ ] edits sent as the FULL personalization object
- [ ] the link in the reply is presentation.shareUrl from the API response
```
