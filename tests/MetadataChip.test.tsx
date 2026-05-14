/**
 * MetadataChip — contract tests.
 *
 * Contracts:
 *  (a) Renders a trigger button (≥44px min via CSS class).
 *  (b) Panel is hidden by default; visible after toggle click.
 *  (c) Panel hides on second click (toggle).
 *  (d) Escape key closes the panel.
 *  (e) aria-expanded tracks open state.
 *  (f) Freshness, privacy, inspectHref, lastUpdated render in the panel.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetadataChip } from '../react/MetadataChip';

const PROPS = {
  freshness: { value: 3, unit: 'm' as const },
  privacy: 'private' as const,
  inspectHref: 'https://example.com/inspect',
  lastUpdated: '2026-01-15T10:30:00Z',
};

describe('MetadataChip — contract (a): trigger exists', () => {
  it('renders a button trigger', () => {
    render(<MetadataChip {...PROPS} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });

  it('trigger has aria-label', () => {
    render(<MetadataChip {...PROPS} />);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });
});

describe('MetadataChip — contract (b): panel hidden by default', () => {
  it('panel region is not visible before clicking', () => {
    render(<MetadataChip {...PROPS} />);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('panel appears after clicking trigger', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('region')).toBeTruthy();
  });
});

describe('MetadataChip — contract (c): toggle closes', () => {
  it('clicking again hides the panel', () => {
    render(<MetadataChip {...PROPS} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(screen.getByRole('region')).toBeTruthy();
    fireEvent.click(btn);
    expect(screen.queryByRole('region')).toBeNull();
  });
});

describe('MetadataChip — contract (d): Escape closes', () => {
  it('pressing Escape hides the panel', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('region')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('region')).toBeNull();
  });
});

describe('MetadataChip — contract (e): aria-expanded', () => {
  it('aria-expanded is false initially', () => {
    render(<MetadataChip {...PROPS} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('aria-expanded is true when open', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });
});

describe('MetadataChip — contract (f): content renders', () => {
  it('shows freshness value when open', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('3m')).toBeTruthy();
  });

  it('shows privacy badge when open', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('private')).toBeTruthy();
  });

  it('shows inspect link when open', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    const link = screen.getByRole('link', { name: /Inspect/i });
    expect(link.getAttribute('href')).toBe(PROPS.inspectHref);
  });

  it('shows formatted last updated when open', () => {
    render(<MetadataChip {...PROPS} />);
    fireEvent.click(screen.getByRole('button'));
    // Should display formatted date string (not the raw ISO)
    expect(screen.queryByText(PROPS.lastUpdated)).toBeNull(); // raw ISO gone
    const panel = screen.getByRole('region');
    expect(panel.textContent).toContain('15'); // day appears in formatted form
  });
});

describe('MetadataChip — render without optional props', () => {
  it('renders with no props and shows no panel initially', () => {
    render(<MetadataChip />);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('trigger still renders with no content props', () => {
    render(<MetadataChip />);
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
