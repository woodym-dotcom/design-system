#!/usr/bin/env node
/**
 * CI gate: every *.stories.tsx file must be covered by at least one of:
 *   (a) a committed snapshot under visual-tests/snapshots/ (any platform), OR
 *   (b) a registered entry in visual-tests/primitives.visual.spec.ts whose
 *       `name` starts with the story's component stem.
 *
 * Option (b) covers darwin-only entries whose real baseline is generated on
 * macOS CI via `pnpm test:visual:update` on first run — those stories are
 * intentionally registered in the spec without a committed snapshot file.
 *
 * The convention used by visual-tests/primitives.visual.spec.ts is that snapshot
 * names start with the React component name (e.g. "ListView-Default-darwin.png").
 * This script maps each story file stem to its component name by stripping ".stories".
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const storiesDir = join(root, 'stories');
const snapshotsRoot = join(root, 'visual-tests', 'snapshots');
const specFile = join(root, 'visual-tests', 'primitives.visual.spec.ts');

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

/**
 * Extract the set of `name` prefixes registered in primitives.visual.spec.ts.
 * We match lines like:  { name: 'Foo-Bar',  ... }
 * and extract the component stem (everything before the first '-').
 */
function collectSpecStems() {
  if (!existsSync(specFile)) return new Set();
  const src = readFileSync(specFile, 'utf8');
  const stems = new Set();
  for (const m of src.matchAll(/\{\s*name:\s*'([^']+)'/g)) {
    stems.add(m[1].split('-')[0]);
  }
  return stems;
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
const specStems = collectSpecStems();

const missing = [];
for (const stem of storyFiles) {
  const hasSnapshot = snapshotFiles.some((s) => s.startsWith(stem));
  const inSpec = specStems.has(stem);
  if (!hasSnapshot && !inSpec) {
    missing.push(stem);
  }
}

if (missing.length > 0) {
  console.error(
    `ERROR: The following story files have no visual regression baseline:\n` +
      missing.map((m) => `  - stories/${m}.stories.tsx`).join('\n') +
      '\n\nEither:\n' +
      '  • Run `pnpm test:visual:update` to generate snapshots, then commit them, OR\n' +
      '  • Register the story in visual-tests/primitives.visual.spec.ts\n' +
      '    (darwin baselines regenerate automatically on macOS CI).',
  );
  process.exit(1);
}

console.log(`Visual regression coverage OK — ${storyFiles.length} story file(s) covered.`);
