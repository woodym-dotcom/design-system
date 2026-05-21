/**
 * Visual regression baselines for the 5 shell primitives.
 *
 * One canonical (golden-path) story per primitive is snapshotted.
 * Snapshots are committed to visual-tests/snapshots/ and compared on every CI run.
 *
 * Story URL format: /iframe.html?id=<kebab-group>-<kebab-name>--<kebab-story>
 */

import { expect, test } from '@playwright/test';

const STORIES: Array<{ name: string; storyId: string }> = [
  // Pre-existing shell primitives. ListView was deleted in Phase 2; its
  // story + snapshot are gone too.
  { name: 'ExpandableDetailPane-Default', storyId: 'shell-primitives-expandabledetailpane--default' },
  { name: 'TopRightCreateWizard-Default', storyId: 'shell-primitives-toprightcreatewizard--default' },
  { name: 'NavRail-Default',              storyId: 'shell-primitives-navrail--default' },
  { name: 'ModuleShell-NamedProps',       storyId: 'shell-primitives-moduleshell--named-props' },
  { name: 'ArtefactDetailPane-FullPane',  storyId: 'artefact-artefactdetailpane--full-pane' },
  { name: 'CompanyGroupSwitcher-Default', storyId: 'shell-primitives-companygroupswitcher--default' },

  // Previously-missing baselines for stories that already exist.
  { name: 'DetailPane-WithSubtitle',     storyId: 'shell-primitives-detailpane--with-subtitle' },
  { name: 'FilterBarLayouts-Horizontal', storyId: 'shell-primitives-filterbarlayouts--horizontal' },
  { name: 'ListPage-CompaniesLike',      storyId: 'shell-primitives-listpage--companies-like' },

  // Phase 2 foundation primitives.
  { name: 'Toast-Default',            storyId: 'foundation-toast--default' },
  { name: 'Modal-Default',            storyId: 'foundation-modal--default' },
  { name: 'Drawer-Default',           storyId: 'foundation-drawer--default' },
  { name: 'Tooltip-OpenForSnapshot',  storyId: 'foundation-tooltip--open-for-snapshot' },
  { name: 'Kbd-Default',              storyId: 'foundation-kbd--default' },
  { name: 'Avatar-Roster',            storyId: 'foundation-avatar--roster' },
  { name: 'Skeleton-Default',         storyId: 'foundation-skeleton--default' },
  { name: 'EmptyState-Variants',      storyId: 'foundation-emptystate--variants' },
  { name: 'BulkBar-Default',          storyId: 'foundation-bulkbar--default' },
  { name: 'Breadcrumbs-Default',      storyId: 'foundation-breadcrumbs--default' },
  { name: 'CommandPalette-Default',   storyId: 'foundation-commandpalette--default' },
  { name: 'Trays-Tasks',              storyId: 'foundation-trays--tasks' },
  { name: 'ShareReadOnlyLink-Inline', storyId: 'foundation-sharereadonlylink--inline' },
  { name: 'Fmt-DefaultLocale',        storyId: 'foundation-fmt--default-locale' },

  // Follow-up Phase 2 primitives (saved-views picker, onboarding, homepage).
  { name: 'SavedViewsMenu-Open',      storyId: 'foundation-savedviewsmenu--open' },
  { name: 'FirstRunGuide-Default',    storyId: 'foundation-firstrunguide--default' },
  { name: 'HomepageCards-AdminView',  storyId: 'foundation-homepagecards--admin-view' },

  // DS-SIMPLIFY 02 — State primitive.
  { name: 'State-AllVariantsPage',   storyId: 'primitives-state--all-variants-page' },
  { name: 'State-AllVariantsBanner', storyId: 'primitives-state--all-variants-banner' },
  { name: 'State-AllVariantsChip',   storyId: 'primitives-state--all-variants-chip' },

  // DS-SIMPLIFY 09 — ActivityTimeline primitive.
  { name: 'ActivityTimeline-FlatDefault',       storyId: 'primitives-activitytimeline--flat-default' },
  { name: 'ActivityTimeline-TimelineVariant',   storyId: 'primitives-activitytimeline--timeline-variant' },
  { name: 'ActivityTimeline-FlatGroupByDay',    storyId: 'primitives-activitytimeline--flat-group-by-day' },
  { name: 'ActivityTimeline-TimelineGroupByDay', storyId: 'primitives-activitytimeline--timeline-group-by-day' },
  { name: 'ActivityTimeline-DensityCompact',    storyId: 'primitives-activitytimeline--density-compact' },
  { name: 'ActivityTimeline-DensitySpacious',   storyId: 'primitives-activitytimeline--density-spacious' },
  { name: 'ActivityTimeline-ExpandableDiffs',   storyId: 'primitives-activitytimeline--expandable-diffs' },
  { name: 'ActivityTimeline-LoadingEmpty',      storyId: 'primitives-activitytimeline--loading-empty' },
  { name: 'ActivityTimeline-EmptyState',        storyId: 'primitives-activitytimeline--empty-state' },
  { name: 'ActivityTimeline-AllFeatures',       storyId: 'primitives-activitytimeline--all-features-combined' },

  // DS-SIMPLIFY 11 — CommandPalette filter chips + renderItem, CreationWizard step context.
  { name: 'CommandPalette-WithFilterChips',    storyId: 'foundation-commandpalette--with-filter-chips' },
  { name: 'CommandPalette-WithCustomRenderItem', storyId: 'foundation-commandpalette--with-custom-render-item' },
  { name: 'CreationWizard-Default',            storyId: 'foundation-creationwizard--default' },
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
