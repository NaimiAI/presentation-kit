# consulting-proposal — advisory engagement proposal (art pack: cyanotype)

An advisory firm proposes a twelve-week operating-model engagement to a mid-market
client. The kit's example of a **calm art pack with a rhythm**: the `cyanotype` pack
from `art/` (Prussian-blue photograms, cream paper, Playfair Display) over a nine-slide
proposal a serious buyer reads. Rhythm `pulse`: loud cover on the hero plate · three
quiet paper slides · one mid slide opened by the herbarium band · three quiet slides ·
loud close on the deep-blue field with a pasted print.

What it demonstrates:

- **an art pack over a sober genre**: `assets/art/` is a verbatim copy of
  `art/cyanotype/pack`; the pack's `.art-scrim` keeps the personalized headline legible
  over the bleed plate, spots are pasted prints (`.art-sticker`), quiet slides sit on
  the pack's paper (`.art-paper`) — at most one spot per quiet slide, none on most;
- **the priced estimate from the stages editor** (`showStagesEditor: true`,
  `stagesJson` rendered by `deck.js` with a total) — the same contract as
  `proposal-mono` and `studio-proposal`;
- **a retainer picker** (`retainer`, string, promoted to the client card) with a live
  summary line, and a **client question box** (`clientQuestions`, client self-fill,
  promoted to the client card);
- **client actions**: `retainer-select`, `accept`, `questions`;
- **dates that do the work**: proposal date, validity, and a twelve-week timeline
  counted from the kick-off date.

To restyle it, replace `assets/art/` with another calm pack (`engraving`, `charcoal`,
`sky-oil`) and change `data-theme` — the class names are the same in every pack (see
`art/README.md`).

To build on this deck, copy `decks/consulting-proposal/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
