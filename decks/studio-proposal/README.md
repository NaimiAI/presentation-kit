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

Sender details (studio name and contacts) are the `STUDIO` constant in
`slides/content.ts`; replace them with your own data.

Build: `node scripts/build-deck.mjs studio-proposal` from the kit root.
