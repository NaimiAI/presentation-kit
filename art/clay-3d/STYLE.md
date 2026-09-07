# Clay — `clay-3d`

Matte clay 3D renders — pastel objects, soft studio light. Matte clay / plasticine 3D render: soft rounded objects with fingerprint-free matte surfaces, pastel mint, peach and sky with one coral accent, soft studio lighting and gentle ambient occlusion.

- **Spirit:** friendly, modern, tech
- **Fits:** SaaS and product pitches; onboarding and how-it-works decks; startup and investor updates; internal and HR presentations
- **Avoid:** heritage and luxury; legal and finance that must look sober
- **Palette:** ink `#1f2937` · paper `#f7f5f2` · accent `#ff6b4a` · accent-2 `#3b5bdb` · positive `#16a34a`
- **Type:** **Manrope** for display (rounded geometric sans for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

A friendly product world: envelopes, rockets and charts modeled in matte clay, lit softly, in pastel mint, peach and sky with one coral accent. It explains software without a single screenshot and never looks corporate-cold.

## Rules that keep it from becoming slop

- Matte only — no glossy plastic, no chrome, no lens flares.
- Pastel objects, one coral accent for the thing that matters (CTA, the number, the highlighted plan).
- Objects float or rest on the off-white backdrop; never composite them onto photos.
- Rounded cards (`.art-sticker`), rounded chips (`.art-chip`), rounded button (`.art-cta`) — the interface matches the clay.
- Screens stay empty or show real UI you build in HTML — the clay laptop never carries a fake interface.

## Rhythm

`bookends` — loud cover (`hero.webp` on the right half), quiet warm slides with one spot each at most, loud close on coral `.art-field` with the rocket.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — the product world on the right |
| `plate-a.webp` | plate · 4:3 | the product / dashboard slide |
| `plate-b.webp` | plate · 4:3 | partnership / onboarding / team slide |
| `band.webp` | band · 21:9 | shelf of objects as a divider or a "what you get" row |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the envelope — the proposal, messages |
| `spot-2.webp` | spot · 1:1 · transparent | the rocket — launch, speed, the close |
| `spot-3.webp` | spot · 1:1 · transparent | the chart — results, growth |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Manrope 800, tight |
| `.art-mark` | coral words |
| `.art-sticker` | rounded card with a soft shadow |
| `.art-chip` | mint pill |
| `.art-cta` | coral pill button |
| `.art-num` | coral numeral |

## Apply

```bash
cp -R <kit>/art/clay-3d/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="clay-3d"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`green`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
