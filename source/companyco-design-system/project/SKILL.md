---
name: companyco-design
description: Use this skill to generate well-branded interfaces and assets for CompanyCo, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick start

- Import `colors_and_type.css` for tokens and type (Google Fonts Inter + Playfair Display + DM Sans + JetBrains Mono).
- Product surfaces = light mode, Inter, indigo accent `#4f46e5`, tight 14px body, no emoji, no gradients, borders over shadows.
- Brand/auth/marketing surfaces = near-black `#0c0c0c` + amber `#d4a574` + paper `#fafaf8`, Playfair Display for headlines, DM Sans for micro-type, soft radial amber gradients.
- Copy: sentence case always, second-person, terse. Domain language wins.
- Icons: stroke-1.5, 20×20 viewBox, `currentColor`. Hand-drawn inline; no icon font.
- React primitives available in `ui_kits/product/` — Button, Chip, Field, Panel, SectionHeader, NavRail, AuthScreen, AppShell pieces.
