/**
 * Avatar — initials fallback, image swap on error, name labelling.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from '../react/Avatar';

describe('Avatar', () => {
  it('renders initials from a 2-part name', () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByLabelText('Jane Doe').textContent).toBe('JD');
  });

  it('renders 2 letters of a single-word name', () => {
    render(<Avatar name="cher" />);
    expect(screen.getByLabelText('cher').textContent).toBe('CH');
  });

  it('renders image when src is provided', () => {
    const { container } = render(<Avatar name="Jane" src="/avatar.png" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/avatar.png');
    expect(img?.getAttribute('alt')).toBe('Jane');
  });

  it('falls back to initials when image errors', () => {
    const { container } = render(<Avatar name="Jane Doe" src="/x.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByLabelText('Jane Doe').textContent).toBe('JD');
  });

  it('renders as button when onClick is supplied', () => {
    const { container } = render(<Avatar name="Sam" onClick={() => {}} />);
    expect(container.querySelector('button.cc-avatar')).toBeTruthy();
  });

  it('size class applied', () => {
    const { container } = render(<Avatar name="x" size="xl" />);
    expect(container.firstElementChild?.className).toContain('cc-avatar--xl');
  });
});
