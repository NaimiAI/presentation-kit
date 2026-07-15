# design-brief — design studio brief (self-fill)

A design-studio intake brief styled as a gallery sheet: near-white surface,
hairline rules, oversized lowercase serif, Klein-blue accent. Same genre as
`agency-brief` but the opposite visual language — the pair shows how different
two self-fill questionnaires can look.

What it demonstrates:

- free-text self-fill through an "underlined paper" field (`UnderlineField`,
  serif italic input bound to `useDemoField`);
- a **moodboard multi-select**: six image cards (one photo per direction) as
  boolean `collectFromClient` fields, with a Klein-blue ring + check over the
  selected image;
- deliverables checklist + budget-range and deadline chips (single-choice
  string fields, promoted to the client card);
- calm editorial copy addressed to a brand owner.

The studio name lives in slide copy (Slide01/05) — adjust when adapting. The
six moodboard photos live in `assets/mood-*.webp`.

Build: `node scripts/build-deck.mjs design-brief` from the kit root.
