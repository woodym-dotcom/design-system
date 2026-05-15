# automationArmoury UI kit

> Ops & automation platform. Brand accent **cyan** (`hue 210`), but the personality is **mono-forward**: JetBrains Mono everywhere data appears, dense rows, and the runtime status palette (running / queued / success / failed / paused).

Like CompanyCo, AA uses the **horizontal-shell** layout. The product surface focuses on automation runs, queues, and runtime telemetry — not list-of-entities work. The canonical landing screen is the **Runs** tray + **detail** of a single run.

## What's here

- `index.html` — interactive **Runs** console: tasks tray on the left, run detail on the right (logs, timeline, payload).
- `RunsTray.jsx` — vertical list of in-flight + recently-finished tasks with runtime status dots and a pulsing running indicator.
- `RunDetail.jsx` — run detail: meta header, timeline, logs (mono).
- `data.js` — fake runs + log lines.
