import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders children as a span by default', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders as the specified element', () => {
    render(<Text as="p">Paragraph</Text>);
    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('renders as heading elements', () => {
    render(<Text as="h2">Title</Text>);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Title');
  });

  it('applies size token for xs', () => {
    render(<Text size="xs">Small</Text>);
    expect(screen.getByText('Small').style.fontSize).toBe('var(--text-xs)');
  });

  it('applies size token for md (default maps to --text-base)', () => {
    render(<Text size="md">Medium</Text>);
    expect(screen.getByText('Medium').style.fontSize).toBe('var(--text-base)');
  });

  it('applies size token for xl', () => {
    render(<Text size="xl">Large</Text>);
    expect(screen.getByText('Large').style.fontSize).toBe('var(--text-lg)');
  });

  it('applies font weight semibold as 600', () => {
    render(<Text weight="semibold">Bold</Text>);
    expect(screen.getByText('Bold').style.fontWeight).toBe('600');
  });

  it('applies muted tone color', () => {
    render(<Text tone="muted">Muted</Text>);
    expect(screen.getByText('Muted').style.color).toBe('var(--text-3)');
  });

  it('applies danger tone color', () => {
    render(<Text tone="danger">Error</Text>);
    expect(screen.getByText('Error').style.color).toBe('var(--error)');
  });

  it('applies single-line truncation when truncate=true', () => {
    render(<Text truncate>Truncated</Text>);
    const el = screen.getByText('Truncated');
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.textOverflow).toBe('ellipsis');
    expect(el.style.whiteSpace).toBe('nowrap');
  });

  it('applies multi-line clamp when truncate=3', () => {
    render(<Text truncate={3}>Multi</Text>);
    const el = screen.getByText('Multi');
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.webkitLineClamp).toBe('3');
  });

  it('applies custom className', () => {
    render(<Text className="my-text">Cls</Text>);
    expect(screen.getByText('Cls').className).toBe('my-text');
  });
});
