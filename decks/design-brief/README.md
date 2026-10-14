# design-brief — design studio brief (self-fill)

A design-studio intake brief styled as a gallery sheet: near-white surface,
hairline rules, oversized lowercase serif, Klein-blue accent — a self-fill
questionnaire that reads like an editorial page, not a form.

What it demonstrates:

- free-text self-fill through an "underlined paper" field (a serif italic input
  bound with `data-nk-field`);
- a **moodboard multi-select**: six image cards (one photo per direction) as
  boolean `collectFromClient` fields, with a Klein-blue ring + check over the
  selected image;
- deliverables checklist + budget-range and deadline chips (single-choice
  string fields, promoted to the client card);
- calm editorial copy addressed to a brand owner.

The studio name lives in slide copy (slides 1 and 5) — adjust when adapting. The
six moodboard photos live in `assets/mood-*.webp`.

To build on this deck, copy `decks/design-brief/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
