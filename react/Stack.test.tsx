import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children in a flex column', () => {
    render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    const el = screen.getByText('A').parentElement!;
    expect(el.style.display).toBe('flex');
    expect(el.style.flexDirection).toBe('column');
  });

  it('applies gap token for md (default)', () => {
    render(
      <Stack gap="md">
        <span>A</span>
      </Stack>,
    );
    const el = screen.getByText('A').parentElement!;
    expect(el.style.gap).toBe('var(--space-5)');
  });

  it('applies gap=none as 0', () => {
    render(
      <Stack gap="none">
        <span>X</span>
      </Stack>,
    );
    // jsdom normalises '0' to '0px'
    const gap = screen.getByText('X').parentElement!.style.gap;
    expect(gap === '0' || gap === '0px').toBe(true);
  });

  it('applies align=center', () => {
    render(
      <Stack align="center">
        <span>C</span>
      </Stack>,
    );
    expect(screen.getByText('C').parentElement!.style.alignItems).toBe('center');
  });

  it('renders as a different element with as prop', () => {
    render(
      <Stack as="section">
        <span>S</span>
      </Stack>,
    );
    expect(screen.getByText('S').parentElement!.tagName).toBe('SECTION');
  });

  it('renders dividers between children when divider=true', () => {
    const { container } = render(
      <Stack divider>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Stack>,
    );
    const hrs = container.querySelectorAll('hr');
    expect(hrs).toHaveLength(2);
  });

  it('does not render dividers when divider=false', () => {
    const { container } = render(
      <Stack divider={false}>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(container.querySelectorAll('hr')).toHaveLength(0);
  });

  it('applies custom className', () => {
    render(
      <Stack className="my-stack">
        <span>A</span>
      </Stack>,
    );
    expect(screen.getByText('A').parentElement!.className).toBe('my-stack');
  });
});
