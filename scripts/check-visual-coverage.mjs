#!/usr/bin/env node
/**
 * CI gate: every *.stories.tsx file must have at least one committed snapshot
 * under visual-tests/snapshots/ (searched recursively). Fails with exit 1 if any
 * story file has no matching snapshot.
 *
 * The convention used by visual-tests/primitives.visual.spec.ts is that snapshot
 * names start with the React component name (e.g. "ListView-Default-darwin.png").
 * This script maps each story file stem to its component name by stripping ".stories".
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const storiesDir = join(root, 'stories');
const snapshotsRoot = join(root, 'visual-tests', 'snapshots');

/** Recursively collect all .png filenames under a directory */
function collectPngs(dir) {
  if (!existsSync(dir)) return [];
  const result = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      result.push(...collectPngs(full));
    } else if (entry.endsWith('.png')) {
      result.push(entry);
    }
  }
  return result;
}

const storyFiles = readdirSync(storiesDir)
  .filter((f) => f.endsWith('.stories.tsx'))
  .map((f) => basename(f, '.stories.tsx'));

if (!existsSync(snapshotsRoot)) {
  console.error(
    `ERROR: No snapshots directory found at ${snapshotsRoot}.\n` +
      'Run `pnpm test:visual:update` to generate baseline snapshots first.',
  );
  process.exit(1);
}

const snapshotFiles = collectPngs(snapshotsRoot);

const missing = [];
for (const stem of storyFiles) {
  const hasSnapshot = snapshotFiles.some((s) => s.startsWith(stem));
  if (!hasSnapshot) {
    missing.push(stem);
  }
}

if (missing.length > 0) {
  console.error(
    `ERROR: The following story files have no visual regression baseline:\n` +
      missing.map((m) => `  - stories/${m}.stories.tsx`).join('\n') +
      '\n\nRun `pnpm test:visual:update` to generate snapshots, then commit them.',
  );
  process.exit(1);
}

console.log(`Visual regression coverage OK — ${storyFiles.length} story file(s) covered.`);
