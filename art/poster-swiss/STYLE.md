# Poster — `poster-swiss`

Swiss poster — white paper, one electric blue, giant type, brush marks. International-style poster photography meets kinetic brutalism: high-contrast black-and-white studio photos on white, one electric blue as the only color, hand-painted brush marks crossing things out, dot grids and thin arrows; the headline is the image.

- **Spirit:** bold, confident, sharp
- **Fits:** product and campaign launches; marketing and media proposals; manifesto-style pitches; event and conference decks
- **Avoid:** gentle B2C (weddings, family, wellness); dense reports
- **Palette:** ink `#111111` · paper `#ffffff` · accent `#1a3cff` · accent-2 `#111111` · positive `#16a34a`
- **Type:** **Oswald** for display (condensed uppercase display for the giant headline; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Stop the scroll: white paper, one electric blue, a headline so large it becomes the picture, a black-and-white photo the type overlaps, and a brush mark that crosses the old way out. Confidence, not decoration.

## Rules that keep it from becoming slop

- Blue is the only color. Photos are black and white (`.art-duotone`), the product UI stays modern.
- The headline overlaps the photo, not the other way round; giant ghost words (`.art-ghost`) sit behind.
- Brush marks cross things out or point — an X on the phone, a circle on the number. Never as ornament.
- Mono uppercase labels (`.art-chip`), thin arrows and a dot grid (`.art-dots`) are the whole grammar of small elements.
- Loud decks are short; after two poster slides give the reader a white slide with type only.

## Rhythm

`poster` — cover: `hero.webp` on the right, `.art-display` headline overlapping it, `.art-ghost` word behind; then a white type-only slide; a blue `.art-field` statement slide; white; close with the brush X spot and `.art-cta`.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — the figure in blue sunglasses on the right half |
| `plate-a.webp` | plate · 4:3 | the problem slide — the phone crossed out |
| `plate-b.webp` | plate · 4:3 | the idea / output slide — the flying sheet circled |
| `band.webp` | band · 21:9 | divider strip of brush marks |
| `paper.webp` | paper · 16:9 | quiet white slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | brush X — "not this" |
| `spot-2.webp` | spot · 1:1 · transparent | brush circle — "this one" |
| `spot-3.webp` | spot · 1:1 · transparent | brush arrow — next, forward, the CTA |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Oswald condensed uppercase, leading 0.88 |
| `.art-ghost` | giant blue word behind the content (real text, stays exportable) |
| `.art-mark` | blue words inside a black headline |
| `.art-duotone` | high-contrast black and white for any photo |
| `.art-chip` | mono uppercase blue label |
| `.art-dots` | blue dot grid on any block |
| `.art-cta` | square blue button, uppercase |
| marks | `pack/marks/x.svg`, `circle.svg`, `arrow.svg`, `underline.svg` — crisp vector versions of the brush marks |

## Apply

```bash
cp -R <kit>/art/poster-swiss/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="poster-swiss"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
