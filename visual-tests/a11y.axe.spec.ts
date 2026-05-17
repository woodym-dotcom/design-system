/**
 * axe-core a11y audit for the Phase 2 foundation primitives.
 *
 * Acceptance criterion (from the foundation roll-up ticket):
 *   "Accessibility audited via axe-core for each primitive
 *   (Modal/Drawer/Toast/Tooltip/Kbd/Avatar/Skeleton/EmptyState/BulkBar/
 *   Breadcrumbs) with zero serious/critical issues."
 *
 * Each story is loaded in the real Chromium browser (jsdom can't compute
 * layout — axe-core hangs on several rules there), axe-core is injected
 * from `node_modules`, and the test fails if any serious or critical
 * violation is reported. Colour-contrast is enforced separately by
 * `pnpm check:contrast` over the token files directly.
 */

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AXE_SRC = readFileSync(
  join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js'),
  'utf8',
);

interface AxeViolation {
  id: string;
  impact?: 'minor' | 'moderate' | 'serious' | 'critical';
  help: string;
  nodes: Array<{ target: string[]; html: string }>;
}

const STORIES: Array<{ name: string; storyId: string }> = [
  { name: 'Modal',           storyId: 'foundation-modal--default' },
  { name: 'Drawer',          storyId: 'foundation-drawer--default' },
  { name: 'Toast',           storyId: 'foundation-toast--all-tones' },
  { name: 'Tooltip',         storyId: 'foundation-tooltip--open-for-snapshot' },
  { name: 'Kbd',             storyId: 'foundation-kbd--default' },
  { name: 'Avatar',          storyId: 'foundation-avatar--roster' },
  { name: 'Skeleton',        storyId: 'foundation-skeleton--default' },
  { name: 'EmptyState',      storyId: 'foundation-emptystate--variants' },
  { name: 'BulkBar',         storyId: 'foundation-bulkbar--default' },
  { name: 'Breadcrumbs',     storyId: 'foundation-breadcrumbs--default' },
  { name: 'CommandPalette',  storyId: 'foundation-commandpalette--default' },
  { name: 'TasksTray',       storyId: 'foundation-trays--tasks' },
  { name: 'NotificationsTray', storyId: 'foundation-trays--notifications' },
  { name: 'ShareReadOnlyLink', storyId: 'foundation-sharereadonlylink--inline' },
  { name: 'Fmt',             storyId: 'foundation-fmt--default-locale' },

  // Follow-up Phase 2 primitives.
  { name: 'SavedViewsMenu',  storyId: 'foundation-savedviewsmenu--open' },
  { name: 'FirstRunGuide',   storyId: 'foundation-firstrunguide--default' },
  { name: 'HomepageCards',   storyId: 'foundation-homepagecards--admin-view' },
];

for (const story of STORIES) {
  test(`${story.name} — zero serious/critical axe violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.storyId}&viewMode=story`);
    await page.waitForLoadState('networkidle');

    // Inject axe-core into the page and run it against the story root.
    await page.addScriptTag({ content: AXE_SRC });
    const violations = await page.evaluate(async () => {
      // @ts-expect-error injected by addScriptTag
      const results = await window.axe.run(document.body, {
        // Colour-contrast is enforced separately by `pnpm check:contrast`
        // against the token files — disable here to keep this audit focused
        // on structural ARIA / accessible-name rules.
        rules: { 'color-contrast': { enabled: false } },
        resultTypes: ['violations'],
      });
      return results.violations as Array<{
        id: string;
        impact?: 'minor' | 'moderate' | 'serious' | 'critical';
        help: string;
        nodes: Array<{ target: string[]; html: string }>;
      }>;
    });

    const blocking = violations.filter(
      (v: AxeViolation) => v.impact === 'serious' || v.impact === 'critical',
    );
    if (blocking.length > 0) {
      const details = blocking
        .map(
          (v: AxeViolation) =>
            `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n  e.g. ${v.nodes[0]?.target?.join(' ')}`,
        )
        .join('\n');
      throw new Error(
        `axe found ${blocking.length} serious/critical violation(s) in ${story.name}:\n${details}`,
      );
    }
    expect(blocking).toEqual([]);
  });
}
