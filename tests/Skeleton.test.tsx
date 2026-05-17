/**
 * Skeleton — shapes, multi-line text, aria-label.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../react/Skeleton';

describe('Skeleton', () => {
  it('renders with role=status and a default aria-label', () => {
    render(<Skeleton />);
    const node = screen.getByRole('status');
    expect(node.getAttribute('aria-label')).toBe('Loading');
  });

  it('shape classes are applied', () => {
    const { container } = render(<Skeleton shape="circle" />);
    expect(container.firstElementChild?.className).toContain('cc-skeleton--circle');
  });

  it('renders N lines for text + lines > 1', () => {
    const { container } = render(<Skeleton shape="text" lines={3} />);
    const skeletons = container.querySelectorAll('.cc-skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('last line of multi-line text gets shorter width', () => {
    const { container } = render(<Skeleton shape="text" lines={2} />);
    const lines = container.querySelectorAll('.cc-skeleton');
    expect((lines[1] as HTMLElement).style.width).toBe('60%');
  });

  it('static prop adds the static modifier', () => {
    const { container } = render(<Skeleton static />);
    expect(container.firstElementChild?.className).toContain('cc-skeleton--static');
  });
});
