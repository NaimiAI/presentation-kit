# Pressroom — `riso`

Risograph stencil prints — three spot inks on cream stock. Risograph duplicator prints (Riso Kagaku 1986, indie print studios): flat overlapping spot inks, tone only through coarse halftone, slight misregistration, visible grain — no two copies identical.

- **Spirit:** warm, human, creative
- **Fits:** agencies and studios; founders and small teams; community and education; onboarding and welcome packs
- **Avoid:** enterprise procurement; luxury and premium real estate; anything that must look corporate
- **Palette:** ink `#2f4b8a` · paper `#f6f1e4` · accent `#ffd23f` · accent-2 `#00a95c` · positive `#00a95c`
- **Type:** Inter as is, no new font.

## Concept

Printed for one: a risograph never prints two identical copies — the stencil drifts, the inks misregister. Three inks carry the deck's semantics one to one: federal blue is the brand, sunflower is the personalized field, green is the live signal.

## Rules that keep it from becoming slop

- Three inks, flat shapes, tone only through halftone. No gradients, no black outlines.
- Hands and objects, never faces or blob-people.
- Grain is real print grain inside the art, not a page-wide noise overlay.
- The isotype strip (`band.webp`) doubles as information: envelope → eye → hand narrates sent → opened → answered — put it where that story is told.
- Cards go squarer and sit on the same cream stock; the interface never turns glossy.

## Rhythm

`editorial` — loud cover (`hero.webp` half plate on the right, headline on cream), every section opener gets a mid accent (a spot or the isotype strip), body slides quiet cream; close with `.art-field` federal blue.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — hands passing the envelope; headline on the empty left half |
| `plate-a.webp` | plate · 4:3 | insight / tracking / results slides |
| `plate-b.webp` | plate · 4:3 | sending / delivery / next-steps slides |
| `band.webp` | band · 21:9 | the isotype procession — sent · opened · answered |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the eye — tracking, "we see when it is opened" |
| `spot-2.webp` | spot · 1:1 · transparent | the pointing hand — a call to action, a choice |
| `spot-3.webp` | spot · 1:1 · transparent | the envelope with a starburst — the offer, the special deal |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Inter 800, tight — no new font |
| `.art-mark` | sunflower marker highlight behind the words |
| `.art-sticker` | misregistered second-ink shadow behind a cut-out |
| `.art-duotone` | blue monotone with multiply — photos look printed |
| `.art-num` | green numeral with a yellow misregistered shadow |
| `.art-chip` | ink pill with paper-colored text |

## Apply

```bash
cp -R <kit>/art/riso/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="riso"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
