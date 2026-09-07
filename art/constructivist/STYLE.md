# Constructor — `constructivist`

1920s constructivist photomontage — red, black and cream, diagonals. Constructivist poster lithography and photomontage (Rodchenko, Lissitzky, Stenberg brothers): halftone photo fragments clipped into wedges and circles, red and black diagonal bars on cream paper, lithographic grain.

- **Spirit:** bold, industrial, dynamic
- **Fits:** manufacturing, logistics, construction; industrial supply offers; tech with a hardware side; anything that wants momentum without being playful
- **Avoid:** soft B2C; luxury; wellness
- **Palette:** ink `#151515` · paper `#f2e9d8` · accent `#d7261e` · accent-2 `#151515` · positive `#16a34a`
- **Type:** **Unbounded** for display (wide geometric display for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Build it: a red diagonal, a black circle and a halftone fragment of the real thing — cranes, chimneys, hands with tools. The deck moves at an angle; every number is monumental. Industry, logistics and construction wear it naturally.

## Rules that keep it from becoming slop

- Red, black and cream — nothing else. Photos become coarse halftone black and white (`.art-duotone`).
- Composition is diagonal: one `.art-bar` per loud slide, clipped photos (`.art-sticker` wedge), numbers set huge.
- Faces are never the subject; hands, machines and buildings are.
- Headlines in Unbounded uppercase — short, one line where possible.
- The aged paper (`paper.webp`) is the quiet background; do not add texture on top of it.

## Rhythm

`pulse` — loud cover (`hero.webp` bleed + `.art-scrim`), quiet cream slides with one red `.art-chip` each, an accent slide with `.art-bar` and a clipped photo, quiet again, red `.art-field` close.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — industrial photomontage; headline in the empty upper-left |
| `plate-a.webp` | plate · 4:3 | people / team / craft slides — the hand with the wrench |
| `plate-b.webp` | plate · 4:3 | process / mechanics slides |
| `band.webp` | band · 21:9 | divider frieze |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | red wedge — direction, growth |
| `spot-2.webp` | spot · 1:1 · transparent | circle with the red segment — share, the number |
| `spot-3.webp` | spot · 1:1 · transparent | halftone chimney in a circle — the site, the plant |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Unbounded 800 uppercase |
| `.art-bar` | the red diagonal bar (absolute, behind content) |
| `.art-sticker` | clips any image into a wedge |
| `.art-duotone` | harsh black-and-white halftone look |
| `.art-chip` | black block label, uppercase |
| `.art-num` | monumental red numeral |
| marks | `pack/marks/wedge.svg`, `arrow.svg`, `circle.svg`, `bar.svg` — flat vector shapes |

## Apply

```bash
cp -R <kit>/art/constructivist/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="constructivist"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
