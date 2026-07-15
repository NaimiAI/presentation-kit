---
name: naimi-template
description: Build or edit a Naimi Web Pres template (reusable presentation) locally — scaffold from the starter or a ready-made deck or from the user's own materials (PDF/PPTX/screenshots/sketch), write slides, define which fields get personalized per client, add interactive elements and images, and preview locally with mock data and the component gallery. Use when creating or changing a template, its slides, design, personalization fields or interactive content. Pair with naimi-publish to build and upload the result.
---

# Naimi template — build it locally

You are building a **template** for Naimi Web Pres: a reusable web presentation a
manager will later personalize per client (see `START-HERE.md` for the big
picture and the Template/Presentation distinction). A template is a small React app — same
stack as the product's own decks (React + Vite + Tailwind 4 + framer-motion) —
that is later built into a static ZIP and uploaded. At runtime it renders inside
a sandboxed iframe and talks to the host only through a postMessage SDK that the
kit already wires up.

This skill covers building and previewing the template **locally**. When it looks
right, hand off to **naimi-publish** (`PUBLISH-SKILL.md`) to build, validate and
upload it.

## How to work with the user

Assume the user is **non-technical**. They give direction ("make a commercial
offer for a retail chain with an ROI calculator"); you do everything else —
environment, slides, content, preview. **Never** ask them to run commands, edit
files or "start the dev server"; do it yourself and show results (screenshots or
a URL). Talk slides, themes and content — not npm, Vite or React. **Reply to the
user in their own language — whatever language they write to you in.** When
something technical fails, fix it silently or explain the impact in one plain
sentence.

Before writing slides, agree two things with the user:

1. **Which fields get personalized per client** (company name, contact, prices,
   dates, a priced estimate, a special-offer line…) and in what form — these
   become the `personalization` block in the manifest.
2. **Whether they have images** (logos, product photos, illustrations). Real
   images raise quality far more than UI alone — actively ask for them. See
   "Images" below.

## Step 0 — environment (Node)

Building a template needs **Node.js >= 20.19** and nothing else global. Before any
setup run `node -v` (don't assume it exists):

- Version >= 20.19 → proceed.
- Missing or too old → install it for the user (with their consent, the standard
  way for their OS): macOS — `brew install node` or the installer from
  nodejs.org; Windows — `winget install OpenJS.NodeJS.LTS` or the nodejs.org
  installer; Linux — distro package or nvm. Then re-check `node -v` (a new
  terminal/session may be needed for PATH).

Shell commands here are bash/zsh. On **Windows** translate them: PowerShell uses
`Copy-Item -Recurse src dst` instead of `cp -R`, `$env:NAIMI_URL = "..."` instead
of `export NAIMI_URL=...`. `npm`, `npx`, `node`, `curl` work the same everywhere.

## Get the kit

If you are reading this file, the kit is most likely already here — this
repository **is** the kit (`template/` + `decks/` + the skills). If a copy is
needed elsewhere, clone it:

```bash
git clone https://github.com/naimi-ai/presentation-kit.git
```

No account or credentials are needed for anything in this skill — building and
previewing is fully local (see `START-HERE.md` → "Connected or local-only?").

**Create the working folder inside the current workspace** (the directory your
session runs in) — not in `~/Downloads` or another outside path, or the preview
tooling won't be able to serve it.

## Starting points

Paths below are relative to the kit root (the folder holding this file); if the
session runs elsewhere, prefix them with the path to the kit. The working copy
can live inside the kit clone (`my-presentation/` is gitignored) or next to it.

```bash
# A) from scratch
cp -R template my-presentation
cd my-presentation && npm install

# B) based on a ready-made template (see the table below). Copy the template,
#    then overlay the deck:
cp -R template my-presentation
rm -rf my-presentation/src/slides
cp -R decks/<id>/slides        my-presentation/src/slides
cp    decks/<id>/manifest.json my-presentation/public/manifest.json
cp    decks/<id>/mock.json     my-presentation/mock/state.json
cp    decks/<id>/preview.webp  my-presentation/public/preview.webp  # cover; re-capture if you change slides (see "Cover image")
cp -R decks/<id>/assets/.      my-presentation/src/assets/          # if assets/ exists — merge, don't replace
cd my-presentation && npm install
```

**C) from the user's materials** — same as A, then rebuild their PDF/PPTX/site/
screenshots/sketch as slides. The service doesn't care how the deck was made,
only that the final ZIP passes validation.

When starting from a deck (B), change `id` and `name` in `public/manifest.json`
**unless the user explicitly wants to update that existing template**.

### Ready-made templates (in `decks/`)

Each is a drop-in deck (slides + `manifest.json` + `mock.json` [+ `assets/`]);
each shows a different genre and a different style of personalization (details in
the `README.md` inside each deck):

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
| `sponsor-package` | event sponsorship offer (velvet night poster: aubergine + amber) | tier picker saved on the presentation; benefits matrix highlights the chosen tier; booking deadline |
| `design-brief` | design-studio brief (gallery serif editorial, hairlines, Klein blue) | self-fill: underline textareas, photographic moodboard multi-select, deliverables checklist, budget/deadline chips |
| `b2b-services` | B2B consulting presentation (dark premium "navy & gold", serif) | painPoints textarea → "what we heard" list; priority-practice picker saved via useDemoField |
| `kitchen-remodel` | B2C kitchen remodel proposal (warm interior: cream/terracotta/sage, serif) | full configurator — linear feet + cabinet line + countertop → live price with financing line; client self-fill of budget and timeline |
| `franchise-offer` | franchise offer (light "growth green") | payback calculator: avg ticket + daily customers sliders → monthly profit and payback, promoted to the client card |
| `job-offer` | job offer to a candidate (warm "sunrise"; the client is the candidate) | US total comp (base / equity / benefits); candidate answers right in the offer: accept/questions chips + a question box (collectFromClient) |
| `listing-presentation` | real-estate listing presentation (estate linen: hunter green + brass, serif) | comps table from a text field; pricing-strategy picker + net-proceeds calculator promoted to the client card; seller self-fill timeline |
| `photography-package` | wedding photography packages (fine-art gallery ivory) | portfolio-led; the couple picks the package and add-ons themselves (client self-fill), live total with tier include-logic |

The offer-style decks (`proposal-mono`, `studio-proposal`) set
`personalization.showStagesEditor: true`, which makes the presentation form show
a stages/pricing editor.

To let the user **see** what's possible before choosing, hand out the live
example links from the kit's `README.md` — one per ready-made template, no
account needed. If credentials are set up, `GET $NAIMI_URL/api/template-gallery`
(Bearer auth) lists the same published examples with `previewUrl` links — also
browsable at `<URL>/app/authoring`.

## Workflow

```
- [ ] 0. node -v >= 20.19 (install if needed)
- [ ] 1. Working copy inside the workspace (template, or deck overlay) + npm install
- [ ] 2. Manifest: public/manifest.json — id, name, personalization fields,
        demoData keys (agree the personalized fields with the user first)
- [ ] 3. Pick a theme (data-theme in index.html); show options from the gallery (/#gallery)
- [ ] 4. Add images the user provided into src/assets/ (see "Images")
- [ ] 5. Write slides in src/slides/, set order in src/slides/index.ts
- [ ] 6. Local preview — render every slide, show the user; iterate until happy
- [ ] 7. Cover image: screenshot the first slide → public/preview.webp + set "preview"
- [ ] 8. Hand off to naimi-publish to build, validate and upload
```

## File map

| Path | Purpose |
|---|---|
| `src/slides/` | **Slides — your main workspace.** Order in `src/slides/index.ts` |
| `public/manifest.json` | Presentation passport (contract below) |
| `mock/state.json` | Fake host state for local preview (personalization, clientFacts) |
| `src/assets/` | Images and fonts — local files only |
| `index.html` | `data-theme` attribute selects the theme preset |
| `src/theme.css` | Design tokens + theme presets; extend or add presets here |
| `src/kit/` | Runtime (player, SDK, components). **Do not edit** |

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

Rules:

- `schemaVersion` must be exactly `naimi.presentation.v1`; `id` and `name` non-empty.
- `personalization.fields` **must include `companyName`** (the manager fills these
  when creating a presentation). Field types: `text` | `date` | `textarea` | `image`.
- `type: "image"` — a **per-client picture** (e.g. renders of the client's future
  project in an architecture proposal). The manager uploads the file right in the
  "Create presentation" form; the field's value arrives in `personalization` as a
  URL string (platform-hosted, allowed by the viewer CSP). In slides treat it as a
  plain string: `personalizationValue(personalization, 'projectPhoto')` → use as
  `<img src>`; when empty, hide the block or show a bundled fallback image. For
  local preview put any image URL (or a data: URL) into `mock/state.json`.
- `demoData.fields` declares every key used with `useDemoField`. Types: `string`
  | `number` | `boolean`. `promoteToClientFacts: true` carries the value into the
  client's CRM card, so the next presentation for that client starts from it.
  `collectFromClient: true` (default `false`) opts the field into **client
  self-fill**: when an anonymous client opens the presentation, their input on that field
  is captured (see the section below). A field can set both flags — then a
  client's own answer also lands on the CRM card.
- Keys match `^[A-Za-z][A-Za-z0-9_.:-]{0,63}$`.
- `preview` (optional) — path to the cover inside the bundle (e.g. `preview.webp`,
  ~16:9, light WebP); the file **must live in `public/`**. See "Cover image".

### How personalization vs interactive data behave (important)

- **`personalization`** — values the *manager* fills when creating a presentation
  (company, contact, prices). Static for that client's presentation.
- **`demoData`** — interactive values inside slides (sliders, pickers,
  calculators) via `useDemoField`. By default these persist **only when a manager
  is presenting** (logged in); an anonymous client can move the controls but the
  changes stay local. Use plain `demoData` for "the manager configures this live
  on the call".
- **Client self-fill (`collectFromClient: true`)** — opt a `demoData` field into
  capturing the **anonymous client's own** input. When the client (no login)
  changes such a field, it auto-saves into a **separate** `clientResponses`
  bucket on the presentation — it **never** overwrites the manager's `demoData`. The
  manager sees the captured answers on the presentations list in the service; if the field is also
  `promoteToClientFacts`, the client's answer lands on the CRM card too. A
  returning client sees their own previous answers pre-filled. Use this for "ask
  the client a question and keep their reply" (qualifiers, preferences, a number
  they know better than you). Non-flagged fields keep the local-only behavior
  above, so flag only the inputs you actually want back.

## Slide API

Slides are plain React components receiving `{ personalization }`:

```tsx
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { Badge, Card, GradientText, Kicker, RangeField, SlideShell, StatCard } from '../kit/components'
import { useDemoField } from '../kit/hooks'
import { personalizationValue } from '../kit/host'
import type { SlideProps } from './index'

export default function SlideX({ personalization }: SlideProps) {
  const companyName = personalization.companyName.trim() || 'your company'
  const contact = personalizationValue(personalization, 'contactName')  // direct key or customFields

  // image-type field: the value is a URL string of the uploaded picture ('' if none).
  const projectPhoto = personalizationValue(personalization, 'projectPhoto')
  // ...render conditionally: {projectPhoto && <img src={projectPhoto} alt="" />}

  // Interactive value: persisted to the presentation when a manager presents.
  // Resolution: live edits → demo.demoData → client.facts → defaultValue.
  const [visitors, setVisitors] = useDemoField<number>('monthlyVisitors', { defaultValue: 10000 })
  // ...
}
```

Kit components (all theme-token driven — preview them in the gallery):
`SlideShell` (slide wrapper: orbs/center/width), `Orbs`, `GradientText`, `Badge`,
`Kicker`, `Card` (default/accent/positive/critical), `StatCard`, `LogoRow`,
`RangeField` (slider+input for calculators), `BulletItem`.

You are not limited to these — any React/Tailwind/framer-motion code works. For
themability prefer token utilities (`bg-surface`, `bg-card`, `text-ink`,
`text-ink-soft`, `text-ink-faint`, `border-edge`, `text-accent-ink`,
`bg-accent-soft`, `text-positive-ink`, `font-display`) over hardcoded colors.

## Themes and the gallery

Three presets in `src/theme.css`: `naimi-light` (the product's native style:
slate + sky/violet/pink gradient), `naimi-dark` (dark studio), `editorial` (warm
paper, serif display font). Set via `data-theme` on `<html>` in `index.html`.

The dev server's `/#gallery` route shows every component in every theme — use it
to show the user design options before building slides; switching the preset
restyles the whole deck. For a custom design, add a preset in `theme.css` (copy a
block, change the `--nk-*` variables). **Add new presets at the end of the
file**: the default block uses `:root, [data-theme='naimi-light']` and has the
same specificity as your preset, so source order decides which wins.

## Images

Images make the difference between a real presentation and a wall of UI boxes —
ask the user for them and use them generously.

- The user **drops image files into the working folder** and tells you which
  slide each one belongs on (or describes what they want and you can generate
  them). Don't expect them to edit anything.
- Put images as **local files in `src/assets/`** and `import` them — never CDN
  URLs, never `data:` inlining (the iframe CSP forbids both; enforced at publish).
  The one exception: values of `type: "image"` personalization fields — those are
  per-client uploads hosted by the platform itself, and their URLs pass the CSP.
  Rule of thumb: **same picture for every client → bundle asset; picture that
  changes per client → `image` personalization field.**
- **Control the weight.** Per-file limit is 5 MB and total unpacked is 40 MB, but
  aim far lower — downscale to the size actually displayed (e.g. ~2000px max),
  prefer WebP, compress without visible quality loss. Large hero photos are the
  usual cause of a bloated bundle.
- On the cloud service the built ZIP also counts against the tenant's **plan
  storage allowance** (tight on the free plan) — oversized images are the usual
  reason an upload later fails with `402 limit_exceeded`. Lean images now save
  that round-trip.

## Local preview

Always preview before handing off — a deck that was never rendered usually has at
least one broken slide. `npm run dev` renders the deck with `mock/state.json`
standing in for the host; edit it to preview realistic personalization/
clientFacts. `canPersist: true` in the mock simulates manager mode; demoData
patches are logged to the console instead of being sent.

Port rules:

- The template's `vite.config.ts` honors the `PORT` env var (preview tooling
  injects it) and fails loudly if that port is busy. Without `PORT`, Vite starts
  on 5173 and **silently moves to 5174+** if busy — never assume the port; read
  the actual URL from Vite's startup output.
- Run one dev server at a time; stop the previous one before starting another.

**With Claude Code preview tools** (`preview_start` etc.), don't run Vite via
Bash. Create `.claude/launch.json` at the **workspace root** (the folder the
session runs in — not inside the presentation folder), with a **relative** `cwd`:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "deck", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "cwd": "my-presentation", "port": 5173, "autoPort": true }
  ]
}
```

Then `preview_start("deck")` and verify with a screenshot of each slide. A
**blank white page** means the preview proxy and Vite disagree on the port —
check that `vite.config.ts` still contains the `server.port = PORT` block (old
template copies lack it; add it back), stop the server and restart.

**Without browser tooling**: start `npm run dev` in the background, take the real
URL from its output and give it to the user ("open this link in your browser"),
then iterate on their feedback. Local preview is a temporary convenience —
nothing from the dev setup ships; the published deck runs on the service.

## Cover image

The template card in the manager UI shows a cover from `manifest.preview` (a
file inside the bundle). It's **optional** (placeholder otherwise, and the
manager can upload one later), but a real cover is much better and you can make
one for free **while you're already rendering slides in preview**:

1. With the deck running, screenshot the **first slide** at ~16:9
   (`preview_screenshot` at ~1280×720, or any viewport-capturing browser tool).
   Don't reuse a deck's shipped `preview.webp` if you changed the slides — it
   would be stale; always re-capture from the current first slide.
2. Save it as `public/preview.webp` (or `public/preview.png`). It must live in
   `public/` so Vite copies it into `dist`/the ZIP.
3. Set `"preview": "preview.webp"` (matching the filename) in `public/manifest.json`.

If your agent has **no screenshot tooling**, skip this — leave `preview` out of
the manifest rather than shipping a stale cover, and tell the user they can
upload a cover on the template card later. Never block publishing over it.

## Rules that shape how you build (enforced at publish)

These are checked by server validation + the iframe CSP, so build with them from
the start (full enforcement details are in `PUBLISH-SKILL.md`):

- **No CDNs** anywhere — scripts, styles, fonts, images. Inter ships as a file;
  new fonts/images go to `src/assets/` as files.
- **No `data:image` inlining** — keep `assetsInlineLimit: 0` in `vite.config.ts`.
- Keep `base: './'` in `vite.config.ts` (assets serve from a nested path).
- **No direct network/API/cookies/localStorage** — only the kit hooks.
- Limits: ≤250 files, ≤5 MB per file, ≤40 MB unpacked.

## Hand-off

When every slide renders and the user is happy, switch to **naimi-publish**
(`PUBLISH-SKILL.md`) to build, validate and upload. Don't run the build/upload
from here — keep that context separate.

If there are **no service credentials** yet (`NAIMI_URL`/`NAIMI_TOKEN` absent
from the environment and `.env`), this is the natural moment for the one-line
free-account offer from `START-HERE.md` → "Connected or local-only?" — the deck
is done and publishing is the thing an account unlocks. If the user passes,
that's fine: the deck keeps working locally and can be published any time later.

Tell the user to **keep this working folder**: the service stores only the
built bundle, not the sources — future edits to this template start from these
local files.

## Checklist before hand-off

```
- [ ] manifest.json: id/name set, companyName in personalization.fields,
      every useDemoField key declared in demoData.fields
- [ ] slides read companyName from personalization (no hardcoded client names)
- [ ] interactive values go through useDemoField only
- [ ] images/fonts are local files in src/assets/; no CDN; no data:image
- [ ] every slide was actually rendered in local preview
- [ ] cover captured from the current first slide (or intentionally skipped)
```
