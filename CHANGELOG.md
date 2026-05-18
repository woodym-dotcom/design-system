# Changelog

## 0.7.0 — design handoff audit

Breaking visual changes. Consumers must re-baseline visual regressions and
remove any references to the editorial layer.

### Breaking — brand hues restored

The four brand files had drifted to `--brand-hue: 30` (ember), collapsing the
multi-brand contract. Restored to documented values:

| Brand | Was | Now |
|---|---|---|
| `brands/companyco.css` | 30 | **210** (cyan) |
| `brands/automation.css` | 30 | **210** (cyan) |
| `brands/customer-lifecycle.css` | 30 | **265** (indigo) |
| `brands/recruitment.css` | 30 | 30 (unchanged, ember) |

`--brand-chroma` is held at `0.15` across the family.

### Breaking — editorial layer removed

The companyco editorial surface is gone system-wide. Any consumer referencing
the following tokens will fall through to its inline fallback or `unset`:

- `--font-brand`, `--font-brand-sans` — replaced by `--font-sans` (`system-ui`)
- `--amber-50` … `--amber-600` — gone
- `--ink-0`, `--ink-1`, `--paper`, `--paper-ink` — gone
- `.t-brand-headline`, `.t-brand-h2`, `.t-brand-tagline`, `.t-brand-eyebrow` — removed from `tokens/type-scale.css`

Auth screens, marketing pages, and product UI now share the same `system-ui`
sans stack. Consumer apps that want a branded face should override
`--font-sans` / `--font-mono` at their own layer.

### Breaking — status palette lifted

Light-mode status primaries were desaturated past recognition. Lifted:

| Token | Was | Now |
|---|---|---|
| `--error` | `#7a2418` | `#b04432` |
| `--success` | `#15803d` | `#2f7a4a` |
| `--warning` | `#92660a` | `#b8821e` |
| `--info` | `#2c5282` | `#3c5d8a` |

Light `--warning-contrast` switched from `#ffffff` to `#161513` to maintain
WCAG AA. Dark `--error` lifted from `#c2563f` to `#cc6450` for the same
reason.

`*-light`, `*-border`, `*-text`, `*-strong` companion tokens unchanged
(except dark `--error-light` / `--error-border` rgba values follow the new
base).

### Breaking — dark neutrals warmed

`tokens/tailwind-bridge.css` dark HSL ramp regenerated from the warm-charcoal
hex source in `tokens/core.css`. Consumers using the Tailwind HSL shims will
see a tonal shift in dark mode (cool blue-gray → warm charcoal).

### Other

- `--radius-pill` restored to `9999px` (was `3px`).
- `--text-eyebrow: 0.7rem` added; `.t-eyebrow` and `.cc-eyebrow` now read from it.
- `primitives/primitives.css`: eight hardcoded `border-radius: 999px` literals swept to `50%` or `var(--radius-pill)`; banner/status-pill Tailwind-bright fallbacks dropped; `.cc-coming-soon__title` no longer pulls editorial serif; three decorative `--font-mono` usages dropped (six ground-truth usages kept).
- `ui_kits/recruitment/Sidebar.jsx`: logo dot uses `var(--surface-0)` instead of removed `--paper`.
- README + SKILL.md aligned to no-editorial-layer contract.

### Tooling

- Dependencies upgraded: storybook 9→10, vite 6→8, typescript 5→6, plus playwright, vitest, react, recharts, zod, axe-core, jsdom, @types/react.
- New: `pnpm test:tokens` pins audit invariants (brand hues, no editorial tokens, `--radius-pill: 9999px`, no `.t-brand-*`, no hardcoded `999px` radii).
- `pnpm run ci` now runs `check:contrast`, `test:primitives`, `test:tokens` in addition to the existing chain.

### Migration checklist for consumer apps

1. Bump `@ds/core` to `^0.7.0`.
2. Search and remove any local references to: `--font-brand`, `--font-brand-sans`, `--amber-*`, `--ink-0`, `--ink-1`, `--paper`, `--paper-ink`, `.t-brand-*`.
3. Re-baseline visual regression snapshots (accent colours, status colours, dark mode neutrals will shift).
4. If you rely on the cool-blue dark Tailwind shims, audit the new warm-charcoal values in `tokens/tailwind-bridge.css`.
5. If your app provides its own editorial face (Inter / Playfair / DM Sans), override `--font-sans` / `--font-mono` at the consumer layer.
