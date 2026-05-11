/**
 * EntityCard / EntityCardList — entity-list record cards with density variants.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EntityCard, EntityCardList } from '../react/EntityCard';

describe('EntityCard', () => {
  it('renders title and subtitle', () => {
    render(<EntityCard title="Jane Doe" subtitle="Director" />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Director')).toBeInTheDocument();
  });

  it('standard density renders metadata inline', () => {
    render(
      <EntityCard
        title="Jane Doe"
        density="standard"
        metadata={<div>since 2020</div>}
      />,
    );
    expect(screen.getByText('since 2020')).toBeInTheDocument();
  });

  it('compact density hides metadata behind disclosure', () => {
    render(
      <EntityCard
        title="Jane Doe"
        density="compact"
        metadata={<div>since 2020</div>}
      />,
    );
    expect(screen.queryByText('since 2020')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show details/i }));
    expect(screen.getByText('since 2020')).toBeInTheDocument();
  });

  it('clickable variant invokes onClick', () => {
    const onClick = vi.fn();
    render(<EntityCard title="Jane Doe" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: /jane doe/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('EntityCardList', () => {
  it('renders all children below the virtualisation threshold', () => {
    render(
      <EntityCardList>
        {Array.from({ length: 5 }).map((_, i) => (
          <EntityCard key={i} title={`Card ${i}`} />
        ))}
      </EntityCardList>,
    );
    expect(screen.getAllByText(/^Card /)).toHaveLength(5);
  });

  it('virtualises above the threshold', () => {
    render(
      <EntityCardList virtualiseAbove={3} windowSize={3}>
        {Array.from({ length: 10 }).map((_, i) => (
          <EntityCard key={i} title={`Card ${i}`} />
        ))}
      </EntityCardList>,
    );
    // Only the first window's worth is rendered initially.
    const rendered = screen.getAllByText(/^Card /);
    expect(rendered.length).toBeLessThan(10);
  });
});
