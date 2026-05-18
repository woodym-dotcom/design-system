---
name: dscore-design
description: Use this skill to generate well-branded interfaces and assets for the @ds/core multi-brand system (CompanyCo, automationArmoury, recruitment-woody, customer-lifecycle), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

This package is a snapshot of the [`woodym-dotcom/design-system`](https://github.com/woodym-dotcom/design-system) repository (the `@ds/core` design system) packaged for use by a design agent. It serves **four brands** built on the same neutral foundations, spacing, radii, motion, and `cc-*` primitives — only the accent color (computed from `--brand-hue` + `--brand-chroma` via `oklch()`) and font stack differ.

| Brand | Hue | Product | Shell |
|---|---|---|---|
| CompanyCo | 210 (cyan) | GRC admin | Horizontal topbar + 52px nav rail |
| automationArmoury | 210 (cyan, mono-forward) | Ops & automation | Horizontal topbar + 52px nav rail |
| recruitment-woody | 30 (ember) | Recruitment management | 72px left sidebar |
| customer-lifecycle | 265 (indigo) | Customer-lifecycle admin | Either shell |

## How to use this skill

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. For any HTML output, link **one** brand from `brands/<brand>.css` plus `colors_and_type.css`, then use the canonical `.cc-*` primitive classes from `primitives/primitives.css`. UI kits in `ui_kits/` show how to compose a complete product surface.

```html
<link rel="stylesheet" href="colors_and_type.css" />
<link rel="stylesheet" href="brands/recruitment.css" />  <!-- pick one -->
```

If working on production code, copy assets and read the rules in `README.md` to become an expert in designing with this brand system. The `react/` directory of the source repo (not copied here) contains the canonical TypeScript primitive layer — import from `@ds/core/react` in production rather than rewriting the JSX wrappers shown in `ui_kits/`.

## What's where

- `README.md` — high-level overview, content & visual foundations, iconography, caveats.
- `colors_and_type.css` — one-shot import for prototypes (fonts → tokens → type → viz → brand → primitives).
- `tokens/` — neutrals, spacing, radii, shadows, motion, viz palettes, density modes.
- `brands/` — one file per brand: pick exactly one.
- `primitives/primitives.css` — every `.cc-*` selector. The canonical component layer.
- `assets/` — logos, icons, illustration placeholders.
- `preview/` — design-system cards (colors, type, spacing, components, brand).
- `ui_kits/companyco/` — interactive GRC vendors list page.
- `ui_kits/automation/` — interactive ops/runs console (dark by default).
- `ui_kits/recruitment/` — interactive candidates pipeline.

## When the user invokes this skill without further guidance

Ask them what they want to build or design, ask some questions to understand which brand applies, which surface (full-page product UI? auth screen? marketing? slides?), and what fidelity is needed. Then act as an expert designer who outputs HTML artifacts **or** production code, depending on the need.

Some good opening questions:

1. Which brand is this for — CompanyCo (GRC, cyan), automationArmoury (ops, mono-forward), recruitment-woody (ember), customer-lifecycle (indigo)?
2. Is this a product-interior screen, an auth screen, a marketing slide, or something else?
3. Light theme, dark theme, or both?
4. Density — compact (operator marathon), cozy (default), or spacious (demo / accessibility)?
5. Do you have real product copy / screenshots / data I should follow?

## Hard rules — don't break these

- **No decorative gradients** in product UI. Tonal surface layering carries depth.
- **No emoji** anywhere. Use status dots and tonal chips.
- **No rounded corners with a left-border accent only** — that's an explicit anti-pattern.
- **No hand-drawn SVG icons.** Use Lucide via CDN or the snippets in `assets/icons.js`.
- **No new accent colors.** Stick to the four brand seeds; everything derives from them.
- **No long durations.** All motion is ≤200ms. Easing is the `ease` keyword.
- **Sentence case** for everything (buttons, headings, labels). Title case for proper nouns only.
- **Two platform stacks** for product UI — `--font-sans` is `system-ui` (everywhere), `--font-mono` is `ui-monospace` (code, diffs, kbd, timestamps, build IDs only). There is no editorial / serif layer; auth screens and marketing pages use the same sans stack as product UI. Consumers may override at their own layer if they want branded faces; the design system itself loads no webfonts.
- **Base font size 14px**; mobile hit-targets ≥44px. Compact density drops to 13px.
