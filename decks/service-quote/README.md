# service-quote — managed services quote, Letter-size document

A preliminary quote for a monthly managed service (managed IT) in the kit's **document
format**: five Letter sheets, the PDF prints portrait pages. The `quote-corporate` theme is a
corporate document: white sheet, blue accent, Manrope headings, pastel 3D section pictograms
from the `clay-3d` art pack.

What it demonstrates:

- a document with interaction: the client picks the support tier with buttons
  (`data-nk-field="serviceLevel"` + `data-nk-action="option-select"`) — the quote on page
  one recalculates and the choice lands on the client card;
- the service scope from the stages editor (`showStagesEditor: true`): a block = name +
  monthly price + "what's included | detail" lines; Premium is a multiplier over Standard;
- an SLA comparison table that highlights the selected column; client parameters and
  "where things stand today" are personalization;
- confirm the quote / book a call (`accept` / `book-call`), signatures, account manager.

The provider's details ("Beacon IT") are fixed copy in `index.html` — replace them with
the user's company once when adapting the template.

Compose and validate from the repository root:

To build on this deck, copy `decks/service-quote/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
