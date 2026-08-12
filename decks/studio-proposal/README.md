# studio-proposal — studio service-proposal document

A service proposal in a printed-document style: framed cover, serif
`proposal-paper` theme shipped inside the deck, our understanding, process,
stage-based estimate, and a signature block.

What it demonstrates:

- deep personalization: project title, our understanding, dates, pricing note,
  and working terms are all filled by the manager when creating a presentation;
- estimate through the stages editor (`showStagesEditor: true` + `stagesJson`);
- custom deck theme without editing `index.html` (CSS preset + `data-theme` from
  `slides/index.ts`);
- document without interactive fields (`demoData.fields: []`).

Sender details (studio name and contacts) live in the slide markup in
`index.html`; replace them with your own data.

To build on this deck, copy `decks/studio-proposal/` into your working folder and add
`template/naimi-kit/` next to it — see `TEMPLATE-SKILL.md` (or just tell your agent
which deck you want to start from).
