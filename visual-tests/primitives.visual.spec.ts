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
  // 5 mandated shell primitives
  {
    name: 'ListView-Default',
    storyId: 'shell-primitives-listview--default',
  },
  {
    name: 'ExpandableDetailPane-Default',
    storyId: 'shell-primitives-expandabledetailpane--default',
  },
  {
    name: 'TopRightCreateWizard-Default',
    storyId: 'shell-primitives-toprightcreatewizard--default',
  },
  {
    name: 'NavRail-Default',
    storyId: 'shell-primitives-navrail--default',
  },
  {
    name: 'ModuleShell-NamedProps',
    storyId: 'shell-primitives-moduleshell--named-props',
  },
  // Additional primitives already in stories/
  {
    name: 'ArtefactDetailPane-FullPane',
    storyId: 'artefact-artefactdetailpane--full-pane',
  },
  {
    name: 'CompanyGroupSwitcher-Default',
    storyId: 'shell-primitives-companygroupswitcher--default',
  },
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
