/**
 * G2 regression: NavRail contract.
 *
 * Three contract points:
 *  (a) Selected state legible in both themes via tokens (class-driven, not inline colour).
 *  (b) Each segment is independently routable / deep-linkable (href on each item).
 *  (c) Navigation never collapses on selection (nav always visible).
 *
 * Phase 2.1 additions:
 *  - Multi-select bug regression (longest-prefix-match wins).
 *  - a11y audit via axe-core.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import { NavRail } from '../react/NavRail';

const ITEMS = [
  { id: 'vendors', to: '/vendors', label: 'Vendors' },
  { id: 'risks', to: '/risks', label: 'Risks' },
  { id: 'controls', to: '/controls', label: 'Controls' },
];

// ---------------------------------------------------------------------------
// Contract (a) — selected state via tokens (class, not inline colour)
// ---------------------------------------------------------------------------
describe('G2(a) — selected state legible in both themes via tokens', () => {
  it('active item has is-active class', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    const link = screen.getByRole('link', { name: 'Vendors' });
    expect(link.className).toContain('is-active');
  });

  it('inactive item does not have is-active class', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    const link = screen.getByRole('link', { name: 'Risks' });
    expect(link.className).not.toContain('is-active');
  });

  it('active item has aria-current=page', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    expect(screen.getByRole('link', { name: 'Vendors' })).toHaveAttribute('aria-current', 'page');
  });

  it('inactive item does not have aria-current', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    expect(screen.getByRole('link', { name: 'Risks' })).not.toHaveAttribute('aria-current');
  });

  it('active item has no inline style (token-driven only)', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    const link = screen.getByRole('link', { name: 'Vendors' });
    expect(link.getAttribute('style')).toBeFalsy();
  });

  it('isActive prop overrides pathname matching', () => {
    const items = [
      { id: 'vendors', to: '/vendors', label: 'Vendors', isActive: false },
      { id: 'risks', to: '/risks', label: 'Risks', isActive: true },
    ];
    render(<NavRail items={items} currentPathname="/vendors" />);
    expect(screen.getByRole('link', { name: 'Risks' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Vendors' })).not.toHaveAttribute('aria-current');
  });
});

// ---------------------------------------------------------------------------
// Contract (b) — each segment independently routable / deep-linkable
// ---------------------------------------------------------------------------
describe('G2(b) — each item independently routable (href present)', () => {
  it('each item renders with its href', () => {
    render(<NavRail items={ITEMS} currentPathname="/" />);
    for (const item of ITEMS) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', item.to);
    }
  });

  it('prefix-match makes sub-routes active', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors/acme-corp" />);
    expect(screen.getByRole('link', { name: 'Vendors' })).toHaveAttribute('aria-current', 'page');
  });

  it('renderItem receives the item href for router link integration', () => {
    const hrefs: string[] = [];
    render(
      <NavRail
        items={ITEMS}
        currentPathname="/"
        renderItem={({ item, isActive, className }) => {
          hrefs.push(item.to);
          return (
            <a href={item.to} className={className} aria-current={isActive ? 'page' : undefined}>
              {item.label}
            </a>
          );
        }}
      />
    );
    expect(hrefs).toEqual(ITEMS.map((i) => i.to));
  });
});

// ---------------------------------------------------------------------------
// Contract (c) — navigation never collapses on selection
// ---------------------------------------------------------------------------
describe('G2(c) — nav always visible, never collapses on selection', () => {
  it('nav element always in DOM regardless of active item', () => {
    const { rerender } = render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    expect(screen.getByRole('navigation', { name: 'Modules' })).toBeInTheDocument();
    rerender(<NavRail items={ITEMS} currentPathname="/risks" />);
    expect(screen.getByRole('navigation', { name: 'Modules' })).toBeInTheDocument();
  });

  it('all items always rendered regardless of which is active', () => {
    render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    for (const item of ITEMS) {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// CSS token regression — text-navrail active state
// ---------------------------------------------------------------------------
describe('G2 NavRail CSS classes', () => {
  it('nav has cc-text-navrail class', () => {
    render(<NavRail items={ITEMS} currentPathname="/" />);
    const nav = screen.getByRole('navigation', { name: 'Modules' });
    expect(nav.className).toContain('cc-text-navrail');
  });

  it('items have cc-text-navrail__item class', () => {
    render(<NavRail items={ITEMS} currentPathname="/" />);
    for (const item of ITEMS) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link.className).toContain('cc-text-navrail__item');
    }
  });

  it('custom ariaLabel is applied to nav', () => {
    render(<NavRail items={ITEMS} currentPathname="/" ariaLabel="Main navigation" />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Multi-select bug regression (AA bug fix — Phase 2.1)
// When items share a common prefix (e.g. /vendors and /vendors/risks),
// only the longest-matching item should be active.
// ---------------------------------------------------------------------------
describe('NavRail multi-select fix', () => {
  const PREFIX_ITEMS = [
    { id: 'vendors', to: '/vendors', label: 'Vendors' },
    { id: 'vendors-risks', to: '/vendors/risks', label: 'Vendor Risks' },
    { id: 'controls', to: '/controls', label: 'Controls' },
  ];

  it('only the longest prefix match is active (no multi-select)', () => {
    render(<NavRail items={PREFIX_ITEMS} currentPathname="/vendors/risks/acme" />);
    expect(screen.getByRole('link', { name: 'Vendor Risks' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Vendors' })).not.toHaveAttribute('aria-current');
  });

  it('exact match wins over prefix match', () => {
    render(<NavRail items={PREFIX_ITEMS} currentPathname="/vendors" />);
    expect(screen.getByRole('link', { name: 'Vendors' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Vendor Risks' })).not.toHaveAttribute('aria-current');
  });

  it('no item active when pathname does not match any item', () => {
    render(<NavRail items={PREFIX_ITEMS} currentPathname="/settings" />);
    for (const item of PREFIX_ITEMS) {
      expect(screen.getByRole('link', { name: item.label })).not.toHaveAttribute('aria-current');
    }
  });

  it('only one item can be active via pathname (never multiple)', () => {
    render(<NavRail items={PREFIX_ITEMS} currentPathname="/vendors/risks" />);
    const activeLinks = screen
      .getAllByRole('link')
      .filter((el) => el.getAttribute('aria-current') === 'page');
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveAttribute('href', '/vendors/risks');
  });
});

// ---------------------------------------------------------------------------
// a11y audit — Phase 2.1
// ---------------------------------------------------------------------------
describe('NavRail a11y (axe)', () => {
  it('has no axe violations', async () => {
    const { container } = render(<NavRail items={ITEMS} currentPathname="/vendors" />);
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations with renderItem', async () => {
    const { container } = render(
      <NavRail
        items={ITEMS}
        currentPathname="/vendors"
        renderItem={({ item, isActive, className }) => (
          <a href={item.to} className={className} aria-current={isActive ? 'page' : undefined}>
            {item.label}
          </a>
        )}
      />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Footer items + dedupe + compact variant
// ---------------------------------------------------------------------------
describe('NavRail — footer + compact variant', () => {
  it('renders footer items in a separate group', () => {
    const { container } = render(
      <NavRail
        items={ITEMS}
        footerItems={[{ id: 'settings', to: '/settings', label: 'Settings' }]}
        currentPathname="/vendors"
      />,
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(container.querySelector('.cc-text-navrail__group--footer')).toBeInTheDocument();
  });

  it('dedupes Settings appearing in both main and footer (footer wins)', () => {
    render(
      <NavRail
        items={[
          ...ITEMS,
          { id: 'settings', to: '/settings', label: 'Settings (main)' },
        ]}
        footerItems={[
          { id: 'settings', to: '/settings', label: 'Settings' },
        ]}
        currentPathname="/vendors"
      />,
    );
    // Only one Settings link — the footer entry — should render.
    expect(screen.queryByText('Settings (main)')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Settings' })).toHaveLength(1);
  });

  it('compact variant renders aria-label and title for tooltip-only display', () => {
    render(<NavRail items={ITEMS} variant="compact" currentPathname="/vendors" />);
    const link = screen.getByRole('link', { name: 'Vendors' });
    expect(link).toHaveAttribute('title', 'Vendors');
    // The visible text is just the initial — full label exposed via aria.
    expect(link).toHaveAttribute('aria-label', 'Vendors');
  });
});

describe('NavRail icon support (B.5)', () => {
  it('renders icon adjacent to label in expanded variant', () => {
    const items = [
      { id: 'home', to: '/home', label: 'Home', icon: <svg data-testid="home-icon" /> },
    ];
    const { container } = render(<NavRail items={items} />);
    expect(container.querySelector('[data-testid="home-icon"]')).toBeTruthy();
    expect(container.querySelector('.cc-text-navrail__label')?.textContent).toBe('Home');
  });

  it('renders icon instead of initial in compact variant', () => {
    const items = [
      { id: 'home', to: '/home', label: 'Home', icon: <svg data-testid="home-icon" /> },
    ];
    const { container } = render(<NavRail items={items} variant="compact" />);
    expect(container.querySelector('[data-testid="home-icon"]')).toBeTruthy();
    // initial "H" should NOT appear.
    expect(container.textContent).not.toContain('H');
  });

  it('falls back to initial in compact variant when no icon set', () => {
    const items = [{ id: 'home', to: '/home', label: 'Home' }];
    const { container } = render(<NavRail items={items} variant="compact" />);
    expect(container.textContent).toContain('H');
  });
});
