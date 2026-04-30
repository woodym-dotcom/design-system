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

// G4 — form-input stability: error/hint slot must reserve height so layout
// does not reflow when error text appears or disappears.
// We scan raw CSS rather than blockFor() because the inline variant appears first.
assert.ok(
  css.includes('.cc-field__error') && css.match(/\.cc-field__error\s*\{[^}]*min-height:\s*1\.2em/),
  '.cc-field__error must have min-height: 1.2em reserved for layout stability',
);
assert.ok(
  css.includes('.cc-field__hint') && css.match(/\.cc-field__hint\s*\{[^}]*min-height:\s*1\.2em/),
  '.cc-field__hint must have min-height: 1.2em reserved for layout stability',
);

// G2 — text-label NavRail: new third nav primitive alongside icon rail and sidebar.
// Active state must use token-based colours (no hard-coded hex).
assert.ok(
  css.includes('.cc-text-navrail') && css.match(/\.cc-text-navrail__item\.is-active[^}]*color:\s*var\(--accent-text\)/),
  '.cc-text-navrail__item.is-active must use var(--accent-text) for token-based colour',
);
assert.ok(
  css.includes('.cc-text-navrail__item.is-active') && css.match(/\.cc-text-navrail__item\.is-active[^}]*background:\s*var\(--accent-soft\)/),
  '.cc-text-navrail__item.is-active must use var(--accent-soft) for token-based background',
);

// G10 — filter chip selected-state contrast:
// cc-chip--button base must set an explicit colour (no browser default).
assert.ok(
  css.match(/\.cc-chip--button\s*\{[^}]*color:\s*var\(--text-2\)/),
  '.cc-chip--button must set explicit color: var(--text-2) to anchor dark-mode transition',
);
// :active and [aria-pressed="true"] blocks must use accent-soft + accent-text tokens.
assert.ok(
  css.includes('.cc-chip--button:active') && css.includes('color: var(--accent-text)'),
  '.cc-chip--button:active must apply accent-text colour',
);
// Empty-state class must exist for filter bar.
assert.ok(
  css.includes('.cc-filter-bar__empty'),
  '.cc-filter-bar__empty must be defined for empty filter state',
);

console.log('primitive regression checks passed');
