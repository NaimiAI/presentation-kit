# Sticker pop — `sticker-pop`

Zine sticker collage — acid yellow field, die-cut stickers, marker scribbles. Zine and sticker-sheet collage of the 2000s revival: flat acid color field, die-cut vinyl stickers with thick white borders, cut-out photos, black marker scribbles and arrows, pill-shaped chips.

- **Spirit:** loud, young, playful
- **Fits:** creative and marketing agencies; youth brands and events; social media and influencer offers; short pitches (4–8 slides)
- **Avoid:** enterprise and finance; long proposals (12+ slides all loud); anything the reader prints
- **Palette:** ink `#111111` · paper `#ffffff` · accent `#e8ff3a` · accent-2 `#c9b8ff` · positive `#16a34a`
- **Type:** **Oswald** for display (condensed uppercase display for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

A sticker sheet for the client: one acid-yellow field, a giant condensed headline, cut-out photos with white die-cut borders, marker scribbles and pill chips. Loud by design — the genre of youth marketing and agency pitches.

## Rules that keep it from becoming slop

- One field color per deck (acid yellow); lilac and white are the only other fills. Never a gradient.
- Every cut-out gets the white die-cut border (`.art-sticker`) — a photo without the border reads as a stock image.
- Marks are marker strokes (`pack/marks/*.svg`): scribble, arrow, underline, circle — two per slide at most.
- Faces only behind sunglasses (`figure.webp`); the client's real people go in as cut-outs with the same border.
- Loud decks are short: 4–8 slides. After that the field must rest — alternate with white paper slides.

## Rhythm

`poster` — cover on the yellow field (`.art-field` + `.art-blob`, headline in `.art-display`, `figure.webp` as a sticker on the right), one white paper slide, a yellow slide with spots, white, yellow close with `.art-cta`. Never two yellow slides in a row in a deck longer than six.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | full-bleed cover background (stickers on the right, headline on the left) |
| `plate-a.webp` | plate · 4:3 | a services / channels slide — sticker cluster on lilac |
| `plate-b.webp` | plate · 4:3 | a number or quote slide — torn paper with a marker circle behind the figure |
| `band.webp` | band · 21:9 | divider strip of stickers |
| `paper.webp` | paper · 16:9 | quiet white slides (`.art-paper`) |
| `figure.webp` | figure · 3:4 · transparent | the cut-out person (transparent) — cover or closing slide, `.art-sticker` already baked in |
| `spot-1.webp` | spot · 1:1 · transparent | the flip phone — "one link", contact |
| `spot-2.webp` | spot · 1:1 · transparent | the megaphone — reach, campaigns, channels |
| `spot-3.webp` | spot · 1:1 · transparent | the bolt — speed, energy, the offer |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Oswald condensed uppercase, tight leading — the headline is the image |
| `.art-mark` | lilac marker block behind the words |
| `.art-sticker` | white die-cut border + drop shadow on any cut-out (`<img>` with alpha) |
| `.art-chip` | white pill with a hard black shadow (timer, "now playing", tags) |
| `.art-cta` | black pill button |
| `.art-blob` | an organic yellow blob shape behind content (position with inset/width/height) |
| marks | `pack/marks/scribble.svg`, `arrow.svg`, `underline.svg`, `circle.svg`, `sparkle.svg`, `bolt.svg` — as `<img>` or inlined |

## Apply

```bash
cp -R <kit>/art/sticker-pop/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="sticker-pop"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`green`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
