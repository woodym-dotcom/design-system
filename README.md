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
3. No attribute → light by default. Persist `system` explicitly if a consumer wants OS-follow behaviour.

To let users toggle, set `document.documentElement.dataset.theme = "dark" | "light"` (persist in localStorage). If a consumer wants OS-follow behaviour, persist `system` and omit the attribute. Companyco's `--amber/--ink/--paper` are theme-invariant — the auth/editorial surface stays dark on purpose.

## Contribution rules

- A new component → `primitives/primitives.css` under a `cc-*` selector, colors via `var(--...)` only.
- A new brand → `brands/<name>.css`. Must set `--accent-*`, `--font-sans`, optionally `--font-brand*`.
- Never hardcode hex inside `primitives/` or `tokens/core.css`.
- The `source/` dir is the frozen export from claude.ai/design; do not edit it.
