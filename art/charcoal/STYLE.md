# Sketchbook — `charcoal`

Charcoal and graphite sketches on toned paper. Architectural sketchbook drawing: charcoal and graphite on warm toned paper, confident loose lines, smudged shading, white chalk highlights, one red-pencil accent — the drawing of someone who builds things.

- **Spirit:** elegant, crafted, premium
- **Fits:** real estate and listings; architecture, interiors, renovation; design studios; luxury services
- **Avoid:** loud marketing; data-heavy dashboards
- **Palette:** ink `#2b2b2b` · paper `#efe6d6` · accent `#b8552e` · accent-2 `#2b2b2b` · positive `#3f7d4e`
- **Type:** **Cormorant Garamond** for display (elegant serif for headlines, italic for emphasis; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

The drawing of someone who builds things: charcoal and graphite on toned sketchbook paper, perspective lines left visible, one red-pencil accent. Real estate, interiors, architecture and any premium service that wants to feel crafted rather than sold.

## Rules that keep it from becoming slop

- Charcoal and graphite only; the red pencil is the single accent and appears once per slide at most.
- Sketches stay unfinished at the edges — a fully rendered drawing is the wrong image.
- Photos become pencil-toned monochrome (`.art-duotone`) and are pinned like sketches (`.art-sticker`, slightly rotated).
- Headlines in Cormorant Garamond; the italic (`<em>`) carries emphasis in red.
- One sketch per slide; the paper (`paper.webp`) does the rest.

## Rhythm

`editorial` — cover with `hero.webp` on the right two thirds, section openers with a half-plate sketch, quiet toned-paper slides with one pinned photo or a spot; close on charcoal-black `.art-field`.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — the house facade; headline in the empty left third |
| `plate-a.webp` | plate · 4:3 | interiors / experience slides |
| `plate-b.webp` | plate · 4:3 | process / planning slides — the floor plan with tools |
| `band.webp` | band · 21:9 | rooftops skyline as a divider |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the key — handover, access |
| `spot-2.webp` | spot · 1:1 · transparent | the coffee cup — the meeting, the conversation |
| `spot-3.webp` | spot · 1:1 · transparent | the fountain pen — signature, agreement |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Cormorant Garamond 500; `<em>` italic in red pencil |
| `.art-mark` | red-pencil underline |
| `.art-sticker` | a pinned, slightly rotated sketch/photo with white margin |
| `.art-duotone` | pencil-toned monochrome with multiply |
| `.art-chip` | small-caps serif label |
| `.art-num` | italic serif numeral |

## Apply

```bash
cp -R <kit>/art/charcoal/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="charcoal"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
