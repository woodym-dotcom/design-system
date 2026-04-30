/**
 * G2 regression: NavRail contract.
 *
 * Three contract points:
 *  (a) Selected state legible in both themes via tokens (class-driven, not inline colour).
 *  (b) Each segment is independently routable / deep-linkable (href on each item).
 *  (c) Navigation never collapses on selection (nav always visible).
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
