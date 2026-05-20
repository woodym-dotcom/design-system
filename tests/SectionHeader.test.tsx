/**
 * SectionHeader — contract tests.
 *
 * Contracts:
 *  (a) Renders title as the correct heading element (h2 default, h1/h3 via `as`).
 *  (b) Description renders when provided; absent when not.
 *  (c) Metadata and actions slots render in the trailing area.
 *  (d) Correct type-scale class applied to heading.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from '../react/SectionHeader';

describe('SectionHeader — contract (a): heading element', () => {
  it('renders title as h2 by default', () => {
    render(<SectionHeader title="My Section" />);
    expect(screen.getByRole('heading', { level: 2, name: 'My Section' })).toBeTruthy();
  });

  it('renders as h1 when as="h1"', () => {
    render(<SectionHeader title="Page Title" as="h1" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page Title' })).toBeTruthy();
  });

  it('renders as h3 when as="h3"', () => {
    render(<SectionHeader title="Sub section" as="h3" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Sub section' })).toBeTruthy();
  });
});

describe('SectionHeader — contract (b): description', () => {
  it('renders description when provided', () => {
    render(<SectionHeader title="X" description="Supporting copy" />);
    expect(screen.getByText('Supporting copy')).toBeTruthy();
  });

  it('does not render description element when omitted', () => {
    const { container } = render(<SectionHeader title="X" />);
    expect(container.querySelector('.cc-section-header__description')).toBeNull();
  });
});

describe('SectionHeader — contract (c): trailing slots', () => {
  it('renders metadata slot content', () => {
    render(<SectionHeader title="X" metadata={<span data-testid="meta">3m</span>} />);
    expect(screen.getByTestId('meta')).toBeTruthy();
  });

  it('renders actions slot content', () => {
    render(<SectionHeader title="X" actions={<button type="button">Refresh</button>} />);
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeTruthy();
  });

  it('trailing area absent when neither metadata nor actions provided', () => {
    const { container } = render(<SectionHeader title="X" />);
    expect(container.querySelector('.cc-section-header__trailing')).toBeNull();
  });
});

describe('SectionHeader — contract (d): type-scale classes', () => {
  it('h2 heading has t-h2 class', () => {
    render(<SectionHeader title="H2 title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toContain('t-h2');
  });

  it('h1 heading has t-h1 class', () => {
    render(<SectionHeader title="H1 title" as="h1" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.className).toContain('t-h1');
  });
});

describe('SectionHeader — titleExtras', () => {
  it('renders titleExtras inside the heading element', () => {
    render(
      <SectionHeader
        title="Stats"
        titleExtras={<span data-testid="x">badge</span>}
      />,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.querySelector('[data-testid="x"]')).toBeTruthy();
  });

  it('absent titleExtras adds no extra wrapper', () => {
    const { container } = render(<SectionHeader title="x" />);
    expect(container.querySelector('.cc-section-header__title-extras')).toBeNull();
  });
});
