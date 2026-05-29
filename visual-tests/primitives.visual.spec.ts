/**
 * Visual regression baselines — one canonical story per component file.
 *
 * Snapshots are committed to visual-tests/snapshots/ and compared on every
 * CI run. Darwin (macOS) and linux baselines live side-by-side; Playwright
 * picks the correct platform file automatically.
 *
 * Story URL format: /iframe.html?id=<kebab-group>-<kebab-name>--<kebab-story>
 *
 * darwin stubs marked with a comment were generated as placeholder copies on
 * Windows and must be regenerated on macOS CI with `pnpm test:visual:update`.
 */

import { expect, test } from '@playwright/test';

const STORIES: Array<{ name: string; storyId: string }> = [
  // ── Shell ────────────────────────────────────────────────────────────────
  { name: 'AppShell-CompanycoMulti',          storyId: 'shell-appshell--companyco-multi' },
  { name: 'AppShell-CompanycoSingle',         storyId: 'shell-appshell--companyco-single' },
  { name: 'AppShell-RecruitmentMulti',        storyId: 'shell-appshell--recruitment-multi' },
  { name: 'AppShell-RecruitmentSingle',       storyId: 'shell-appshell--recruitment-single' },
  { name: 'AppShell-CustomerLifecycleMulti',  storyId: 'shell-appshell--customer-lifecycle-multi' },
  { name: 'AppShell-CustomerLifecycleSingle', storyId: 'shell-appshell--customer-lifecycle-single' },
  { name: 'AppShell-AutomationMulti',         storyId: 'shell-appshell--automation-multi' },
  { name: 'AppShell-AutomationSingle',        storyId: 'shell-appshell--automation-single' },
  { name: 'ModuleShell-NamedProps',           storyId: 'shell-moduleshell--named-props' },
  { name: 'NavRail-Default',                  storyId: 'shell-navrail--default' },
  { name: 'TopRightCreateWizard-Default',     storyId: 'shell-toprightcreatewizard--default' },
  { name: 'CompanyGroupSwitcher-Default',     storyId: 'shell-companygroupswitcher--default' },

  // ── Artefact ─────────────────────────────────────────────────────────────
  { name: 'ArtefactDetailPane-FullPane',      storyId: 'artefact-artefactdetailpane--full-pane' },

  // ── Primitives — Page template ────────────────────────────────────────────
  // (renamed from ModuleTemplate in DS-SIMPLIFY 04 / f8cd4b6)
  { name: 'Page-List',          storyId: 'primitives-page--list' },
  { name: 'Page-Config',        storyId: 'primitives-page--config' },
  { name: 'Page-Monitor',       storyId: 'primitives-page--monitor' },
  { name: 'Page-Review',        storyId: 'primitives-page--review' },
  { name: 'Page-Detail',        storyId: 'primitives-page--detail' },
  { name: 'Page-Auth',          storyId: 'primitives-page--auth' },
  { name: 'Page-AuthWithError', storyId: 'primitives-page--auth-with-error' },
  { name: 'Page-Home',          storyId: 'primitives-page--home' },
  { name: 'Page-Tabs',          storyId: 'primitives-page--tabs' },
  { name: 'Page-Workbench',     storyId: 'primitives-page--workbench' },
  { name: 'Page-Studio',        storyId: 'primitives-page--studio' },
  { name: 'Page-Console',       storyId: 'primitives-page--console' },
  { name: 'Page-Inspector',     storyId: 'primitives-page--inspector' },
  { name: 'Page-Dashboard',     storyId: 'primitives-page--dashboard' },

  // ── Primitives — Overlay (DS-SIMPLIFY 01) ────────────────────────────────
  { name: 'Overlay-Modal',        storyId: 'primitives-overlay--modal' },
  { name: 'Overlay-DrawerRight',  storyId: 'primitives-overlay--drawer-right' },
  { name: 'Overlay-DrawerLeft',   storyId: 'primitives-overlay--drawer-left' },
  { name: 'Overlay-DetailRight',  storyId: 'primitives-overlay--detail-right' },
  { name: 'Overlay-Drilldown',    storyId: 'primitives-overlay--drilldown' },
  { name: 'Overlay-Fullscreen',   storyId: 'primitives-overlay--fullscreen' },

  // ── Primitives — State (DS-SIMPLIFY 02) ──────────────────────────────────
  { name: 'State-AllVariantsPage',   storyId: 'primitives-state--all-variants-page' },
  { name: 'State-AllVariantsBanner', storyId: 'primitives-state--all-variants-banner' },
  { name: 'State-AllVariantsChip',   storyId: 'primitives-state--all-variants-chip' },

  // ── Primitives — ActivityTimeline (DS-SIMPLIFY 09) ───────────────────────
  { name: 'ActivityTimeline-FlatDefault',        storyId: 'primitives-activitytimeline--flat-default' },
  { name: 'ActivityTimeline-TimelineVariant',    storyId: 'primitives-activitytimeline--timeline-variant' },
  { name: 'ActivityTimeline-FlatGroupByDay',     storyId: 'primitives-activitytimeline--flat-group-by-day' },
  { name: 'ActivityTimeline-TimelineGroupByDay', storyId: 'primitives-activitytimeline--timeline-group-by-day' },
  { name: 'ActivityTimeline-DensityCompact',     storyId: 'primitives-activitytimeline--density-compact' },
  { name: 'ActivityTimeline-DensitySpacious',    storyId: 'primitives-activitytimeline--density-spacious' },
  { name: 'ActivityTimeline-ExpandableDiffs',    storyId: 'primitives-activitytimeline--expandable-diffs' },
  { name: 'ActivityTimeline-LoadingEmpty',       storyId: 'primitives-activitytimeline--loading-empty' },
  { name: 'ActivityTimeline-EmptyState',         storyId: 'primitives-activitytimeline--empty-state' },
  { name: 'ActivityTimeline-AllFeatures',        storyId: 'primitives-activitytimeline--all-features-combined' },

  // ── Primitives — AISuggestionsPane (DS-SIMPLIFY 10) ──────────────────────
  { name: 'AISuggestionsPane-Empty',     storyId: 'primitives-aisuggestionspane--empty' },
  { name: 'AISuggestionsPane-Populated', storyId: 'primitives-aisuggestionspane--populated' },
  { name: 'AISuggestionsPane-Loading',   storyId: 'primitives-aisuggestionspane--loading' },
  { name: 'AISuggestionsPane-Error',     storyId: 'primitives-aisuggestionspane--error-state' },
  { name: 'AISuggestionsPane-MidEdit',   storyId: 'primitives-aisuggestionspane--mid-edit' },

  // ── Primitives — EntityPicker (DS-SIMPLIFY 07) ───────────────────────────
  { name: 'EntityPicker-Empty',         storyId: 'primitives-entitypicker--empty' },
  { name: 'EntityPicker-Typing',        storyId: 'primitives-entitypicker--typing' },
  { name: 'EntityPicker-WithSelection', storyId: 'primitives-entitypicker--with-selection' },
  { name: 'EntityPicker-MultiSelect',   storyId: 'primitives-entitypicker--multi-select' },

  // ── Primitives — BulkSelectableTable (Phase 2 foundation) ────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'BulkSelectableTable-Default', storyId: 'primitives-bulkselectabletable--default' },

  // ── Primitives — Graph ────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Graph-SparklineDefault', storyId: 'primitives-graph--sparkline-default' },

  // ── Primitives — Tag ──────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Tag-VariantMatrix', storyId: 'primitives-tag--variant-matrix' },

  // ── Layout — Disclosure ───────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Disclosure-Uncontrolled', storyId: 'layout-disclosure--uncontrolled-disclosure' },

  // ── Layout — Menu ─────────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Menu-Default', storyId: 'layout-menu--default' },

  // ── Layout — Row ──────────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Row-GapVariants', storyId: 'layout-row--gap-variants' },

  // ── Layout — Stack ────────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Stack-GapVariants', storyId: 'layout-stack--gap-variants' },

  // ── Layout — Text ─────────────────────────────────────────────────────────
  // darwin baseline: must be regenerated on macOS CI (stub placeholder committed)
  { name: 'Text-SizeVariants', storyId: 'layout-text--size-variants' },

  // ── Foundation ────────────────────────────────────────────────────────────
  { name: 'Toast-Default',            storyId: 'foundation-toast--default' },
  { name: 'Tooltip-OpenForSnapshot',  storyId: 'foundation-tooltip--open-for-snapshot' },
  { name: 'Kbd-Default',              storyId: 'foundation-kbd--default' },
  { name: 'Avatar-Roster',            storyId: 'foundation-avatar--roster' },
  { name: 'Skeleton-Default',         storyId: 'foundation-skeleton--default' },
  { name: 'EmptyState-Variants',      storyId: 'foundation-emptystate--variants' },
  { name: 'Breadcrumbs-Default',      storyId: 'foundation-breadcrumbs--default' },
  { name: 'CommandPalette-Default',   storyId: 'foundation-commandpalette--default' },
  { name: 'CommandPalette-WithFilterChips',      storyId: 'foundation-commandpalette--with-filter-chips' },
  { name: 'CommandPalette-WithCustomRenderItem', storyId: 'foundation-commandpalette--with-custom-render-item' },
  { name: 'CreationWizard-Default',   storyId: 'foundation-creationwizard--default' },
  { name: 'Trays-Tasks',              storyId: 'foundation-trays--tasks' },
  { name: 'ShareReadOnlyLink-Inline', storyId: 'foundation-sharereadonlylink--inline' },
  { name: 'Fmt-DefaultLocale',        storyId: 'foundation-fmt--default-locale' },
  { name: 'SavedViewsMenu-Open',      storyId: 'foundation-savedviewsmenu--open' },
  { name: 'FirstRunGuide-Default',    storyId: 'foundation-firstrunguide--default' },
  { name: 'HomepageCards-AdminView',  storyId: 'foundation-homepagecards--admin-view' },

  // ── ListPage ──────────────────────────────────────────────────────────────
  { name: 'ListPage-CompaniesLike',   storyId: 'shell-primitives-listpage--companies-like' },

  // ── FilterBarLayouts ──────────────────────────────────────────────────────
  { name: 'FilterBarLayouts-Horizontal', storyId: 'shell-primitives-filterbarlayouts--horizontal' },
];

for (const story of STORIES) {
  test(`${story.name} visual baseline`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.storyId}&viewMode=story`);
    // Wait for the story iframe content to settle
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
}
