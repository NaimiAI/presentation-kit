---
name: naimi-template
description: Build or edit a Naimi Web Pres template (reusable presentation) locally — scaffold from the starter or a ready-made deck or from the user's own materials (PDF/PPTX/screenshots/sketch), write slides as plain HTML/CSS/JS over the kit runtime, define per-client personalization fields, add interactive elements and images, preview with mock data. No build step and nothing to install — the working folder is the bundle. Use when creating or changing a template, its slides, design, personalization fields or interactive content. Pair with naimi-publish to zip and upload the result.
---

# Naimi template — build it locally

You are building a **template**: a reusable web presentation a manager will later
personalize per client (see `START-HERE.md` for the Template/Presentation
distinction). A template is a folder of **plain web files** — `index.html` (slides),
`deck.css` (theme + styles), optional `deck.js` (calculations) — on top of the
precompiled runtime `naimi-kit/`, which you **never read or edit**. There is no build,
no npm, no dev environment: **the working folder is the bundle**; publishing zips it
as-is. At runtime it renders in a sandboxed iframe; the runtime handles all host
communication, slide navigation, thumbnails panel and the slides/feed view modes —
never rebuild navigation chrome inside slides.

When it looks right, hand off to **naimi-publish** (`PUBLISH-SKILL.md`).

## How to work with the user

The user is **non-technical**: they give direction ("a commercial offer for a retail
chain with an ROI calculator"); you do everything else and show results (screenshots
or a URL). Never ask them to run commands or edit files. **Reply in their language.**
If something technical fails, fix it silently or explain the impact in one sentence.

Before writing slides, agree three things (and a fourth when the look matters):

1. **Which fields are personalized per client** (company, contact, prices, dates, a
   priced estimate, a special-offer line…) and in what form — these become
   `manifest.json → personalization`.
2. **Whether they have images** (logo, product photos). Real images raise quality far
   more than UI alone — actively ask. See "Images".
3. **Slides or a document, and how it opens.** A deck opens as **slides** (default) or
   as a **scrolling feed** — all sections in one vertical page. The viewer always keeps a
   toggle between both; this only picks the start mode. Genre hint: pitches and offers
   with hero slides → slides; briefs, reports → feed. It changes nothing about how you
   build — it's a template *setting*, applied by **naimi-publish** after upload. But an
   offer, quote, estimate or letter that must print like a Word document is a
   **document** — portrait pages, no toggle at all: see "Document format" below.
4. **The look** — only when the user asks for one ("bolder", "warmer", "more
   premium", "like a poster") or the genre calls for it (marketing and agency pitches,
   launches, invitations, welcome packs): pick an **art pack** — see "Art direction"
   below. Otherwise the deck's own theme is the right answer; don't push art on a sober
   enterprise proposal that never asked for it.

## The kit

This repository **is** the kit: the starter (`template/`), the ready-made decks
(`decks/`) and these skills. Nothing to install, nothing to build. If the session
runs outside a clone, get one:

```bash
git clone https://github.com/NaimiAI/presentation-kit.git
```

No account and no credentials are needed for anything in this skill — building and
previewing are fully local (see `START-HERE.md` → "Connected or local-only?").

Create the working folder **inside the current workspace** (the directory your
session runs in), not in `~/Downloads` — otherwise the preview server can't serve
it. It can live inside the clone (`my-presentation/` is gitignored) or next to it.

## Starting points

Paths are relative to the kit root (the folder holding this file).

```bash
# A) from scratch (starter: 3 example slides)
cp -R template my-presentation

# B) from a ready-made deck (table below) — deck + runtime:
cp -R decks/<id> my-presentation
cp -R template/naimi-kit my-presentation/naimi-kit

# either way, the deck's own docs don't belong in the working folder:
rm -f my-presentation/README.md
```

On Windows translate: `Copy-Item -Recurse`, `Remove-Item`.

Both starting points are already in **bundle form** — `index.html`,
`manifest.json`, `mock/state.json` and `naimi-kit/` in one folder: preview it as
is, publish it as is.

**C) from the user's materials** — same as A, then rebuild their PDF/PPTX/site/
screenshots/sketch as slides. **Extract their images first** — read the source with
your own eyes for the content, but the pictures have to travel as files:

```bash
node tools/ingest-source.mjs <their-file.pdf>   # .pptx and images too
```

It writes web-ready pictures into `assets-src/` with a `manifest.json` and page
previews (`assets-src/pages/`), handling what is invisible on a rendered page:
transparency masks (a white logo comes out empty without them), CMYK, the same logo
repeated on every page, full-page photos that unpack into multi-megabyte files. Then
**copy** what the deck needs into `assets/` with meaningful names — `cp`/`mv` only,
never re-create an image by hand. Charts, diagrams and decorative shapes are
deliberately not extracted: rebuilding those in HTML/CSS is the point of a web deck.

The script needs `poppler` and `ImageMagick`; if they are missing it prints the one
install command for the platform. Can't install them? Ask the user to send the photos
and the logo as separate files — never ship a deck full of placeholders in silence.

The service only cares that the final ZIP validates.

When starting from a deck (B), change `id` and `name` in `manifest.json` unless the
user explicitly wants to update that existing template.

### Ready-made decks (in `decks/`)

Each is a complete deck (slides + `manifest.json` + `mock/state.json` [+ `assets/`])
showing a genre and a style of personalization (details in each deck's `README.md`):

| Deck id | Genre | Key mechanic |
|---|---|---|
| `proposal-mono` | universal service proposal (Swiss monochrome: white/black/red, hard rules) | priced estimate via the stages editor, proposal number/dates/validity; no interactive fields |
| `studio-proposal` | proposal document (serif "paper" theme) | priced estimate via the stages editor, dates, signature block |
| `case-study` | customer success story (editorial tech-magazine, electric blue) | static customer story + prospect personalization ("their pains" sidebar); savings-projection slider self-filled by the prospect and promoted to the client card |
| `qbr-report` | quarterly business review (graphite & emerald dashboard) | KPI grid and trend chart parsed from simple text fields; client rating/feedback self-fill promoted to CRM |
| `pilot-results` | pilot/POC results report | live before/after metrics, SVG chart, facts promoted to the client card |
| `saas-pitch` | product pitch (dark neon) | plan / seats / billing choice saved on the presentation |
| `investor-pitch` | startup fundraising pitch (light "aurora glass": pastel lavender, frosted cards) | ticket slider → share of round/company (promoted to the client card), SVG traction chart, founder photos, per-investor "why you" note |
| `service-configurator` | interactive price list (mint theme) | service checkboxes, bundle discount, live total |
| `client-onboarding` | new-client welcome pack | 30-day plan from a kickoff date, team with photos, external links |
| `event-invite` | event invitation (poster) | RSVP, add-to-calendar and video links |
| `event-invite-noir` | the same invitation on the dark `noir-lime` theme (outlined type, no art pack) | same as `event-invite` |
| `sponsor-package` | event sponsorship offer (velvet night poster: aubergine + amber) | tier picker saved on the presentation; benefits matrix highlights the chosen tier; booking deadline |
| `design-brief` | design-studio brief (gallery serif editorial, hairlines, Klein blue) | self-fill: underline textareas, photographic moodboard multi-select, deliverables checklist, budget/deadline chips |
| `b2b-services` | B2B consulting presentation (dark premium "navy & gold", serif) | painPoints textarea → "what we heard" list; priority-practice picker saved as an interactive field |
| `kitchen-remodel` | B2C kitchen remodel proposal (warm interior: cream/terracotta/sage, serif) | full configurator — linear feet + cabinet line + countertop → live price with financing line; client self-fill of budget and timeline |
| `franchise-offer` | franchise offer (light "growth green") | payback calculator: avg ticket + daily customers sliders → monthly profit and payback, promoted to the client card |
| `job-offer` | job offer to a candidate (warm "sunrise"; the client is the candidate) | total comp (base / equity / benefits); the candidate answers right in the offer: accept/questions chips + a question box (`collectFromClient`) |
| `listing-presentation` | home tour for a buyer (estate linen: hunter green + brass, serif) | nearby sales from a text field with an automatic price check; three purchase paths sharing one adaptive calculator, both promoted to the client card; four-frame photo tour; buyer self-fill move timeline |
| `photography-package` | wedding photography packages (fine-art gallery ivory) | portfolio-led; the couple picks the package and add-ons themselves (client self-fill), live total with tier include-logic |
| `renovation-estimate` | **document** (Letter): remodel estimate, engineering form | labor and materials tables from text fields with sections, summary with discount, payment schedule, client approval + comment |
| `service-quote` | **document** (Letter): managed services quote, corporate | service blocks from the stages editor, two SLA tiers the client picks in the document, onboarding plan |
| `price-quote` | **document** (Letter): supplier's quote as a letter on letterhead | salutation and letter body from fields, itemized quote with discount, sales tax and the amount in words, product cards with pictures, terms |

The offer-style decks (`proposal-mono`, `studio-proposal`) set
`personalization.showStagesEditor: true`, which makes the presentation form show a
stages/pricing editor.

To let the user **see** what's possible before choosing, hand out the live example
links from the kit's `README.md` — one per ready-made deck, no account needed. With
credentials set up, `GET $NAIMI_URL/api/template-gallery` (Bearer) lists the same
published examples with `previewUrl` links — also browsable at `<URL>/app/authoring`.

## The format — read `template/README.md`

The full format reference lives in the kit: **`template/README.md`** — declarative
attributes (`data-nk-text`, `data-nk-field`, `data-animate`, `data-stagger`…), the
`deck.js` API (`naimi.ready`, `kit.field`, `kit.onChange`…), themes/tokens, and format
rules. Read it once before writing slides; don't guess attribute names. Non-negotiables
you must apply from the start:

- **Slide grammar.** A slide is a direct `<section>` child of `<main id="deck">`; DOM
  order = show order. Before each section a marker comment `<!-- Slide N — Title -->`,
  on each section a stable unique
  `data-nk-slide="name"` (kebab-case; it's a name, not a number — never renumber on
  reorder: the service's per-slide analytics and slide links key on it). **To edit
  one slide, don't read the whole file**: grep the marker or `data-nk-slide`, read
  that range, edit in place.
- **Section = page.** One section is one screen, one PDF page, one future PPTX slide.
  Don't emulate pages inside a section or design visual joins between sections.
- **Final view is the DOM/CSS default.** Without animations a slide must already look
  finished; never hide content with your own CSS until an animation reveals it. All
  entrance animation goes through the runtime (`data-animate`/`data-stagger`). Any
  continuous motion by other means — own `@keyframes`, timers/`requestAnimationFrame`
  in `deck.js` (ticking counters), autoplay video/gif — only behind the guard: CSS in
  `@media (prefers-reduced-motion: no-preference)`, JS only when
  `naimi.static === false`, video with a poster. Otherwise PDF export prints a random
  frame. Hover transitions need no guard.
- **Text stays text** — real DOM text nodes, never baked into images (PDF/PPTX export
  reads them). Icons are inline SVG.
- **No CDNs, no absolute URLs, no `data:` images** — fonts and images are files inside
  the folder (strict viewer CSP; enforced at publish).

## Document format — portrait pages

Some things a sales team sends were never slides: a commercial offer with a priced
estimate, a quote, a cost breakdown, a cover letter with attachments — the PDFs they used
to make in Word. For those build a **document**, not a deck: portrait pages on a sheet,
read by scrolling, exported as A4 / Letter pages. Everything else stays the same —
personalization, interactive fields, client actions, publishing.

**Choose it when** the user says "offer / quote / estimate / calculation / letter", when
the content is mostly text and tables, or when the result must print like a Word document.
Pitches, product stories and anything with hero screens stay slides.

**How it differs from a deck** (the full reference is in `template/README.md`):

- `<main id="deck" data-nk-format="document" data-nk-page="a4">` (`letter` for the US);
  markers read `<!-- Page N — Title -->` and a section is a **page**: it starts a new
  printed page and may run onto the next one — a long table just continues. There is no
  slides/feed toggle and no thumbnails panel; the reader scrolls a stack of sheets.
- The sheet has a **fixed width** (794 px for A4, 816 px for Letter) — design for that width,
  not for the screen; give the section its own padding (the margins) and a footer; the
  only breakpoint you need is a phone one (`max-width: 767px`).
- Tables and blocks are print-aware: `thead { display: table-header-group }` repeats the
  header on every page, `tr, .card { break-inside: avoid }` keeps rows whole. Don't print
  page numbers in the footer — a page can span two printed pages; name the section instead.
- Long tables come from **text fields**: one line per row, columns separated by `|`
  (`Item | unit | qty | price`), a `# Section` line opens a group; `deck.js` parses and
  totals them. The stages editor (`showStagesEditor`) works too when blocks have a price.
- Screenshots: `?nk-static=1` shows the sheets on the desk; the PDF prints the same sheets
  as pages. The template cover is a 1280×720 screenshot of that desk view.

**Start from a document deck**, not from the slide starter: `renovation-estimate` (a
priced estimate with sectioned tables), `service-quote` (a monthly service with two tiers the
client picks), `price-quote` (a cover letter on letterhead with an itemized quote).
Copy one and rewrite the content — the print rules and the table parsers are already there.

## manifest.json contract

```json
{
  "schemaVersion": "naimi.presentation.v1",
  "id": "retail-roi-offer",
  "name": "Retail ROI offer",
  "description": "Commercial offer with a benefit calculator",
  "entry": "index.html",
  "preview": "preview.webp",
  "personalization": {
    "fields": [
      { "key": "companyName", "label": "Company", "type": "text", "required": true },
      { "key": "contactName", "label": "Contact", "type": "text" },
      { "key": "projectPhoto", "label": "Project photo", "type": "image" }
    ],
    "showCustomFields": false
  },
  "demoData": {
    "namespace": "retailRoi",
    "fields": [
      { "key": "monthlyVisitors", "label": "Monthly visitors", "type": "number", "defaultValue": 10000, "promoteToClientFacts": true },
      { "key": "clientBudget", "label": "Client budget", "type": "number", "defaultValue": 0, "collectFromClient": true, "promoteToClientFacts": true }
    ]
  }
}
```

- `schemaVersion` exactly as above; `id` (kebab-case latin) and `name` non-empty.
- `personalization.fields` **must include `companyName`**. Types: `text | date |
  textarea | image`. Every `data-nk-text` key is declared here.
- `type: "image"` — a **per-client picture** (e.g. renders of the client's project).
  The manager uploads it in the "create presentation" form; the value arrives as a
  platform-hosted URL string (allowed by the CSP). In slides use it as `<img src>`;
  hide the block or show a bundled fallback when empty. For preview put any URL in
  `mock/state.json`.
- `demoData.fields` declares every `data-nk-field` / `kit.field` key. Types: `string |
  number | boolean`. `promoteToClientFacts: true` copies the value to the client's CRM
  card (pre-fills their next presentation). `collectFromClient: true` opts the field
  into **client self-fill** (below).
- Keys match `^[A-Za-z][A-Za-z0-9_.:-]{0,63}$`. `preview` — optional cover path
  (see "Cover"). `showCustomFields: true` lets the manager add free extra
  placeholders; `showStagesEditor: true` adds a stages/pricing editor to the form.

### Personalization vs interactive data

- **`personalization`** — filled by the *manager* when creating a presentation;
  static for that client (company, contact, prices, offer wording).
- **`demoData`** — interactive values in slides (sliders, pickers, calculators).
  Persisted only when a logged-in manager is presenting; an anonymous client can move
  the controls but changes stay local.
- **Client self-fill (`collectFromClient: true`)** — the anonymous client's own input
  on that field is captured into a separate `clientResponses` bucket (never
  overwrites the manager's values); the manager sees the answers in the service, and
  with `promoteToClientFacts` they land on the CRM card too. A returning client sees
  their own answers. Flag only inputs you actually want back (qualifiers, budgets,
  preferences).

### Client actions

Mark the deck's **response mechanics** — accept the offer, RSVP, choose a package,
sign, "I have questions" — with `data-nk-action="name"` on the clickable element
(kebab-case by meaning: `accept`, `rsvp-yes`, `package-select`, `sign`). The click is
reported to the platform as a semantic event (notifications like "client accepted"
build on it). Combine freely with `data-nk-field` on the same element.

## Images

- **Building from the user's PDF/PPTX? Their images are already in it** — run
  `node tools/ingest-source.mjs <file>` (see "Starting points" C) instead of asking
  for files they think you already have.
- The user drops files in; you place them in `assets/` and reference by relative path.
  Same picture for every client → bundle asset; per-client picture → `image`
  personalization field. Never CDN, never `data:`.
- **Control the weight**: downscale to displayed size (~2000px max), prefer WebP.
  Limits: ≤250 files, ≤5 MB per file, ≤40 MB total — but on the cloud service the ZIP
  also counts against the **plan storage allowance** (tight on free): oversized images
  are the usual cause of a later `402 limit_exceeded`.

## Art direction — the art packs

`art/` is a library of ten **art packs**: ready-made art directions any deck can
wear regardless of its genre — a palette and display face, CSS/SVG devices, a roster of
picture plates in one physical technique (cyanotype photograms, risograph prints,
copperplate engraving, sticker collage, Swiss poster, constructivist montage, clay
renders, paper-cut, charcoal sketches, painted skies) and the recipe to make more in
that style. Read **`art/README.md`** once — the packs table, the shared class
interface, the rhythm rules, the apply recipe — then only the chosen pack's
`art/<id>/STYLE.md`. Don't browse the other packs.

Match the pack to the **spirit** of the deck (`STYLE.md` → Fits / Avoid): the loud packs
(`sticker-pop`, `poster-swiss`, `constructivist`) suit short marketing pitches; the
calm ones (`cyanotype`, `engraving`, `charcoal`, `sky-oil`) suit proposals a serious
buyer reads; `riso`, `clay-3d`, `papercut` sit in between. Offer the user two
candidates in plain words ("a calm blueprint look, or a warm printed-poster look?") —
never the catalog.

Apply it as the README says: `cp -R art/<id>/pack my-presentation/assets/art`, link `assets/art/theme.css` **before**
`deck.css`, set `data-theme="<id>"` on `<html>`, then compose the deck's **rhythm** — a
loud cover on the hero plate, quiet paper slides, one or two accents (a band, a half
plate, a spot), a loud close. Never two loud slides in a row; plates never carry text
(headlines and numbers stay HTML on top); the user's own photos join through
`.art-duotone` / `.art-sticker`; delete the plates the deck doesn't use before
publishing. Then check every slide in the static render (`?nk-static=1`): a plate hiding text or a headline wrapping under a scrim are the usual defects.

A subject the pack's plates don't cover (the client's product, their warehouse) can be
made in the pack's style with `node tools/art-generate.mjs --pack <id> --subject "a
delivery van"` — it needs an image model (`GEMINI_API_KEY`, or `GOOGLE_CLOUD_PROJECT` for
Vertex AI), builds the prompt from the pack's recipe, cuts a spot out and writes the
WebP into `assets/art/plates/`; see `art/README.md` → "Generate more in this style". One
or two per deck, a concrete object, never text in the picture.

## Preview

Serve the folder with any static server (from file:// the mock won't load):

```bash
python3 -m http.server 4173 -d my-presentation
# or: npx -y http-server my-presentation -p 4173
```

- Edit `mock/state.json` to preview realistic personalization/clientFacts;
  `canPersist: true` simulates manager mode (patches are logged to the console).
- **Screenshots: append `?nk-static=1`** — every slide renders instantly in its final
  state, no animation timing to wait out. ArrowRight advances slides.
- Embedded preview panes often keep the tab hidden — animations and timers freeze
  there. Screenshot with `?nk-static=1`; judge motion in a real browser tab — give the
  user the URL, they see the live version.
- Check every slide at desktop and once at a narrow viewport (~390px wide). If the
  feed start mode was agreed, also review the deck in feed view (the mode toggle in
  the top-left chrome).

## Cover

The template card shows `manifest.preview`. Screenshot the **current first slide** at
~1280×720, save as `preview.webp` in the folder root, set `"preview": "preview.webp"`.
Optional — skip it (and drop the key) rather than ship a stale cover; the manager can
upload one later. Never block publishing over it.

## Hand-off

When every slide renders and the user is happy, switch to **naimi-publish**
(`PUBLISH-SKILL.md`). Tell the user to **keep the working folder** — the service
stores the bundle, not your editing convenience; future edits start from these files.

```
- [ ] manifest: id/name set, companyName present, every data-nk-field key declared
- [ ] slide grammar: marker comment + unique data-nk-slide on every section
- [ ] texts read personalization (no hardcoded client names); actions marked data-nk-action
- [ ] images local, lean; no CDN / data: / absolute URLs
- [ ] art pack (if used): scrim over every bleed plate, no two loud slides in a row, unused plates deleted
- [ ] built from a client's PDF/PPTX → their own images are in the deck (ingest-source),
      not placeholders
- [ ] continuous motion (if any) behind the reduced-motion / naimi.static guard
- [ ] every slide actually rendered in preview (desktop + narrow), console clean
- [ ] every slide fits the desktop frame (1600×900) with nothing under the engine's bottom
      bar and no frame scroll — size giant display type from the height too (`min(vw, vh)`)
- [ ] cover captured from the current first slide (or intentionally skipped)
- [ ] start mode agreed (slides / scrolling feed) — naimi-publish applies it; not for documents
- [ ] document: every page reviewed in the static render, long tables continue cleanly,
      footers carry no page numbers, breakpoints only below 768px
```
