# saas-pitch — SaaS product pitch with a pricing calculator

Product pitch for the fictional "Relay" customer-communications platform in a
dark neon `orbit-night` theme, shipped inside the deck: gradient hero,
problem/solution, CSS-only interface mockup (no screenshots), interactive pricing
configurator, and pilot CTA.

What it demonstrates:

- interactive choices during a call: plan (string), seats (number,
  `promoteToClientFacts`), annual/monthly billing (boolean), all through
  `data-nk-field`; the manager sees the saved choice on the presentation;
- a product slide without assets: the interface is built from divs and animated;
- light personalization: company, contact, deal manager.

Product and pricing are constants in `deck.js` and the slide markup in
`index.html`; replace them with your own.

To build on this deck, copy `decks/saas-pitch/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
