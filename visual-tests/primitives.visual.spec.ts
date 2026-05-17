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
