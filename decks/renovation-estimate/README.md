# renovation-estimate — remodel estimate, Letter-size document

A preliminary remodel estimate in the kit's **document format**: five Letter sheets on the
viewer's desk, the PDF prints portrait pages — a long labor table simply continues on the
next page (native pagination, the table header repeats). The `estimate-graph` theme is an
engineering form: white sheet, dark ink, safety-orange accent, condensed Oswald headings.

What it demonstrates:

- `data-nk-format="document"` + `data-nk-page="letter"` on `<main>` — a document instead of slides;
- estimate tables from text personalization fields: one line per item
  "Description | unit | qty | rate", a "# Section" line opens a section; line amounts,
  section subtotals, the summary with a discount and the payment schedule are computed in `deck.js`;
- a per-client property photo (`type: image`) with a bundled plan sketch as the fallback;
- the client approves right in the document: `data-nk-action="accept"` / `questions`,
  the decision and comments land on the client card (`collectFromClient`);
- print rules: `thead` repeats on every page, rows and blocks never split
  (`break-inside: avoid`), a footer on every sheet.

The contractor's details ("Northline Builders") are fixed copy in `index.html` — replace
them with the user's company once when adapting the template.

Compose and validate from the repository root:

To build on this deck, copy `decks/renovation-estimate/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
