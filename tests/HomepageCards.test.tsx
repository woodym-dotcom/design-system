/**
 * HomepageCards — role filtering, priority ordering, loading skeleton,
 *                 empty state (permissioned-out), card click/href, columns.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomepageCards, type HomepageCard } from '../react/HomepageCards';

function makeCards(): HomepageCard[] {
  return [
    { id: 'admin-only', title: 'Admin panel', roles: ['admin'], render: () => <p>admin body</p> },
    { id: 'all', title: 'Welcome', render: () => <p>welcome body</p> },
    { id: 'analyst', title: 'Models', roles: ['analyst', 'admin'], priority: 5, render: () => <p>models</p> },
  ];
}

describe('HomepageCards', () => {
  it('filters out cards the viewer cannot see', () => {
    render(<HomepageCards viewerRoles={['viewer']} cards={makeCards()} />);
    expect(screen.queryByText('Admin panel')).toBeNull();
    expect(screen.queryByText('Models')).toBeNull();
    expect(screen.getByText('Welcome')).toBeTruthy();
  });

  it('includes cards with no role restriction for any viewer', () => {
    render(<HomepageCards viewerRoles={[]} cards={makeCards()} />);
    expect(screen.getByText('Welcome')).toBeTruthy();
  });

  it('admin sees all cards', () => {
    render(<HomepageCards viewerRoles={['admin']} cards={makeCards()} />);
    expect(screen.getByText('Admin panel')).toBeTruthy();
    expect(screen.getByText('Models')).toBeTruthy();
    expect(screen.getByText('Welcome')).toBeTruthy();
  });

  it('higher priority sorts first', () => {
    render(<HomepageCards viewerRoles={['admin']} cards={makeCards()} />);
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    // 'Models' has priority 5; others default to 0 → Models first.
    expect(titles[0]).toBe('Models');
  });

  it('loading=true renders skeletons in each card body', () => {
    const { container } = render(
      <HomepageCards viewerRoles={['admin']} cards={makeCards()} loading />,
    );
    expect(container.querySelectorAll('.cc-skeleton').length).toBeGreaterThan(0);
  });

  it('empty state shows when no cards remain after filtering', () => {
    render(
      <HomepageCards
        viewerRoles={['viewer']}
        cards={[{ id: 'a', title: 'Admin', roles: ['admin'], render: () => <p /> }]}
        emptyState={{ title: 'Nothing for you yet', description: 'Ask an admin.' }}
      />,
    );
    expect(screen.getByText('Nothing for you yet')).toBeTruthy();
    // permissioned-out variant — no implicit role
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('card with href renders an anchor', () => {
    render(
      <HomepageCards
        viewerRoles={[]}
        cards={[{ id: 'a', title: 'Docs', href: '/docs', render: () => <p>read</p> }]}
      />,
    );
    expect(screen.getByRole('link', { name: /Docs/ }).getAttribute('href')).toBe('/docs');
  });

  it('card with onClick renders a button', () => {
    const onClick = vi.fn();
    render(
      <HomepageCards
        viewerRoles={[]}
        cards={[{ id: 'a', title: 'Run', onClick, render: () => <p>x</p> }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Run/ }));
    expect(onClick).toHaveBeenCalled();
  });

  it('columns prop applies the class', () => {
    const { container } = render(
      <HomepageCards viewerRoles={[]} cards={[]} emptyState={{ title: 't' }} columns={4} />,
    );
    expect(container.firstElementChild?.className).toContain('cc-homepage-cards--cols-4');
  });
});
