---
name: naimi-client-presentations
description: Operate Naimi Web Pres via its REST API — create personalized client presentations from a template, adapt a template for one client when filling the fields is not enough, edit a presentation's personalization, track deal statuses, view stats and the client's own self-fill answers, manage clients and their accumulated facts, export a presentation as PDF. Also runs the account through the same API — team and invitations, open notifications, custom domains, plan and limits, how a presentation opens — and routes secrets and payments to the service UI. Use for any operational request about Naimi presentations, clients or the service. No build step and no kit needed — pure API.
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
everyone** (template). One client, but the fields can't carry it — texts rewritten,
slides added or dropped, their own photos? Still a presentation: "Adapt the template
for one client" below. **Never make a new template per client.**

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
`{ "error": "<message>", "code": "<code>" }` plus what to fix (`missingFields`, the
`key` of a field). Call with `curl -sS --fail-with-body` (curl 7.76+): a refusal still
prints that body, while `-f` alone swallows it; a download to a file (`-o`) takes
`-sSf`, so an error never lands in the file. Recurring ones: `402` +
`code: "limit_exceeded"` — a plan limit (body names the resource; upgrades at
`<URL>/app/billing`, tenant admin); `403` — usually needs a tenant admin. The curl
examples are bash; on Windows use `$env:NAIMI_TOKEN = "..."` (`curl.exe` works the
same). Smoke test:

```bash
curl -sS --fail-with-body -H "Authorization: Bearer $NAIMI_TOKEN" "$NAIMI_URL/api/auth/me"
```

## API map

| Task | Call |
|---|---|
| List templates | `GET /api/templates` |
| Personalization schema of one | `GET /api/templates/:templateId` → `manifest.personalization` |
| The document itself — slides, texts, where each field stands | `GET /api/templates/:templateId/outline?format=markdown` → `{ markdown }`; of a presentation — `GET /api/presentations/:presentationId/outline?format=markdown` |
| How the template opens for clients | `PATCH /api/templates/:templateId` `{ "defaultViewMode": "scroll" \| "slides" }` (scroll = feed; viewers keep the toggle; a **document** template ignores it — it always reads as portrait pages) |
| Find clients by name | `GET /api/clients?q=<substring>` |
| Client card + all its presentations | `GET /api/clients/:clientId` |
| Create / update a client | `POST /api/clients`, `PATCH /api/clients/:clientId` — `companyName`, `contactName`, `email`, `phone`, `notes` |
| List/search presentations (stats, shareUrl) | `GET /api/presentations` (`?q=` searches by company server-side) |
| One presentation + its editing schema | `GET /api/presentations/:presentationId` |
| Create a presentation | `POST /api/presentations` (recipe below) |
| Edit personalization | `PATCH /api/presentations/:presentationId` (full replace, recipe below) |
| Adapt the template for one client | `POST /api/presentations` with `"deck": "own"` → `…/deck` → `…/deck/apply` (recipe below) |
| Deal status | `PATCH /api/presentations/:presentationId/status` `{ "status": "in_progress" \| "successful" \| "lost" }` |
| Pre-seed interactive values | `PATCH /api/presentations/:presentationId/data` `{ "data": { "<key>": <value> } }` |
| Upload a picture for an `image` field | `POST /api/personalization-images` (multipart, field `image`) → `{ url }` |
| Export as PDF | `GET /api/presentations/:presentationId/export.pdf` — compressed (a smaller file, takes longer) or `…/export.pdf_uncompressed` — as printed (faster, a larger file); vector, one page per slide (a **document** template prints portrait A4 / Letter pages, a long page continues on the next); slow (~0.5–2 min), save the binary as `<slug>.pdf`; `402` = monthly export quota; `503` = no Chromium on the install |
| Export as PowerPoint | `GET /api/presentations/:presentationId/export.pptx` — editable slides: texts stay text boxes, cards — shapes, speaker notes from `data-nk-notes`; only kit v2 slide decks (`presentation.pptxExportAvailable: true`, otherwise `422 pptx_deck_unsupported`); same monthly quota as PDF (`402`), save the binary as `<slug>.pptx` |
| Client's own answers (self-fill) | `presentation.clientResponses` — `{ value, updatedAt }` per key |

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
        and the document: GET /api/templates/:templateId/outline?format=markdown
- [ ] 3. Find or create the client: GET /api/clients?q=<name>; reuse client.facts as defaults
- [ ] 4. Fill personalization per the rules below (confirm invented wording)
- [ ] 5. POST /api/presentations → check the link (below) → reply with presentation.shareUrl
```

The outline is the template printed as text: every slide with what it says, `{{key}}`
where each field stands, the sample value the author previewed there and its length.
Write a value **about as long as its sample** — a text twice the length breaks the
slide — and in the sample's format (line breaks, `Title | Description` rows). Where
the outline says "hidden when empty" or "shown only when {{key}} is filled", the field
may stay empty: that block, or that whole slide, simply doesn't show.

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

**Check the link before you hand it over.** `GET $NAIMI_URL/api/public/presentations/<slug>`
— no token; `<slug>` is the last part of `shareUrl` — returns exactly what the link
serves: `presentation.personalization` holds the values the deck receives (`companyName`,
`contactName`, `stagesJson` and the other platform keys at the top, the template's own
fields under `customFields` as `{ key, value }`). A key the template does not declare is
not there — it never reaches the client; `404` — the link shows nothing.

If this is the user's **first** presentation, close the loop: offer to open
`shareUrl` together, and to set up open notifications (account table below).

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

## Recipe: adapt the template for one client

A presentation is made in one of two ways. **Fill the fields** — the recipe above:
instant, and right whenever the fields can carry the brief. **Adapt the template for
the client** — when they can't: the texts have to be rewritten for this client, slides
added, dropped or reordered, their own photos put in. Then you rework the template's
deck for this one client and the presentation shows **its own version**. It stays one
presentation of one client: the template is not changed, and no new template appears.

To the user say exactly that — "I'll adapt the template for this client", "here is the
preview", "the link is created / updated" — never "own deck", "revision" or "apply".

```
- [ ] 1. Read the template as a document: GET /api/templates/:templateId/outline?format=markdown
- [ ] 2. Create the presentation without a link:
        POST /api/presentations { "templateId", "clientId" | "client", "deck": "own" }
        → presentation.shareUrl is null until step 6
- [ ] 3. Take the base — the template's current revision:
        GET /api/templates/:templateId/revisions/current/bundle.zip → unzip into a working folder
- [ ] 4. Rework it for the client by the rules of naimi-template (TEMPLATE-SKILL.md),
        then the pre-flight of naimi-publish (PUBLISH-SKILL.md): slide grammar,
        manifest.slides rewritten to the slides you kept (the base lists the
        template's), bundle rules; zip the folder's contents
- [ ] 5. Upload it as a working version and read it back:
        POST /api/presentations/:presentationId/deck (multipart, field bundle)
        → revision.id, revision.previewUrl (prefix it with NAIMI_URL);
        GET /api/presentations/:presentationId/outline?revisionId=<revisionId>&format=markdown
        → your slides in your order, nothing of the sample left; show the user previewUrl
- [ ] 6. On the user's yes — create the link:
        POST /api/presentations/:presentationId/deck/apply { "revisionId" }
        → check the link, reply with presentation.shareUrl
```

```bash
curl -sSf -H "Authorization: Bearer $NAIMI_TOKEN" -o base.zip \
  "$NAIMI_URL/api/templates/<templateId>/revisions/current/bundle.zip"

curl -sS --fail-with-body -H "Authorization: Bearer $NAIMI_TOKEN" \
  -F "bundle=@acme-deck.zip;type=application/zip" \
  "$NAIMI_URL/api/presentations/<presentationId>/deck"

curl -sS --fail-with-body -X POST -H "Authorization: Bearer $NAIMI_TOKEN" -H "Content-Type: application/json" \
  -d '{"revisionId":"<revisionId>"}' "$NAIMI_URL/api/presentations/<presentationId>/deck/apply"
```

- **An upload never touches the client's link** — it is a working version. Only
  `deck/apply` creates the link, and later updates it; so iterate freely: upload again
  (add `-F "replace=<revisionId>"` to overwrite the previous working version), look,
  update the link when it is right. A later edit is the same loop from step 4 — keep
  the working folder.
- **The template is a neutral sample — always start from it, never from another
  client's version.** Whatever you don't replace reaches this client as written: a
  sample name in a footer, someone else's photo, placeholder numbers, the fallback of
  a field left empty. So the outline of step 5 is the check before the link: nothing
  of the sample is left, and a slide you have nothing for is removed, not left
  half-filled.
- The adapted deck may keep personalization fields (`companyName` always comes from
  the client): pass their values in `personalization` at step 2 or with the usual
  `PATCH` before step 6 — `deck/apply` checks the required fields of **your** version
  (`400 missing_fields`). `revision.previewUrl` is a page of the service: it shows this
  version with the presentation's values and client to whoever signs in to manage
  it — the link to show the user; the client's link does not move.
  `GET /api/presentations/:presentationId/deck/<revisionId>/preview` returns the same
  as JSON — exactly what the client's link would serve.
- A presentation made by filling the fields can be adapted later the same way (steps
  3–6 on its id): its link keeps showing the template until `deck/apply`.
  `GET /api/presentations/:presentationId/deck` lists the versions;
  `DELETE /api/presentations/:presentationId/deck` returns it to the template.
- Refusals: `409 template_draft` — the template is not published yet;
  `400 invalid_bundle` — the bundle rules of naimi-publish; `402 limit_exceeded` — the
  plan's storage or monthly presentations.

## Personalization rules

- `fields`: `[{ key, label, placeholder, type, required }]`, `type` is `text | date |
  textarea | image`; `date` expects `YYYY-MM-DD`. Fill by meaning — `label` and
  `placeholder` explain the intent.
- `type: "image"` — value is the **URL of an uploaded picture**. Upload first, then
  pass the returned `url` exactly as returned (it's relative — resolves on whatever
  domain serves the presentation):

```bash
curl -sS --fail-with-body -H "Authorization: Bearer $NAIMI_TOKEN" \
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
- Required fields are enforced: missing → `400` + `code: "missing_fields"` with
  `missingFields: [...]`.
- `stagesJson` (when `showStagesEditor: true`) — the table of stages: a list of
  `{ "title", "cost", "rows" }`, `cost` a plain number (`80000` or `"80 000"`), `rows`
  one line per work item, `Title | Description`. Send the list itself or its JSON
  string, at most 30 stages; `[]` clears the table. The service stores it as the JSON
  string the deck reads — `[{ "title", "costRub", "rows" }]`, rows joined by line
  breaks — and that form is accepted back as is:

```json
"stagesJson": [
  { "title": "Stage 1. Customer-care agent", "cost": 80000,
    "rows": ["CRM integration | Connect to Retail CRM", "Testing | Validate on real requests"] }
]
```

- A value its field cannot take — an object or a list in a text field, a table that is
  not a list of stages, a cost like `"4,800"` — is refused whole: `400` +
  `code: "invalid_field_value"` with the field's `key`; nothing is written. Fix that
  value and send again.

## Interactive values (demoData)

`manifest.demoData.fields` lists the interactive slide values (calculators, sliders) —
normally set by the **manager during the call** and saved on the presentation; keys
marked `promoteToClientFacts` also land in `client.facts`. Pre-seed before a call via
`PATCH …/data`. Fields with `collectFromClient: true` also capture the **anonymous
client's own** input into the separate `clientResponses` bucket (never overwriting the
manager's values); whether a field is collectable is a **template** decision — to
collect a new answer, the template must declare the flag.

## The rest of the service — through the API when the token allows

The same REST API runs the account, so do it yourself when asked — with two hard lines.
**Never take a secret through the chat** (bot token, webhook signing secret, password, API
token) and **never pay, switch or cancel a plan**: those the user does in the service UI.
Say what will change and get a yes before any write below. `403` = the token lacks the
scope (`requiredScope`) or the user is not a tenant admin; `404` on billing/domains = the
install has none (self-hosted) — then name the page, or drop the topic, and move on.

| Task | Call |
|---|---|
| Team list (admin) | `GET /api/users` — a pending invitation is `status: "invited"` + `invite.expired` |
| Invite a colleague (admin) | `POST /api/users/invite` `{ "email", "role"?: "manager" \| "admin", "name"? }` — they set their own password from the email; `402 limit_exceeded` = the plan's seats |
| Re-send an invitation | `POST /api/users/:userId/invite/resend` (`429` — wait a minute) |
| Teammate's role / access | `PATCH /api/users/:userId` `{ "role"?, "status"?: "active" \| "disabled" }` — never `password` |
| Notification channels (per user) | `GET /api/notification-subscriptions` → `subscriptions`, `sharedTelegram` |
| Shared Telegram bot on | `PUT /api/notification-subscriptions/telegram-shared` `{ "enabled": true }`, then hand over `https://t.me/<botUsername>?start=<config.linkCode>` — linked once they press Start (`config.isLinked`) |
| Webhook without a signing secret | `PUT /api/notification-subscriptions/webhook` `{ "enabled": true, "url" }` |
| Tune / pause a channel | same `PUT` per connector (`telegram`, `telegram-shared`, `webhook`) with the **whole** object: read it, resend `enabled`, `eventTypes`, `settings` with your change (`settings.presentationOpened`: `firstOpenOnly`, `ignoreRepeatVisitors`, `minMinutesBetweenPresentationNotifications`); leave `botToken` / `secret` out — the stored ones are kept |
| Test send / remove a channel | `POST /api/notification-subscriptions/:id/test` · `DELETE /api/notification-subscriptions/:id` |
| Custom domains (cloud, admin) | `GET /api/domains` → `domains`, `planAllowed` |
| Add a domain | `POST /api/domains` `{ "hostname": "pres.example.com" }` (subdomain only) → give the user the DNS records from `domain.verification`; `402 feature_unavailable` = not in the plan |
| Check / remove a domain | `POST /api/domains/:id/verify` · `DELETE /api/domains/:id` |
| Plan, limits, usage (cloud) | `GET /api/billing/subscription`; plans to compare — `GET /api/billing/plans`; AI credits — `GET /api/billing/credits` |

Managers see their own clients and presentations; admins see everything.

**UI only** — give the page and one plain sentence:

- own Telegram bot, webhook with a signing secret — `<URL>/app/notifications`;
- paying, changing or cancelling a plan, buying credits, the "Made with Naimi" badge —
  `<URL>/app/billing` (admin);
- a teammate's password — `<URL>/app/users` (admin); API tokens, the kit, examples gallery —
  `<URL>/app/authoring`.

If `GET /api/billing/subscription` returns 404/403 or an empty plan, don't bring up plans
or limits at all.

## Checklist before replying

```
- [ ] required schema fields filled; dates are YYYY-MM-DD
- [ ] image fields: file uploaded, value = returned url
- [ ] stages sent as the list [{ title, cost, rows }] (decks with showStagesEditor)
- [ ] existing client found via ?q= (not duplicated); facts reused as defaults
- [ ] edits sent as the FULL personalization object
- [ ] values are about as long as their samples in the outline
- [ ] template adapted for one client: started from the template, manifest.slides
      rewritten, nothing of the sample left in the outline of your version, the link
      created only after the user saw the preview
- [ ] the link checked: GET /api/public/presentations/<slug> serves your values
- [ ] the link in the reply is presentation.shareUrl from the API response
```
