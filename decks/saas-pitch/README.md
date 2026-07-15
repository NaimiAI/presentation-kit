# saas-pitch — SaaS product pitch with a pricing calculator

Product pitch for the fictional "Relay" customer-communications platform in a
dark neon `orbit-night` theme, shipped inside the deck: gradient hero,
problem/solution, CSS-only interface mockup (no screenshots), interactive pricing
configurator, and pilot CTA.

What it demonstrates:

- interactive choices during a call: plan (string), seats (number,
  `promoteToClientFacts`), annual/monthly billing (boolean), all through
  `useDemoField`; the manager sees the saved choice on the presentation;
- a product slide without assets: the interface is built from divs and animated;
- light personalization: company, contact, deal manager.

Product and pricing are constants in `slides/content.ts`; replace them with your
own.

Build: `node scripts/build-deck.mjs saas-pitch` from the kit root.
