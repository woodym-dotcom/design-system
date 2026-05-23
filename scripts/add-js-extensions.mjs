#!/usr/bin/env node
// Post-tsc step: rewrite extensionless relative imports in dist/ to add `.js`.
// Required because consumers running Node ESM (Vitest, SSR runtimes) can't
// resolve extensionless paths inside `node_modules/`, even though Vite can.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const isRelative = (s) => s.startsWith('./') || s.startsWith('../');

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function resolveSpecifier(fromFile, spec) {
  // Use node:path/dirname so this works on Windows ('\\' separators) AND Unix ('/').
  const fromDir = dirname(fromFile);
  const base = join(fromDir, spec);
  if (await exists(base + '.js')) return spec + '.js';
  if (await exists(join(base, 'index.js'))) return spec.replace(/\/$/, '') + '/index.js';
  return null;
}

const IMPORT_RE = /(\bfrom\s+|\bimport\s*\(\s*)(['"])((?:\.\.?\/)[^'"]+)\2/g;
const EXPORT_FROM_RE = /(\bexport\s+(?:\*|\{[^}]*\})\s*from\s+)(['"])((?:\.\.?\/)[^'"]+)\2/g;

let touched = 0;
for await (const file of walk(DIST)) {
  if (!file.endsWith('.js') && !file.endsWith('.d.ts')) continue;
  const src = await readFile(file, 'utf8');
  let out = src;
  const rewrite = async (match, prefix, quote, spec) => {
    if (!isRelative(spec) || spec.endsWith('.js') || spec.endsWith('.json')) return match;
    const resolved = await resolveSpecifier(file, spec);
    if (!resolved) return match;
    return `${prefix}${quote}${resolved}${quote}`;
  };
  // String.prototype.replaceAll with async function isn't supported — do it manually.
  for (const re of [IMPORT_RE, EXPORT_FROM_RE]) {
    const matches = [...out.matchAll(re)];
    for (const m of matches.reverse()) {
      const replacement = await rewrite(m[0], m[1], m[2], m[3]);
      if (replacement !== m[0]) {
        out = out.slice(0, m.index) + replacement + out.slice(m.index + m[0].length);
      }
    }
  }
  if (out !== src) {
    await writeFile(file, out);
    touched++;
  }
}
console.log(`add-js-extensions: rewrote ${touched} files`);
