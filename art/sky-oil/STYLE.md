# Sky studies — `sky-oil`

Oil-on-paper cloud studies — painted skies, visible brushwork. Romantic sky painting as in Constable's 1821–22 oil sketches: quick studies of clouds on paper with visible impasto brushwork — a sky that is painted, not photographed.

- **Spirit:** calm, airy, spacious
- **Fits:** investor and vision decks; strategy and roadmap presentations; wellness, travel, education; a quiet cover for almost any genre
- **Avoid:** decks that need a strong physical metaphor; anything that must feel handmade in a rough way
- **Palette:** ink `#1b2b55` · paper `#faf9f6` · accent `#e9b45a` · accent-2 `#1b2b55` · positive `#16a34a`
- **Type:** **Playfair Display** for display (display serif for headlines; files in `pack/fonts/`, OFL) — Inter for body text.

## Concept

Room to think: a painted sky — visible brushwork, no horizon, no land — as the backdrop for a centered serif headline and a numbered table of contents with dotted leaders. The calm, spacious register for vision and strategy decks.

## Rules that keep it from becoming slop

- No horizon, no land, no people; the sky is a backdrop and never a subject.
- At most one moon; no stars, no sparkle, no lens effects.
- Brushwork must stay visible at hero scale — if it reads as a photo, it is the wrong image.
- Centered serif headline with a numbered, dotted-leader table of contents (`.art-leader`) is the whole typographic move.
- Below the cover the deck lives on cream; sky bands (`band.webp`) divide, they do not decorate.

## Rhythm

`bookends` — loud cover (`hero.webp` bleed, centered `.art-display` headline, `.art-leader` contents), quiet cream slides, one dusk `plate-a` accent slide, quiet, navy `.art-field` close with the moon spot.

Patterns are defined in `../README.md` → "Rhythm"; loud / mid / quiet refer to the plate or
device named there.

## Plates — `pack/plates/`

| File | Role | Use it for |
|---|---|---|
| `hero.webp` | hero · 16:9 | cover — sunlit cumulus; headline in the quiet upper-left sky or centered with `.art-scrim.is-bottom` |
| `plate-a.webp` | plate · 4:3 | the vision / "where we are going" slide — dusk bands |
| `plate-b.webp` | plate · 4:3 | the "day one" / start slide — morning sky with a moon |
| `band.webp` | band · 21:9 | stratus band divider |
| `paper.webp` | paper · 16:9 | quiet slides (`.art-paper`) |
| `spot-1.webp` | spot · 1:1 · transparent | the single cloud — an idea, a note |
| `spot-2.webp` | spot · 1:1 · transparent | the crescent moon — night, the close |
| `spot-3.webp` | spot · 1:1 · transparent | the sunlit edge — results, the bright spot |

## Devices — `pack/theme.css`

Placement classes (`.art-cover`, `.art-plate--bleed`, `.art-plate--half`, `.art-scrim`,
`.art-band`, `.art-spot`, `.art-paper`, `.art-field`) are identical in every pack — see
`../README.md`. What the devices mean **in this pack**:

| Class | In this pack |
|---|---|
| `.art-display` | Playfair Display, regular; centered on the sky |
| `.art-mark` | warm gold words |
| `.art-sticker` | white mat around a pasted study |
| `.art-chip` | italic serif caption |
| `.art-leader` | numbered contents rows with dotted leaders |

## Apply

```bash
cp -R <kit>/art/sky-oil/pack <deck>/assets/art     # one folder; every relative path keeps working
```

Then `<link rel="stylesheet" href="assets/art/theme.css">` **before** `deck.css` in
`index.html`, `data-theme="sky-oil"` on `<html>`, and delete the plates you did not
use before publishing (they count against the plan's storage allowance).

## Generate more in this style

When an image model is available, new plates in this style come from the recipe in
`pack.json → generate`: `base` is the prompt with `{subject}` to fill in (name the
process, not the mood — that is what keeps generations consistent), `references` are the
plates to attach as style references, `spotBackground` is the flat background to ask
for on an isolated object (`white`), keyed out afterwards with
`tools/art-cutout.mjs`. The per-plate prompts that produced this pack are in
`generate.prompts` — reuse them as templates.
