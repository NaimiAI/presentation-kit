# Atlas — `engraving`

Copperplate engraving — indigo ink on laid paper. Copperplate engraving as in the Encyclopédie (1751–72) and natural-history plates: burin lines and cross-hatching for tone, one exploded or cutaway object per plate, indigo ink on cream laid paper.

- **Spirit:** editorial, explanatory, heritage
- **Fits:** product and capability walkthroughs; proposals that explain a method; professional services; heritage brands, finance, law
- **Avoid:** decks read mostly on phones (hatching dies at small sizes); youth marketing
- **Palette:** ink `#1d2b5c` · paper `#f4efe3` · accent `#1d2b5c` · accent-2 `#c9963a` · positive `#16a34a`
- **Type:** **Prata** for display (Didone display for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Anatomy of a proposal: the Encyclopédie explained every craft with an exploded, numbered plate. The engraving carries the object; the interface carries the numbers and the dotted leaders (`.art-leader`) — every label stays live text.

## Rules that keep it from becoming slop

- Indigo ink on cream; one exploded object per plate; botanical for growth, mechanical for workflow.
- The art carries no text ever — numbers and labels are HTML next to it.
- Hatching needs size: plates live at hero and section scale; spots are single objects, never tiny.
- Product screenshots and UI stay modern and flat; only headlines borrow the Didone.
- One ornament (`band.webp`) per deck is plenty — as a divider, not a frame around everything.

## Rhythm

`editorial` — cover with `hero.webp` on the right and a numbered legend on the left (`.art-leader` rows), section openers with `plate-a`/`plate-b` half plates, body quiet laid paper; close on `.art-field` indigo.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — the exploded letter balance; legend on the empty left third |
| `plate-a.webp` | plate · 4:3 | growth, results, "what you get" |
| `plate-b.webp` | plate · 4:3 | method, mechanics, how it works |
| `band.webp` | band · 21:9 | ornamental divider between parts |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the eye — tracking, attention |
| `spot-2.webp` | spot · 1:1 · transparent | the hand with the quill — signature, agreement |
| `spot-3.webp` | spot · 1:1 · transparent | the key — access, handover |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Prata (Didone) headlines |
| `.art-mark` | gold-leaf emphasis |
| `.art-sticker` | engraver's plate frame: double rule around an image |
| `.art-duotone` | indigo monotone with multiply |
| `.art-rule` | engraver's double rule |
| `.art-leader` | a row with a dotted leader between label and value (numbered legends, pricing lines) |

## Apply

```bash
cp -R <kit>/art/engraving/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="engraving"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
