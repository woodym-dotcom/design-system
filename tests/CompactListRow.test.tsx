/**
 * CompactListRow — contract tests.
 *
 * Contracts:
 *  (a) Renders as <div> when neither onClick nor href provided.
 *  (b) Renders as <a> when href provided.
 *  (c) Renders as <button> when onClick provided (without href).
 *  (d) Title and subtitle render correctly.
 *  (e) Trailing slot renders right-aligned.
 *  (f) isSelected applies is-selected class.
 *  (g) cc-compact-row class always present.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompactListRow } from '../react/CompactListRow';

describe('CompactListRow — contract (a): static div', () => {
  it('renders as div when no onClick or href', () => {
    const { container } = render(<CompactListRow title="Task title" />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });
});

describe('CompactListRow — contract (b): anchor', () => {
  it('renders as <a> when href is provided', () => {
    const { container } = render(<CompactListRow title="Link row" href="/tasks/1" />);
    expect(container.firstElementChild?.tagName).toBe('A');
    expect((container.firstElementChild as HTMLAnchorElement).href).toContain('/tasks/1');
  });
});

describe('CompactListRow — contract (c): button', () => {
  it('renders as <button> when onClick is provided', () => {
    const handler = vi.fn();
    render(<CompactListRow title="Clickable" onClick={handler} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('href takes precedence over onClick for element type', () => {
    // When both are provided, href wins (row becomes <a>).
    const { container } = render(
      <CompactListRow title="Both" href="/x" onClick={() => {}} />,
    );
    expect(container.firstElementChild?.tagName).toBe('A');
  });
});

describe('CompactListRow — contract (d): title + subtitle', () => {
  it('renders title text', () => {
    render(<CompactListRow title="My task" />);
    expect(screen.getByText('My task')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<CompactListRow title="Title" subtitle="Due tomorrow" />);
    expect(screen.getByText('Due tomorrow')).toBeTruthy();
  });

  it('subtitle absent when not provided', () => {
    const { container } = render(<CompactListRow title="Title" />);
    expect(container.querySelector('.cc-compact-row__subtitle')).toBeNull();
  });
});

describe('CompactListRow — contract (e): trailing slot', () => {
  it('renders trailing content', () => {
    render(<CompactListRow title="Row" trailing={<span data-testid="chip">OK</span>} />);
    expect(screen.getByTestId('chip')).toBeTruthy();
  });

  it('trailing slot absent when not provided', () => {
    const { container } = render(<CompactListRow title="Row" />);
    expect(container.querySelector('.cc-compact-row__trailing')).toBeNull();
  });
});

describe('CompactListRow — contract (f): isSelected', () => {
  it('applies is-selected class when isSelected=true', () => {
    const { container } = render(<CompactListRow title="Row" isSelected />);
    expect(container.firstElementChild?.className).toContain('is-selected');
  });

  it('no is-selected class when false', () => {
    const { container } = render(<CompactListRow title="Row" />);
    expect(container.firstElementChild?.className).not.toContain('is-selected');
  });
});

describe('CompactListRow — contract (g): base class', () => {
  it('always has cc-compact-row class', () => {
    const { container } = render(<CompactListRow title="Row" />);
    expect(container.firstElementChild?.className).toContain('cc-compact-row');
  });
});
