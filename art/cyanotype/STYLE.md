# Blueprint — `cyanotype`

Cyanotype photograms — Prussian blue on watercolor paper. Cyanotype contact prints (Herschel 1842, Anna Atkins 1843–53): real flat objects laid on sensitized paper and exposed to light leave pale silhouettes on a Prussian-blue ground.

- **Spirit:** calm, premium, trustworthy
- **Fits:** consulting and B2B proposals; partnership offers; reports and reviews; anything sent to a serious buyer
- **Avoid:** youth marketing; launches that need energy; decks where every slide must be loud
- **Palette:** ink `#0f2a52` · paper `#f3efe4` · accent `#1e3a6e` · accent-2 `#8a6a3d` · positive `#16a34a`
- **Type:** **Playfair Display** for display (display serif for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Every proposal is a blueprint: the sheet, the envelope and the key are the objects laid on the paper; the client's version is one more exposure. Deep Prussian blue opens and closes the deck; everything in between stays on cream paper.

## Rules that keep it from becoming slop

- The art is always a photogram of flat, real objects — never a scene, never a character, never a face.
- Brushed emulsion edges and paper stay visible somewhere in every plate; that is the proof of process.
- Blue is for openings, dividers and the closing slide, not for wallpaper: below the cover the deck lives on cream.
- Personalized or emphasized words on blue go sepia (`.art-mark`, the Van Dyke brown sibling process); live/positive signals stay green.
- Keep spots to one or two per deck, pasted like prints with a white mat (`.art-sticker`) — not scattered.

## Rhythm

`pulse` — loud cover (`hero.webp` bleed + `.art-scrim`), three or four quiet cream slides, one accent slide opened by `band.webp`, quiet again, loud close (`.art-field` deep blue with a spot).

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover, full bleed; the empty upper-left third takes the headline |
| `plate-a.webp` | plate · 4:3 | growth / results slides — half column (`.art-plate--half`) |
| `plate-b.webp` | plate · 4:3 | method / process slides — half column |
| `band.webp` | band · 21:9 | section divider strip; also the herbarium row above pricing |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the key — access, handover, "your link" |
| `spot-2.webp` | spot · 1:1 · transparent | the envelope — sending, the proposal itself |
| `spot-3.webp` | spot · 1:1 · transparent | the hand — partnership, the closing slide |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Playfair Display, regular weight; `<em>` inside goes italic sepia |
| `.art-mark` | sepia emphasis (on blue it turns pale gold automatically inside `.art-cover`) |
| `.art-sticker` | white photo mat + soft blue shadow around a pasted print |
| `.art-duotone` | turns any photo into a cyanotype tint |
| `.art-chip` | mono uppercase label with wide tracking |

## Apply

```bash
cp -R <kit>/art/cyanotype/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="cyanotype"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
