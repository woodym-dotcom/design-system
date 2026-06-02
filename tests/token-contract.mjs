import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');

const brands = {
  'brands/companyco.css': 210,
  'brands/automation.css': 210,
  'brands/recruitment.css': 30,
  'brands/customer-lifecycle.css': 265,
};

for (const [path, expectedHue] of Object.entries(brands)) {
  const css = read(path);
  const match = css.match(/--brand-hue\s*:\s*(\d+)/);
  assert.ok(match, `${path}: --brand-hue not declared`);
  assert.equal(
    Number(match[1]),
    expectedHue,
    `${path}: --brand-hue should be ${expectedHue}, got ${match[1]}`,
  );
  const chroma = css.match(/--brand-chroma\s*:\s*([0-9.]+)/);
  assert.ok(chroma, `${path}: --brand-chroma not declared`);
  assert.equal(
    chroma[1],
    '0.15',
    `${path}: --brand-chroma should be held at 0.15, got ${chroma[1]}`,
  );
}

// The OLD editorial layer was a parallel palette (amber/ink ramp) plus
// per-brand display fonts — it drifted out of sync and was deleted. Those
// drift-prone tokens stay forbidden. The recovery (feat/editorial-brand-surface)
// does NOT reintroduce them; it derives a warm paper surface from the existing
// neutral ramp via color-mix (--surface-paper / --paper-ink / --paper-rule off a
// single --paper-warm-seed) and loads ONE display face (--font-display). Those
// sanctioned, derivation-based tokens are asserted positively further below.
const editorialTokens = [
  '--font-brand',
  '--font-brand-sans',
  '--amber-50',
  '--amber-100',
  '--amber-600',
  '--ink-0',
  '--ink-1',
  '--paper', // matches bare `--paper:` only; `--surface-paper` / `--paper-ink` (derived) are NOT caught
];

const brandAndTokenFiles = [
  ...Object.keys(brands),
  'tokens/core.css',
  'tokens/type-scale.css',
  'tokens/viz.css',
  'tokens/density.css',
  'tokens/tailwind-bridge.css',
  'primitives/primitives.css',
];

for (const path of brandAndTokenFiles) {
  const css = read(path);
  for (const tok of editorialTokens) {
    const declared = new RegExp(`${tok.replace(/[-]/g, '\\-')}\\s*:`).test(css);
    assert.ok(
      !declared,
      `${path}: editorial token ${tok} should be removed but is still declared`,
    );
  }
}

const coreCss = read('tokens/core.css');
assert.ok(
  /--radius-pill\s*:\s*9999px/.test(coreCss),
  'tokens/core.css: --radius-pill must be 9999px',
);

const typeScale = read('tokens/type-scale.css');
assert.ok(
  /--text-eyebrow\s*:/.test(typeScale),
  'tokens/type-scale.css: --text-eyebrow must be declared',
);
assert.ok(
  !/\.t-brand-/.test(typeScale),
  'tokens/type-scale.css: .t-brand-* classes must be removed',
);

const primitives = read('primitives/primitives.css');
const literal999 = primitives.match(/border-radius\s*:\s*999px/g);
assert.equal(
  literal999,
  null,
  `primitives/primitives.css: hardcoded "border-radius: 999px" should be swept (found ${literal999?.length})`,
);

const recruitmentSidebar = read('ui_kits/recruitment/Sidebar.jsx');
assert.ok(
  !/--paper/.test(recruitmentSidebar),
  'ui_kits/recruitment/Sidebar.jsx: --paper reference must be removed',
);
assert.ok(
  /--surface-0/.test(recruitmentSidebar),
  'ui_kits/recruitment/Sidebar.jsx: logo dot must use --surface-0',
);

// ---- Editorial recovery (opt-in brand surface) must be present & derivation-based ----
const fontsCss = read('fonts/fonts.css');
assert.ok(
  /--font-display\s*:/.test(fontsCss),
  'fonts/fonts.css: --font-display (the one display face) must be declared',
);
assert.ok(
  /Bricolage\s+Grotesque/.test(fontsCss),
  'fonts/fonts.css: --font-display should be Bricolage Grotesque',
);

for (const tok of ['--paper-warm-seed', '--surface-paper', '--paper-ink', '--paper-rule']) {
  assert.ok(
    new RegExp(`${tok}\\s*:`).test(coreCss),
    `tokens/core.css: derived editorial token ${tok} must be declared`,
  );
}
// Warmth must be DERIVED off the ramp (color-mix), not a literal parallel palette.
assert.ok(
  /--surface-paper\s*:\s*color-mix\(/.test(coreCss),
  'tokens/core.css: --surface-paper must be a color-mix derivation off the neutral ramp (cannot drift)',
);

assert.ok(
  /\.t-display\b/.test(typeScale),
  'tokens/type-scale.css: .t-display must be declared',
);
assert.ok(
  /\[data-surface="brand"\]/.test(primitives),
  'primitives/primitives.css: opt-in [data-surface="brand"] skin must be declared',
);
// The brand form-panel rule must cover the attribute being set ON .cc-auth
// itself (compound), not only on an ancestor (descendant) — otherwise the
// austere-white panel skin is a no-op for the common <main class="cc-auth"
// data-surface="brand"> pattern.
assert.ok(
  /\[data-surface="brand"\]\.cc-auth \.cc-panel/.test(primitives),
  'primitives/primitives.css: brand panel rule must include the compound [data-surface="brand"].cc-auth .cc-panel selector',
);

// The editorial display face must actually ship: fonts/fonts.css has to be in
// the published `files` and exposed via `exports`, or consumers' `@import
// "@ds/core/fonts/fonts.css"` 404s and --font-display silently never loads.
const pkg = JSON.parse(read('package.json'));
assert.ok(
  Array.isArray(pkg.files) && pkg.files.includes('fonts'),
  'package.json: "files" must include "fonts" so fonts/fonts.css is published',
);
assert.ok(
  pkg.exports && pkg.exports['./fonts/fonts.css'],
  'package.json: "exports" must expose "./fonts/fonts.css"',
);

console.log('token contract checks passed');
