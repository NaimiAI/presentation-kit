# price-quote — supplier's price quote on letterhead, Letter-size document

A supplier's price quote (corporate gifts) in the kit's **document format**: four Letter
sheets — a cover letter on letterhead with salutation and signature, the itemized quote,
product descriptions, terms. The `offer-letterhead` theme is an official letterhead: cream
sheet, navy ink, brass accent, Prata serif, charcoal product sketches from the `charcoal`
art pack.

What it demonstrates:

- the "letter on letterhead" genre: company details, quote number, a salutation from
  personalization, an optional extra paragraph (`data-nk-hide-empty`), the founder's
  signature and a CSS stamp;
- line items from a text field "Description | SKU | Unit | Qty | Unit price": subtotal,
  discount, estimated sales tax at a per-client rate, total and the **amount in words** are
  computed in `deck.js`;
- product pictures as files in the bundle (`mix-blend-mode: multiply` on the cream sheet);
- terms as a "parameter — value" table, the client's response (`accept` / `sample-request`)
  right in the document, signatures of both parties.

The supplier's details ("Harbor Merch Co.") are fixed copy in `index.html` — replace them
with the user's company once when adapting the template.

Compose and validate from the repository root:

To build on this deck, copy `decks/price-quote/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
