/**
 * Kbd — renders multiple keys with separators; aliases known keys.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from '../react/Kbd';

describe('Kbd', () => {
  it('renders a single key', () => {
    const { container } = render(<Kbd keys="K" />);
    const kbds = container.querySelectorAll('kbd');
    expect(kbds.length).toBe(1);
    expect(kbds[0].textContent).toBe('K');
  });

  it('joins multiple keys with separators', () => {
    const { container } = render(<Kbd keys={['Ctrl', 'K']} />);
    expect(container.querySelectorAll('kbd').length).toBe(2);
    expect(container.querySelectorAll('.cc-kbd-sep').length).toBe(1);
  });

  it('aliases canonical key names', () => {
    const { container } = render(<Kbd keys={['enter', 'esc']} />);
    const kbds = container.querySelectorAll('kbd');
    expect(kbds[0].textContent).toBe('↵');
    expect(kbds[1].textContent).toBe('Esc');
  });

  it('aria-label includes the shortcut', () => {
    render(<Kbd keys={['Ctrl', 'K']} />);
    const group = screen.getByRole('group');
    expect(group.getAttribute('aria-label')).toContain('Ctrl + K');
  });
});
