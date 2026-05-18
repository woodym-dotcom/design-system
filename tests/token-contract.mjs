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

const editorialTokens = [
  '--font-brand',
  '--font-brand-sans',
  '--amber-50',
  '--amber-100',
  '--amber-600',
  '--ink-0',
  '--ink-1',
  '--paper',
  '--paper-ink',
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

console.log('token contract checks passed');
