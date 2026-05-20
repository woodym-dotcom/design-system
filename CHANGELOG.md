# Changelog

## Unreleased — @aa/ui retirement primitives

Adds the foundational pieces required for `automationarmoury/packages/ui`
(`@aa/ui`) to retire in favour of `@ds/core`, except for the AA
governance / lifecycle-domain components.

### New components

- `Button` — primary / secondary / ghost / danger variants, sm / md sizes,
  optional `icon` square padding, anchor mode via `href` with
  `aria-disabled` for disabled links.
- `Spinner` — sm / md / lg, `role="status"`, respects
  `prefers-reduced-motion` (pulses instead of spinning).
- `Chip` + `Badge` alias — six tones (neutral / success / warning / error /
  info / accent), optional remove × button, button-mode via `onClick`.
- `Tabs<T>` — generic over the tab value union; roving tabindex, arrow /
  Home / End keyboard nav with activate-on-focus, disabled-tab skipping.
- `Sparkline` — pure-SVG inline trend chart with optional area fill and
  last-point dot. Null on empty, single dot on length-1.
- `AwaitingState` — `role="status"` surface combining `Spinner` and `Chip`
  with default copy per state and a live 1s `retryAfter` countdown.
- `StaleDataPill` — warning chip + optional refresh `Button`; recomputes
  age every 30 s; null while fresh.
- `StateBanner` — per-kind banner (offline / rate-limited / permissioned-
  out / stale-data / partial / degraded); `role="alert"` for warning
  tones, `role="status"` otherwise.
- `OfflineBanner` — wraps `StateBanner kind="offline"` and subscribes to
  `window` `online`/`offline` events.
- `Diff` + `diffLines` — LCS-based line diff with split and unified
  render modes, +/- counts, optional `noEmpty=true` suppresses empty
  diffs.
- `DrilldownLayout` — two-pane list/detail surface with a
  `role="separator"` draggable handle (arrow-key nudge included) and an
  optional Expand button when `onExpandFullScreen` is bound.
- `FullScreenDetail` — sticky header (breadcrumbs + title + actions +
  optional tabs), scrollable body, optional sticky bottom bar.
- `TopBar` — brand slot, Cmd+K trigger, `ThemeToggle`, extras slot,
  identity initials button.
- `AppShell` — composes `FmtProvider` + `OfflineBanner` + `TopBar` +
  optional `NavRail` + `Breadcrumbs` + skip-to-content link.

### New hooks

- `useSplitPane` — persisted pane percentage with clamp, mouse + touch +
  arrow-key drag. Returns `containerRef`, `handleProps`, `leftPercent`.
- `useNavigateWithOrigin` + `encodeOrigin` / `decodeOrigin` /
  `buildUrlWithOrigin` — wrap a router-agnostic `navigate` to append an
  encoded `origin` query param built from the current path/label.

### Extensions to existing components

- `Card` — new `actions`, `footer`, `padded` props plus the
  `<section class="cc-card">` BEM structure. Existing callers using only
  `title / subtitle / children` continue to render the original DOM.
- `FormField` — new `as` prop (`input` / `textarea` / `select` /
  `checkbox`) plus `rows / cols / children / checked / min / max / step
  / pattern / maxLength / inline`. `as="input"` is byte-identical to
  the previous output.
- `SectionHeader` — new `titleExtras?: ReactNode` rendered inside the
  heading.
- `AuditLogList` — new `variant: "flat" | "timeline"`; default `flat`
  unchanged. Timeline groups events by ISO day with a spine + dot.
- `NavRail` — `NavRailItem.icon?: ReactNode`. In compact variant the
  icon replaces the initial letter; in expanded variant it renders
  adjacent to the label.
- `Fmt` —
  - new `Fmt.DateTime` (`mode: "relative" | "absolute" | "both"`);
  - `useFmt({ strict })` throws when no provider is mounted;
  - `FmtProvider` gains `defaultShowRaw` (uncontrolled) and
    `showRaw / onShowRawChange` (controlled); `FmtContextValue` gains
    `showRaw` + `setShowRaw`; `Fmt.*` render the raw value alongside
    the formatted output when `showRaw` is true.
  - `Lens` gains `bindShowRaw` to drive provider `showRaw`.

### Naming notes

- The new `Chip` tone palette uses `error` (matching the AA palette),
  while the pre-existing `LifecycleStateBadge` exports a `ChipTone` that
  uses `danger`. To avoid a barrel collision the `Chip` palette type is
  re-exported as `ChipPaletteTone` from the index; consumers wanting the
  literal `ChipTone` from `Chip` can import it directly from
  `@ds/core/react/Chip`.

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
