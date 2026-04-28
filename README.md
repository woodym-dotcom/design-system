# @ds/core — shared design system

Source of truth for visual tokens and primitives across:

- `companyco` (GRC admin, indigo + amber editorial)
- `recruitment-woody` (terracotta)
- `automationArmoury` (TBD)

## Shape

```
tokens/
  core.css        — neutrals, spacing (4pt), radii, shadows, motion, status/semantic surfaces
  type-scale.css  — size/weight/line-height scale (font-family supplied by brand)
  viz.css         — status / severity / tier palettes with dark-mode override
brands/
  companyco.css   — indigo accent, amber editorial, Inter + Playfair + DM Sans
  recruitment.css — terracotta accent, Inter-only
  automation.css  — stub
primitives/
  primitives.css  — cc-* classes (panel, btn, chip, field, record-row, combobox, ...)
source/           — extracted Claude Design bundle (historical reference)
```

## Consumption

Every consumer imports in this order:

```css
@import "@ds/core/tokens/core.css";
@import "@ds/core/tokens/type-scale.css";
@import "@ds/core/tokens/viz.css";
@import "@ds/core/brands/<brand>.css";   /* exactly one */
@import "@ds/core/primitives/primitives.css";
```

Brand files override token values (accent palette, fonts) defined in `core.css`.
Never define accent/brand values outside `brands/*`.

## Theming

All tokens are defined for **both light and dark**. Resolution:

1. `html[data-theme="dark"]` → dark.
2. `html[data-theme="light"]` → light (wins over OS pref).
3. No attribute → follows OS preference.
4. If no preference is available, light remains the fallback.

Out of the box, both themes should be readable. Consumers should not rely on forcing light mode to hide dark-theme contrast bugs.

To let users toggle, set `document.documentElement.dataset.theme = "dark" | "light"` (persist in localStorage). If a consumer wants OS-follow behaviour, persist `system` and omit the attribute. Companyco's `--amber/--ink/--paper` are theme-invariant — the auth/editorial surface stays dark on purpose.

## Charts

`@ds/core/react` exports `MetricChartCard`, a shared Recharts wrapper for dashboard-style metric cards.

Default grammar for time-series charts:
- daily bars first
- SMA 7 + SMA 28 overlays when smoothing helps
- default date window is 12 months or earliest available history
- explanatory copy stays behind the small info marker instead of showing as full prose by default
- category toggles live above the chart, not in a legend row below it
- on mobile, tap a bar/point to reveal the per-series detail panel

Recommended API shape:
- `meta.chartKind`: `bar`, `line`, or `composed`
- `meta.axes.x|y.unit`: axis units except obvious dimensions like dates
- `meta.series[]`: label, kind, color, stackId, and `defaultVisible`

Stacked bars should only round the top visible segment. If a series is hidden, the next visible segment becomes the rounded top.

## Module primitives

`@ds/core/react` exports four module-level primitives shared across consumers. CSS lives in `primitives/primitives.css` under `cc-*` selectors; React wrappers are thin and use design tokens only.

### `<ModuleShell>`

4-tab module wrapper: review queue, monitoring, list, configurations. Each tab is individually optional — omit a prop to hide that tab. Default tab is `list` (falls back to the first available tab if `list` is omitted). Active tab is mirrored to the URL via a search param (default `?tab=…`); `popstate` is honoured, and arrow keys / `Home` / `End` navigate between tabs.

```tsx
import { ModuleShell } from '@ds/core/react';

<ModuleShell
  title="Vendors"
  actions={<button className="cc-btn cc-btn--primary">New vendor</button>}
  list={{ label: 'List', render: () => <VendorList /> }}
  review={{ label: 'Review queue', render: () => <ReviewQueue /> }}
  configurations={{ label: 'Configurations', render: () => <Configs /> }}
/>;
```

Props: `title`, `actions?`, `review?`, `monitoring?`, `list?`, `configurations?` (each `{ label, render }`), `searchParamName?` (default `tab`), `defaultTab?` (default `list`), `className?`.

### `<CreationWizard>`

Stepped form. Horizontal nav on wide viewports, vertical-pinned-to-top on narrow viewports (CSS `@media (max-width: 767px)`).

```tsx
<CreationWizard
  initialValues={{ name: '', owner: '' }}
  steps={[
    { id: 'basics', label: 'Basics', render: ({ values, setValues }) => <BasicsStep values={values} onChange={setValues} /> },
    { id: 'access', label: 'Access', render: ({ values, setValues }) => <AccessStep values={values} onChange={setValues} /> },
  ]}
  aiReview={{
    label: 'AI review',
    reviewer: async (values) => myAaOrchestratorClient.reviewCreate(values), // consumer wires AA Orchestrator
  }}
  onSubmit={async (values) => myApi.create(values)}
/>;
```

Props: `steps: { id, label, render }[]`, `initialValues`, `onSubmit(values)`, `aiReview?: { label?, reviewer(values): Promise<{ summary, suggestions?, ok }> }`, `submitLabel?`, `className?`.

The `reviewer` is consumer-supplied; this primitive does not import any provider SDK or call AA directly (workspace rule §18).

### `<ListPageHeader>`

Top-of-list bar standardised across modules: title, optional subtitle, filter slot, create-button slot.

```tsx
<ListPageHeader
  title="Vendors"
  subtitle="Onboarded suppliers and their risk posture"
  filters={<VendorFilters />}
  createAction={<button className="cc-btn cc-btn--primary">New vendor</button>}
/>;
```

Props: `title`, `subtitle?`, `filters?`, `createAction?`, `className?`.

### `<DetailPane>`

Right-side slide-in panel with backdrop, ARIA `role="dialog"`, focus-trap, and ESC-to-close. Width is capped at `min(560px, 100vw)`.

```tsx
<DetailPane
  open={selected !== null}
  onClose={() => setSelected(null)}
  title={selected?.name ?? ''}
  sections={[
    { heading: 'Owner', content: selected?.owner },
    { heading: 'Risk score', content: <RiskBadge value={selected?.risk} /> },
  ]}
/>;
```

Props: `open`, `onClose`, `title`, `sections: { heading, content }[]`, `className?`.

Built-in copy is sentence-case. Date defaults follow `en-GB` (DD-MON-YYYY) where the primitive owns formatting; consumers always retain control of section content.

## Contribution rules

- A new component → `primitives/primitives.css` under a `cc-*` selector, colors via `var(--...)` only.
- A new React primitive should export from `react/index.ts` and prefer shared metadata-driven APIs over consumer-specific prop lists.
- A new brand → `brands/<name>.css`. Must set `--accent-*`, `--font-sans`, optionally `--font-brand*`.
- Never hardcode hex inside `primitives/` or `tokens/core.css`.
- The `source/` dir is the frozen export from claude.ai/design; do not edit it.
