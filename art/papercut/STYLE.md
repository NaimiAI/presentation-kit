# Papercut — `papercut`

Layered cut-paper craft — warm sand, terracotta, teal. Layered paper-cut illustration: stacked sheets of colored craft paper with crisp cut edges, soft shadows between the layers and visible paper fiber — a warm, handmade depth.

- **Spirit:** warm, handmade, welcoming
- **Fits:** B2C offers (home, family, education); events and invitations; welcome packs and onboarding; nonprofits and community
- **Avoid:** enterprise procurement; tech that wants to look sharp
- **Palette:** ink `#2b2421` · paper `#f1e6d2` · accent `#d9744a` · accent-2 `#2a7f7a` · positive `#2a7f7a`
- **Type:** **Nunito** for display (rounded sans for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Handmade depth: hills, roads, houses and envelopes cut from colored craft paper and stacked with real shadows between the layers. Warm, patient, welcoming — the design of a good B2C offer or a welcome pack.

## Rules that keep it from becoming slop

- Four papers — sand, terracotta, mustard, teal — and the shadows between them. No gradients, no gloss.
- Layers imply a journey (the road to the house) or growth (the tree from the coins); use the plate that matches the story.
- Cut-outs get a paper frame (`.art-sticker`) so photos look pasted into the craft, not dropped on top.
- Chips are cut-paper tags (`.art-chip`); rules are strips of teal paper.
- Keep the sand paper (`paper.webp`) as the constant background; loud slides are terracotta `.art-field`.

## Rhythm

`bookends` — loud cover (`hero.webp` bleed, headline in the plain sky), quiet sand slides with paper-cut spots, terracotta `.art-field` close with the trophy.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — the road to the house; headline in the upper-left sky |
| `plate-a.webp` | plate · 4:3 | the offer / message slide — the envelope with the heart |
| `plate-b.webp` | plate · 4:3 | growth / value slide — the tree from coins |
| `band.webp` | band · 21:9 | mountain strips as a divider |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the lightbulb — idea, tip, why |
| `spot-2.webp` | spot · 1:1 · transparent | the calendar — dates, timeline, booking |
| `spot-3.webp` | spot · 1:1 · transparent | the trophy — result, the close |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Nunito 800 |
| `.art-mark` | teal words |
| `.art-sticker` | paper frame with layered shadow |
| `.art-chip` | cut-paper tag |
| `.art-num` | terracotta numeral with a paper shadow |

## Apply

```bash
cp -R <kit>/art/papercut/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="papercut"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`magenta`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
