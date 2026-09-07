# Art packs — a library of art directions for decks

A deck has two independent axes. **Genre** is what the ready-made decks in `decks/`
give you: the slides, the mechanics, the personalization. **Art direction** is what an
**art pack** gives you: a palette and a display face, a set of CSS/SVG devices that need
no images, a roster of ready-made picture plates in one physical technique, and the
recipe to generate more pictures in that same style. Any genre can wear any pack;
a pack never carries content.

Every pack is rooted in a real technique with physical artifacts — brush edges,
misregistration, plate tone, paper fiber, brushwork — because that is what makes art
read as *made* rather than *generated*. The plates were produced from prompts that name
the process, not the mood; the same prompts ship in each `pack.json` so new plates stay
consistent.

## Packs

| id | Name | Technique | Spirit | Fits |
|---|---|---|---|---|
| `cyanotype` | Blueprint | cyanotype photograms, Prussian blue on watercolor paper | calm, premium | consulting and B2B proposals, partnerships, reports |
| `riso` | Pressroom | risograph prints, three spot inks on cream stock | warm, human | agencies, founders, onboarding, community |
| `engraving` | Atlas | copperplate engraving, indigo ink on laid paper | editorial, explanatory | product walkthroughs, professional services, heritage brands |
| `sticker-pop` | Sticker pop | zine sticker collage on an acid-yellow field | loud, young | creative and marketing agencies, youth brands, short pitches |
| `poster-swiss` | Poster | Swiss poster — giant type, b/w photo, one electric blue, brush marks | bold, confident | launches, marketing and media proposals, manifestos |
| `constructivist` | Constructor | 1920s constructivist photomontage — red, black, cream | bold, industrial | manufacturing, logistics, construction, hardware |
| `clay-3d` | Clay | matte clay 3D renders in pastel | friendly, modern | SaaS and product pitches, how-it-works, startups |
| `papercut` | Papercut | layered cut-paper craft — sand, terracotta, teal | warm, handmade | B2C offers, events, welcome packs, nonprofits |
| `charcoal` | Sketchbook | charcoal and graphite on toned paper | elegant, crafted | real estate, interiors, architecture, luxury services |
| `sky-oil` | Sky studies | oil-on-paper cloud studies | calm, spacious | vision and strategy decks, investor updates, a quiet cover for anything |

Each pack's `STYLE.md` is the card to read before using it: concept, the rules that keep
it from becoming slop, its default rhythm, what each plate and device is for.

## Anatomy of a pack

```
art/<id>/
  STYLE.md            the card — read this one
  pack.json           machine manifest: palette, plates, fonts, generation recipe (prompts)
  pack/               ← the part you copy into a deck, as one folder
    theme.css         tokens (--nk-*), placement classes, devices, @font-face
    plates/           hero · plate-a · plate-b · band · paper · spot-1..3 [· figure]  (WebP)
    fonts/            display face as woff2 (latin + cyrillic) + OFL.txt   (not every pack)
    marks/            hand-drawn SVG marks — arrows, scribbles, brush strokes (loud packs only)
```

Plate roles are the same in every pack, so a deck built on one pack can be restyled with
another by swapping the folder:

| Plate | Ratio | Role |
|---|---|---|
| `hero.webp` | 16:9 | the cover plate — full bleed or half; composed with quiet space for the headline |
| `plate-a.webp`, `plate-b.webp` | 4:3 | section plates for half-column layouts (growth / method, or as `STYLE.md` says) |
| `band.webp` | 21:9 | a panoramic strip — divider, section opener, a row that tells a story |
| `paper.webp` | 16:9 | the surface: a blank substrate for quiet slides (`.art-paper`) |
| `spot-1..3.webp` | 1:1 | single objects; transparent where the technique allows, pasted prints otherwise |
| `figure.webp` | 3:4 | a cut-out person — only in `sticker-pop` |

## The interface — same classes in every pack

`theme.css` defines the pack's tokens under `:root[data-theme='<id>']` (all the engine's
`--nk-*` tokens, so every ready-made deck component recolors itself) plus pack extras
`--art-paper`, `--art-ink`, `--art-accent`, `--art-accent-2`, `--art-field`,
`--art-field-ink`, `--art-scrim`, `--art-scrim-strong`.

**Placement** — identical CSS in every pack:

| Class | On | What it does |
|---|---|---|
| `.art-cover` | `<section>` | a slide that hosts a plate: relative, clipped, paper-colored |
| `.art-content` | a wrapper | keeps text above plates (`z-index`) |
| `.art-plate` | `<img>` | a plate in the flow (responsive block image) |
| `.art-plate--bleed` | `<img>` | the plate covers the whole slide; `style="--art-focus: right"` shifts the crop |
| `.art-plate--half` (`.is-left`) | `<img>` | the plate fills the right (left) half; stacks on top on phones |
| `.art-scrim` (`.is-right`, `.is-bottom`) | `<div>` | a paper-colored gradient for text legibility over a bleed plate |
| `.art-band` | `<img>` | the panoramic strip at a fixed height |
| `.art-spot` (`--sm`, `--lg`) | `<img>` | a floating object; position with `style="top:…; right:…; --art-rotate: -6deg"` |
| `.art-paper` | `<section>` | the blank substrate as the slide background |
| `.art-field` | `<section>` or block | the pack's loud color field with its own text color |

**Devices** — present in every pack, but each pack gives them its own meaning (the exact
meaning is in the pack's `STYLE.md`):

| Class | Role |
|---|---|
| `.art-display` | the headline treatment (face, weight, case, leading) |
| `.art-mark` | one emphasized word or phrase inside a headline |
| `.art-sticker` | the pack's frame for a cut-out or a pasted image (die-cut border, mat, plate frame, wedge…) |
| `.art-duotone` | the filter that makes any photo belong to the pack |
| `.art-chip` | the small label (mono caps, pill, cut-paper tag…) |
| `.art-rule` | the divider line |
| `.art-num` | a big numeral |

Some packs add one or two extras (`.art-leader`, `.art-ghost`, `.art-bar`, `.art-blob`,
`.art-dots`, `.art-cta`) — listed in their `STYLE.md`.

Deck-specific styles keep living in `deck.css`; the pack never restyles the deck's own
components — it only recolors them through tokens.

## Rhythm — where the art goes

Art is a rhythm across the deck, not a coat of paint on every slide. Three intensities:

- **loud** — a slide carried by art: `hero.webp` as a bleed, or the pack's `.art-field`
  with a spot and a giant `.art-display` headline;
- **mid** — a slide with one accent: a half plate, a `band`, a single spot, a `.art-mark`
  in the headline;
- **quiet** — paper only (`.art-paper` or the plain surface); tokens and typography do
  the work.

Patterns (pick by genre and length; every `STYLE.md` names its default):

| Pattern | Map | When |
|---|---|---|
| `bookends` | loud · quiet … quiet · loud | most proposals and offers; the safest default |
| `pulse` | loud · quiet ×3–4 · mid · quiet ×2–3 · loud | 8–12 slide proposals with a natural middle (results, method) |
| `editorial` | loud · (mid opener · quiet ×1–2) × N · loud | reports, walkthroughs, anything with sections |
| `poster` | loud · quiet · loud · quiet · loud | short marketing pitches (4–8 slides), invitations |
| `document` | mid cover · quiet … · mid close | briefs, forms, self-fill decks, scrolling-feed decks |

Rules that hold for every pack:

- **Text stays text.** Plates never carry words; headlines, numbers and labels are HTML
  on top (PDF and PPTX export read them; the service translates and personalizes them).
- **Never two loud slides in a row** in a deck longer than six slides.
- **One spot per quiet slide at most**, and not on every quiet slide.
- **Client photos join the pack** through `.art-duotone` (and `.art-sticker` for
  cut-outs); a raw stock photo next to a plate breaks the direction.
- **Personalized fields stay readable**: over a bleed plate always use `.art-scrim`.

## Apply a pack to a deck

1. Read the pack's `STYLE.md`.
2. Copy the pack — one folder, every relative path inside keeps working:
   ```bash
   cp -R art/<id>/pack <deck>/assets/art
   ```
3. In `index.html`: link the stylesheet **before** `deck.css` and set the theme:
   ```html
   <html lang="en" data-theme="<id>">
   …
   <link rel="stylesheet" href="naimi-kit/kit.css">
   <link rel="stylesheet" href="assets/art/theme.css">
   <link rel="stylesheet" href="deck.css">
   ```
   `deck.css` may still override any token or device after that line.
4. Build the loud slides with the plates:
   ```html
   <section class="art-cover" data-nk-slide="cover">
     <img class="art-plate art-plate--bleed" src="assets/art/plates/hero.webp" alt="" style="--art-focus: right">
     <div class="art-scrim" aria-hidden="true"></div>
     <div class="art-content wrap">
       <p class="art-chip" data-animate="up">Proposal · 2026</p>
       <h1 class="art-display" data-animate="up-lg">A plan for <span class="art-mark" data-nk-text="companyName" data-nk-fallback="your company"></span></h1>
     </div>
   </section>
   ```
   and the quiet ones with the paper:
   ```html
   <section class="art-paper" data-nk-slide="scope">
     <img class="art-spot art-spot--sm" src="assets/art/plates/spot-2.webp" alt="" style="top: 40px; right: 48px; --art-rotate: 6deg">
     <div class="wrap">…</div>
   </section>
   ```
5. Delete the plates and marks the deck does not use — the bundle counts against the
   plan's storage allowance.
6. Check every slide in the static render (`?nk-static=1` / `naimi shot`): a plate
   that hides text, a spot that overlaps a control, a headline that wraps under a
   scrim are the usual defects.

To **restyle** a deck that already uses a pack, replace `assets/art/` with another
pack's folder and change `data-theme` — the class names are the same everywhere; only
re-check the loud slides, because plates are composed differently (where the quiet
space is, whether the hero is light or dark).

## Photos and cut-outs

- The user's photos (products, team, premises) go in as usual (`assets/`), wrapped in
  `.art-duotone` where they sit next to plates, and in `.art-sticker` when they are
  cut out. Real photos raise a deck more than any plate — ask for them.
- A **cut-out** needs an image with transparency. Ask for (or generate) the object on a
  flat green, magenta or white background and key it out:
  ```bash
  node tools/art-cutout.mjs picture.png --key auto --out assets/art/plates/my-object.webp
  ```
  The tool needs ImageMagick; it never upscales, trims to the object, and writes WebP
  with alpha. Line art or an ink drawing on white wants `--holes` too, so the page
  shows through the enclosed whites (an eye's sclera, a key's bow) instead of a white
  patch — without it the object stays a white cut-out pasted on cream.

## Generate more in this style

Each `pack.json → generate` carries the pack's recipe: the prompt base for plates
(`base`, with `{subject}`), the template for a cut-out object (`spot`, and `figure` where
the pack has one), the plates to attach as style references (`references`), the flat
background to request for isolated objects (`spotBackground`), the rules that end every
prompt, and the exact per-plate prompts that produced the pack (`prompts`).

`tools/art-generate.mjs` runs that recipe end to end — an illustration of the client's
own product, a subject-specific hero, a fourth spot:

```bash
node tools/art-generate.mjs --pack cyanotype --subject "a delivery van"            # a spot, cut out
node tools/art-generate.mjs --pack riso --subject "a warehouse" --role hero         # a 16:9 plate
```

It builds the prompt (template for the role + isolation on the pack's background + rules),
attaches the reference plates, asks the model at the roster ratio, keys a spot out with
`art-cutout.mjs` and writes the WebP into `assets/art/plates/<name>.webp`. The model
comes from the environment: `GEMINI_API_KEY` (Google AI), `GOOGLE_CLOUD_PROJECT` (Vertex
AI, bearer from `GOOGLE_ACCESS_TOKEN` or the metadata server), or a relay
(`NAIMI_IMAGE_URL` + `NAIMI_IMAGE_TOKEN` — the studio sandbox, metered); `--dry` prints
the prompt without calling anything. Name a concrete object, no people, no brands; one or
two generated plates per deck. Two things the packs taught: a blank texture ("empty
paper") often comes back as no image at all — attach one of the pack's plates as a
reference and ask for "the same paper with nothing on it"; and a row of marks on one
baseline reads as letters — scatter them.

## Weight and licensing

A pack is roughly 0.7–1.3 MB: plates at their native generation size (≈1400 px on the
long side, WebP q82), fonts as latin + cyrillic woff2 subsets. Fonts are SIL Open Font
License (the `OFL.txt` next to them travels with the deck); plates and marks are part of
the kit and carry its license.
