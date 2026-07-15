---
name: naimi-client-presentations
description: Operate Naimi Web Pres via its REST API — create personalized client presentations from a template, edit a presentation's personalization, track deal statuses, view stats and the client's own self-fill answers, manage clients and their accumulated facts. Also routes service and account questions — open notifications, team, plan and billing, custom domains. Use for any operational request about Naimi presentations, clients or the service — creating a presentation for a client, changing prices or fields in an existing one, marking a deal won or lost, checking who opened a presentation or what the client answered, looking up what is known about a client, setting up notifications. No build step and no kit needed — pure API.
---

# Naimi — client presentations

Naimi Web Pres is a B2B sales tool. The objects you operate on:

- **Template** — a reusable presentation **blueprint** uploaded to the service
  (slides + design). Its manifest declares which fields get personalized per client.
- **Presentation** — a personalized instance of a template for **one** client, with a
  public URL `https://<host>/<client>-<id>` that opens without login. It carries
  personalization, deal status, view stats and interactive values saved during
  the call. (In the REST API this object is named `presentation` — endpoints
  `/api/presentations`, field `presentation.shareUrl`.)
- **Client** — CRM card: contacts, notes and **facts** — key→value knowledge
  accumulated from all of that client's presentations, used as defaults for the next one.

> **Naming — the API matches these words directly.** A per-client **presentation** is
> the API `presentation` object (`/api/presentations`); a reusable **template** is the
> API `template` object (`/api/templates`). Follow the API map below; to the user always
> say *presentation* / *template*, never the API names.

This skill operates on these through the API — **no build step, the kit is not
needed**. Routing rule: "create a presentation for client X", "change the price in the
offer for X", "who opened the presentation" → this skill (pure API calls). "Make / fix a
template, slides, design, personalization fields" → that is authoring:
`naimi-template` (`TEMPLATE-SKILL.md`) + `naimi-publish` (`PUBLISH-SKILL.md`).
When in doubt, ask whether the change is for **one client** (presentation) or **for
everyone** (template).

Assume the user is non-technical: never show raw curl/JSON unless asked — run the
calls yourself and reply with results (links, statuses, numbers) in plain
language. **Reply to the user in their own language — whatever language they
write to you in.** The curl examples are bash; on Windows use
`$env:NAIMI_TOKEN = "..."` (`curl.exe` works the same).

## Building a presentation from messy input

A presentation doesn't need a tidy brief. The user can paste a **call transcript**, a
**chat export**, **meeting notes**, or describe the deal in a sentence ("create a
presentation for Acme with a 15% discount for payment before the end of the month").
Extract the client and the personalization fields from whatever they give you,
fill the schema by meaning, confirm anything you invented, and return the presentation's link.

## Setup

Everything in this skill is an API call, so it requires a **Naimi account** and
two values — look for them in the environment or in a `.env` file at the kit
root (see `.env.example`):

- `NAIMI_URL` — service URL: `https://app.naimi.ai` for the cloud service
  (self-hosted installs use their own URL)
- `NAIMI_TOKEN` — API token `naimi_pk_...`, created at `<NAIMI_URL>/app/authoring`

**If they're absent, the user probably has no account yet** — make the
free-account offer from `START-HERE.md` → "Connected or local-only?" (benefits
first: this skill is exactly what an account unlocks — per-client presentations
with one tracked link, stats, notifications, client CRM). Signup:
`https://app.naimi.ai/app/signup`, free plan; then the user creates a token at
`<NAIMI_URL>/app/authoring` and pastes it to you. Save both values into `.env`
at the kit root (gitignored) and continue.

Every call sends `Authorization: Bearer $NAIMI_TOKEN`; bodies are JSON; errors
come as `{ "error": "<human-readable message>" }`. Two recurring ones: `402`
with `code: "limit_exceeded"` is a plan limit (the body names the resource and
numbers — explain it plainly; upgrades live at `<URL>/app/billing`, tenant
admin), and `403` usually means the action needs a tenant admin. Smoke test:

```bash
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" "$NAIMI_URL/api/auth/me"
```

## API map

| Task | Call |
|---|---|
| List templates | `GET /api/templates` |
| Personalization schema of one | `GET /api/templates/:templateId` → `manifest.personalization` |
| Find clients by name | `GET /api/clients?q=<substring>` (case/space-insensitive) |
| Client card + all its presentations | `GET /api/clients/:clientId` |
| Create / update a client | `POST /api/clients`, `PATCH /api/clients/:clientId` — `companyName`, `contactName`, `email`, `phone`, `notes` |
| List/search presentations (incl. stats, shareUrl) | `GET /api/presentations` (`?q=<company substring>` searches server-side) |
| One presentation + its editing schema | `GET /api/presentations/:presentationId` |
| Create a presentation | `POST /api/presentations` (recipe below) |
| Edit a presentation's personalization | `PATCH /api/presentations/:presentationId` (full replace, recipe below) |
| Deal status | `PATCH /api/presentations/:presentationId/status` `{ "status": "in_progress" \| "successful" \| "lost" }` |
| Pre-seed interactive values | `PATCH /api/presentations/:presentationId/data` `{ "data": { "<key>": <value> } }` |
| Upload a picture for an `image` field | `POST /api/personalization-images` (multipart, file field `image`) → `{ url }` |
| Client's own answers (self-fill) | `presentation.clientResponses` on any presentation payload — `{ value, updatedAt }` per key |
| Plan, limits and usage (cloud service) | `GET /api/billing/subscription` |

Mapping user requests: "who viewed it / how many times it was opened" →
`presentation.stats` (`openCount`, `uniqueVisitorCount`, `lastOpenedAt`,
`totalViewSeconds`); "what did the client answer" → `presentation.clientResponses`
(also shown in the service on the presentations list and the client card);
"what do we know about the client" → `client.facts` + the
presentation list from `GET /api/clients/:clientId`; "send me the link" →
`presentation.shareUrl`.

Not supported via the API: deleting presentations or clients — say so instead of
improvising. Deleting a template exists but destroys all of its presentations
(tenant-admin only) — never call it unless explicitly asked.

## Recipe: create a personalized presentation

```
- [ ] 1. Pick the template: GET /api/templates (ask the user if ambiguous)
- [ ] 2. Read its schema: GET /api/templates/:templateId → manifest.personalization
- [ ] 3. Find or create the client: GET /api/clients?q=<name>; reuse client.facts as defaults
- [ ] 4. Fill personalization per the rules below (confirm invented wording with the user)
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

→ `201 { presentation }`. The presentation (`presentation.shareUrl`) works immediately,
no publish step; keep `presentation.id` for later edits. If no matching client exists,
passing `client: {...}` inline creates (or reuses) it automatically.

If this is the user's **first** presentation, close the loop: offer to open
`shareUrl` together so they see exactly what the client will see, and to set up
open notifications (`<URL>/app/notifications`) so they know the moment the
client opens it.

## Recipe: edit an existing presentation

1. Find it: `GET /api/presentations?q=<company>` (server-side company search;
   for other cuts filter the list by `clientName` / `templateName`).
2. `GET /api/presentations/:presentationId` → `{ presentation, personalizationSchema }`.
   The schema belongs to the template revision this presentation actually renders
   (pinned at creation) — edit against it, not against the template list.
3. `PATCH /api/presentations/:presentationId` with
   `{ "companyName": "...", "personalization": { ...the full object... } }`.

**PATCH replaces the whole personalization — there is no merge.** Always take
`presentation.personalization` from step 2, change what's needed and send everything
back. Top-level `companyName` is required. The slug/shareUrl never changes on
edit, so presentations already sent to the client keep working.

## Personalization rules

The schema (`manifest.personalization`) describes the fields:

- `fields`: `[{ key, label, placeholder, type, required }]` — `type` is
  `text | date | textarea | image`; `date` expects `YYYY-MM-DD`. Fill by meaning —
  `label`/`placeholder` explain the intent.
- `type: "image"` — the value is a **URL of an uploaded picture** (e.g. renders of
  the client's future project). When the user gives you an image file, upload it
  first, then pass the returned `url` as the field's value:

```bash
curl -sf -H "Authorization: Bearer $NAIMI_TOKEN" \
  -F "image=@project.webp" "$NAIMI_URL/api/personalization-images"
# → { "imageId": "pimg_...", "url": "/api/personalization-images/pimg_.../image.webp" }
```

  PNG, JPEG or WebP up to 5 MB. Pass the `url` string exactly as returned
  (relative — it resolves on whatever domain the presentation is served from).
  Uploads are write-once: to change the picture, upload a new file and PATCH the
  new URL in; to remove it, send the field with an empty value.
- `companyName` is taken from the client — no need to pass it separately.
- Any field key declared in the manifest is passed at the top level:
  `{ "contactName": "John", "fleetSize": "120 vehicles" }`. Non-standard keys are
  stored as `customFields` — decks resolve both the same way.
- `customFields: [{ key, value }]` — equivalent explicit form; use it for extra
  placeholders when the schema sets `showCustomFields: true`.
- Required schema fields are enforced server-side: missing → HTTP 400 with
  `missingFields: [...]` — fill them and retry.
- `stagesJson` (only when `showStagesEditor: true`): project stages/pricing as a
  JSON **string**; the deck computes totals itself. `rows` is one work item per
  line in the form `Title | Description`:

```json
"[{\"title\":\"Stage 1. Customer-care agent\",\"costRub\":80000,\"rows\":\"CRM integration | Connect to Retail CRM\\nTesting | Validate on real requests\"}]"
```

## Interactive values (demoData)

`manifest.demoData.fields` lists the interactive slide values (calculators,
sliders). They are normally filled by the **manager during the call** and saved
to the presentation then; keys marked `promoteToClientFacts` also land in
`client.facts`. You can pre-seed them before a call via
`PATCH /api/presentations/:presentationId/data`.

Client self-fill (shipped): a field declared with `collectFromClient: true` in
the manifest also captures the **anonymous client's own** input. When the client
opens the presentation and changes such a field, it auto-saves into a separate
`clientResponses` bucket on the presentation — it never overwrites the manager's
interactive values. The manager sees the captured answers in the service (the
presentations list); flagged fields that are also `promoteToClientFacts` land in
`client.facts` too. Whether a field is collectable is a **template** decision (the
manifest), not something you set per presentation — if the user wants to collect a
client's answer, that field must be `collectFromClient` in the template. Fields
without the flag stay manager-only (client input is local, not saved), as before.

## The rest of the service — route, don't improvise

These tasks live in the service UI (most need a tenant admin). Give the user
the page and one plain sentence; don't invent API calls that aren't in the map:

- **Open notifications** ("tell me when the client opens it") —
  `<URL>/app/notifications`: Telegram or an outgoing webhook (JSON + HMAC
  signature — good for integrations), with a test send. Set up per-user.
- **Team** — add managers, change roles: `<URL>/app/users` (tenant admin).
  A manager sees their own clients and presentations; an admin sees everything.
- **Plan & billing** — current plan, usage, upgrade: `<URL>/app/billing`
  (tenant admin). The "Made with Naimi" badge on public presentations can be
  switched off there on paid plans.
- **Custom domain** — presentations on the company's own subdomain:
  `<URL>/app/domain` (tenant admin, business plan).
- **Kit, API tokens, examples gallery** — `<URL>/app/authoring`.

Self-hosted installations may lack the billing and domain pages; if
`GET /api/billing/subscription` returns 404 or an empty plan, don't bring up
plans or limits at all.

## Checklist before replying to the user

```
- [ ] required schema fields filled; date fields are YYYY-MM-DD
- [ ] image fields: file uploaded via POST /api/personalization-images, value = returned url
- [ ] stagesJson is a valid JSON string (decks with showStagesEditor)
- [ ] existing client found via ?q= search (not duplicated); facts reused as defaults
- [ ] edits sent as the FULL personalization object, not a partial patch
- [ ] the link in the reply is presentation.shareUrl from the API response
```
