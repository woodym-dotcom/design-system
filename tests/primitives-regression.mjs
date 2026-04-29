import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync(new URL('../primitives/primitives.css', import.meta.url), 'utf8');

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{(?<body>[^}]*)\\}`, 'm'));
  assert.ok(match?.groups?.body, `Missing ${selector}`);
  return match.groups.body;
}

function assertIncludes(selector, expected) {
  const body = blockFor(selector);
  assert.ok(
    body.includes(expected),
    `${selector} should include ${expected}. Actual block:\n${body}`,
  );
}

assertIncludes('.cc-scrim', 'background: var(--scrim-background, rgba(3, 7, 18, 0.72));');
assertIncludes('.cc-modal', 'background: var(--modal-surface, var(--surface-0));');
assertIncludes('.cc-modal', 'opacity: 1;');
assertIncludes('.cc-detail-layout--stable', 'grid-template-columns: minmax(0, 1fr);');
assert.ok(
  css.includes('.cc-detail-layout--stable.has-detail') &&
    css.includes('grid-template-columns: minmax(0, 1fr) var(--detail-pane-width, minmax(320px, 38vw));'),
  'Stable detail layouts should reserve desktop detail width while detail is open',
);
assertIncludes('.cc-async-region', 'position: relative;');
assertIncludes('.cc-async-region__overlay', 'pointer-events: none;');

console.log('primitive regression checks passed');
