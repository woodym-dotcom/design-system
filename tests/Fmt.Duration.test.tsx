/**
 * Fmt.Duration — human-readable duration formatting.
 *
 * DoD: locale-aware duration rendering for the Locale/Timezone/Currency
 * primitives ticket. Renders short / long forms; respects locale; defaults
 * to seconds when value is small. Treats value as milliseconds by default;
 * accepts `unit="seconds"` for second-grained input.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FmtProvider, Fmt } from '../react/fmt/Fmt';

describe('Fmt.Duration', () => {
  it('exports as a sub-component of Fmt', () => {
    expect(Fmt.Duration).toBeDefined();
    expect(typeof Fmt.Duration).toBe('function');
  });

  it('formats sub-second durations as seconds with appropriate precision', () => {
    render(<Fmt.Duration value={750} />);
    // 750ms → "0.75 secs" / "0.75 s" / "1 sec" depending on locale rendering.
    // Loose match: contains 0.75 (or 1) followed by some form of "sec" or "s".
    expect(screen.getByText(/^(0\.75|1)\s*(s|sec|secs|seconds?)$/i)).toBeTruthy();
  });

  it('formats minutes for sub-hour durations', () => {
    render(<Fmt.Duration value={5 * 60 * 1000} />);
    expect(screen.getByText(/5\s?min/)).toBeTruthy();
  });

  it('formats hours for sub-day durations', () => {
    render(<Fmt.Duration value={3 * 60 * 60 * 1000} />);
    expect(screen.getByText(/3\s?hr/i)).toBeTruthy();
  });

  it('formats days for multi-day durations', () => {
    render(<Fmt.Duration value={2 * 24 * 60 * 60 * 1000} />);
    expect(screen.getByText(/2\s?day/i)).toBeTruthy();
  });

  it('accepts unit="seconds" and converts internally', () => {
    render(<Fmt.Duration value={120} unit="seconds" />);
    expect(screen.getByText(/2\s?min/)).toBeTruthy();
  });

  it('respects locale from FmtProvider', () => {
    render(
      <FmtProvider locale="de-DE">
        <Fmt.Duration value={5 * 60 * 1000} />
      </FmtProvider>,
    );
    // German uses "Min." for minutes. Loose match — Intl outputs may vary by ICU version.
    expect(screen.getByText(/5\s?Min/)).toBeTruthy();
  });

  it('honours per-call locale override', () => {
    render(
      <FmtProvider locale="en-GB">
        <Fmt.Duration value={5 * 60 * 1000} locale="de-DE" />
      </FmtProvider>,
    );
    expect(screen.getByText(/5\s?Min/)).toBeTruthy();
  });

  it('renders em-dash for non-finite input', () => {
    render(<Fmt.Duration value={NaN} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('renders em-dash for negative durations', () => {
    render(<Fmt.Duration value={-100} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('uses style="long" to render verbose unit labels', () => {
    render(<Fmt.Duration value={5 * 60 * 1000} style="long" />);
    expect(screen.getByText(/5\s?minutes?/i)).toBeTruthy();
  });

  it('emits a span with stable class for styling hooks', () => {
    const { container } = render(<Fmt.Duration value={1000} />);
    const span = container.querySelector('span.cc-fmt.cc-fmt--duration');
    expect(span).not.toBeNull();
  });
});
