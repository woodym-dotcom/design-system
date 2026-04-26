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

## Contribution rules

- A new component → `primitives/primitives.css` under a `cc-*` selector, colors via `var(--...)` only.
- A new React primitive should export from `react/index.ts` and prefer shared metadata-driven APIs over consumer-specific prop lists.
- A new brand → `brands/<name>.css`. Must set `--accent-*`, `--font-sans`, optionally `--font-brand*`.
- Never hardcode hex inside `primitives/` or `tokens/core.css`.
- The `source/` dir is the frozen export from claude.ai/design; do not edit it.
