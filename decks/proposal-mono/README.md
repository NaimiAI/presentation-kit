# proposal-mono — universal service proposal, Swiss monochrome

A universal B2B service proposal styled as Swiss typography: white sheet, black
ink, one red accent, hard rules and oversized numerals. The `swiss-mono` theme
ships inside the deck.

What it demonstrates:

- a document-style proposal with a completely different visual language from the
  "paper" `studio-proposal` (same genre, opposite design);
- priced estimate through the stages editor (`showStagesEditor: true`);
- proposal metadata as personalization: proposal number, dates, timeline, validity;
- zero interactive fields — a pure static-document genre.

Sender details are the `SENDER` constant in `slides/content.ts` — replace them
with the user's company once when adapting the template.

Build: `node scripts/build-deck.mjs proposal-mono` from the kit root.
