/**
 * NavRail stories — Storybook CSF v3 format.
 */
import * as React from 'react';
import { NavRail } from '../react/NavRail';

export default {
  title: 'Shell Primitives/NavRail',
  component: NavRail,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Text-label vertical navigation rail with single-select state. ' +
          'Phase 2.1 fixes the multi-select bug: only the longest-prefix-match item is active. ' +
          'Router-agnostic via renderItem render-prop.',
      },
    },
  },
};

const ITEMS = [
  { id: 'vendors', to: '/vendors', label: 'Vendors' },
  { id: 'risks', to: '/risks', label: 'Risks' },
  { id: 'controls', to: '/controls', label: 'Controls' },
  { id: 'settings', to: '/settings', label: 'Settings' },
];

/** Golden path: single active item via pathname */
export function Default() {
  return (
    <div style={{ width: '200px', background: 'var(--surface-1, #f4f4f4)', padding: '8px', borderRadius: '8px' }}>
      <NavRail items={ITEMS} currentPathname="/vendors" />
    </div>
  );
}

/** No active item */
export function NoneActive() {
  return (
    <div style={{ width: '200px', background: 'var(--surface-1, #f4f4f4)', padding: '8px', borderRadius: '8px' }}>
      <NavRail items={ITEMS} currentPathname="/" />
    </div>
  );
}

/** Sub-route match — prefix match resolves to most-specific item (multi-select fix) */
export function SubRoute() {
  const prefixItems = [
    { id: 'vendors', to: '/vendors', label: 'Vendors' },
    { id: 'vendor-risks', to: '/vendors/risks', label: 'Vendor Risks' },
    { id: 'controls', to: '/controls', label: 'Controls' },
  ];
  return (
    <div style={{ width: '200px', background: 'var(--surface-1, #f4f4f4)', padding: '8px', borderRadius: '8px' }}>
      <p style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
        pathname: /vendors/risks/acme
      </p>
      <NavRail items={prefixItems} currentPathname="/vendors/risks/acme" />
    </div>
  );
}

/** Using renderItem for router integration */
export function WithRenderItem() {
  return (
    <div style={{ width: '200px', background: 'var(--surface-1, #f4f4f4)', padding: '8px', borderRadius: '8px' }}>
      <NavRail
        items={ITEMS}
        currentPathname="/risks"
        renderItem={({ item, isActive, className }) => (
          <a
            href={item.to}
            className={className}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
            {isActive ? ' (active)' : ''}
          </a>
        )}
      />
    </div>
  );
}

/** Custom aria-label */
export function CustomAriaLabel() {
  return (
    <div style={{ width: '200px', background: 'var(--surface-1, #f4f4f4)', padding: '8px', borderRadius: '8px' }}>
      <NavRail items={ITEMS} currentPathname="/controls" ariaLabel="Main navigation" />
    </div>
  );
}
