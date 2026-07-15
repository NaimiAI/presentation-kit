# qbr-report — Quarterly business review

A data-forward QBR deck: an agency or customer-success team walks an existing
client through the quarter — metrics, wins, risks, what shipped, the next-quarter
plan, and a soft renewal motion — then collects the client's own feedback.

**Genre.** Quarterly business review / account review.
**Theme.** `graphite-emerald` — warm-gray surface, white cards with thin edges,
emerald for good deltas, amber for attention (never alarm red).

## What it demonstrates

- **Line-parser-driven personalization** — the whole report is a form. KPI cards
  come from `Metric | value | change` lines, the trend chart from a comma-separated
  number series, and every list (wins, watch-outs, delivered, in-flight, plan)
  from one-item-per-line textareas. Each quarter you just refill the fields.
- **Amber / emerald delta semantics** — deltas are colored by their leading sign:
  `+` reads as emerald (up), `−` as amber (attention), no sign as neutral.
- **Client feedback self-fill promoted to the CRM** — the sign-off slide captures a
  1–5 quarter rating (`collectFromClient` + `promoteToClientFacts`) and a free-text
  note (`collectFromClient`); answers save automatically to the client card.

## Build

```bash
node scripts/build-deck.mjs qbr-report
```
