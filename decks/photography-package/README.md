# Wedding photography packages — `photography-package`

A wedding photographer's package/pricing proposal to a couple (HoneyBook/Dubsado
territory) — the most image-led deck in the kit. Fine-art gallery style: ivory paper,
dusty champagne-rose accent, editorial serif, portfolio photos in print-style ivory mats.

## What it demonstrates

- **Portfolio-first design.** Six real photos carry the deck — hero cover in a mat, an
  asymmetric three-image composition, side panels — with gentle 1.03→1 scale-ins.
- **B2C client self-fill pricing.** The couple configures their own package themselves:
  the tier picker, add-on checkboxes, extra-hours stepper and their questions are all
  `collectFromClient`, so anonymous answers come back to the photographer.
- **Include-logic between tiers and add-ons.** Add-ons already bundled into the selected
  collection (second shooter, engagement session, fine-art album) render as "included in
  your collection" instead of a checkbox, and never double-count in the live total.

## Slides

1. **Cover** — golden-hour hero, couple's names, date · venue, optional handwritten note.
2. **The work** — asymmetric portfolio grid + documentary philosophy + meta line.
3. **Collections** — three tiers (Essentials / Signature / Heirloom); pick one.
4. **Add-ons & your total** — checkbox add-ons with include-logic, extra-hours stepper,
   live total card with retainer footnote.
5. **How it works** — booking timeline, self-fill (date flexibility chips + questions),
   availability callout, "Reserve your date" CTA or contact line.

## Build

```bash
node scripts/build-deck.mjs photography-package
```
