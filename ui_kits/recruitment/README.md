# recruitment-woody UI kit

> Recruitment management tool. Brand accent **ember / warm orange** (`hue 30`). **Sidebar-first shell**: 72px left rail with logo + icon-only nav + footer controls; no persistent topbar on desktop. Minimal, Inter-only.

The canonical landing screen is the **Candidates** pipeline view — each candidate is a record-card and the workflow uses the phase palette (`screen → allocate → score → approve → complete`).

## What's here

- `index.html` — interactive **Candidates** pipeline: sidebar shell, filter rail (sidebar-layout filter bar), candidate cards grouped by phase. Click a card to open the detail pane.
- `Sidebar.jsx` — 72px desktop left rail with logo + nav + footer identity.
- `Pipeline.jsx` — phase columns and candidate cards (`cc-record-card`).
- `data.js` — fake candidate data.
