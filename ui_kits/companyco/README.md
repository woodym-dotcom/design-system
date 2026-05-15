# CompanyCo UI kit

> GRC (governance, risk & compliance) admin platform. Brand accent **cyan** (`hue 210`). **Horizontal-shell** layout: 44px topbar across the top, 52px icon-only nav rail on the left, 40px breadcrumb strip above the content pane.

## What's here

- `index.html` — interactive recreation of the **Vendors** list page, the canonical `ListPage` keystone surface. Shell (topbar + navrail + breadcrumbs) is real; the filter bar, vendor table, and right-edge detail pane are wired so clicking a row opens the pane, clicking filter chips toggles them, and Esc dismisses.
- `Shell.jsx` — topbar + navrail + breadcrumb layout primitives.
- `ListPage.jsx` — page header + filter bar + table + detail pane composition.
- `DetailPane.jsx` — slide-in right pane (420px, slides 40px + opacity).
- `data.js` — fake vendor + alert data.

## Pixel-fidelity notes

The layout, colors, spacing, radii and component primitives come directly from the imported `@ds/core` CSS files. The JSX wrappers are *cosmetic* only — they output the canonical `.cc-*` class names and let the design system carry all visual responsibility.
