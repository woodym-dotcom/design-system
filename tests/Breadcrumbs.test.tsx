/**
 * Breadcrumbs — links, current marker, collapse, separator, ARIA nav.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from '../react/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('wraps in nav with aria-label', () => {
    render(<Breadcrumbs items={[{ label: 'Home' }]} />);
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('renders links for non-current items and aria-current=page for tail', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Vendors', href: '/vendors' },
          { label: 'Acme' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Vendors' }).getAttribute('href')).toBe('/vendors');
    const acme = screen.getByText('Acme');
    expect(acme.getAttribute('aria-current')).toBe('page');
  });

  it('collapses middle items past the threshold', () => {
    render(
      <Breadcrumbs
        collapseAfter={4}
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C', href: '/c' },
          { label: 'D', href: '/d' },
          { label: 'E', href: '/e' },
          { label: 'F' },
        ]}
      />,
    );
    expect(screen.getByText('…')).toBeTruthy();
    // Root + ellipsis + parent + leaf
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('E')).toBeTruthy();
    expect(screen.getByText('F').getAttribute('aria-current')).toBe('page');
  });
});
