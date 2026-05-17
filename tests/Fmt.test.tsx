/**
 * Fmt + FmtProvider + Lens — locale/timezone/currency formatting.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FmtProvider, Fmt, useFmt } from '../react/fmt/Fmt';
import { Lens } from '../react/fmt/Lens';

describe('Fmt.Date', () => {
  it('formats with provider locale + timezone', () => {
    render(
      <FmtProvider locale="en-GB" timezone="UTC">
        <Fmt.Date value="2026-05-17T15:30:00Z" />
      </FmtProvider>,
    );
    const time = screen.getByText(/2026|May|17/i);
    expect(time.tagName).toBe('TIME');
    expect(time.getAttribute('datetime')).toBe('2026-05-17T15:30:00.000Z');
  });

  it('renders em-dash for invalid input', () => {
    render(<Fmt.Date value="not-a-date" />);
    expect(screen.getByText('—')).toBeTruthy();
  });
});

describe('Fmt.Money', () => {
  it('uses provider currency by default', () => {
    render(
      <FmtProvider locale="en-GB" currency="GBP">
        <Fmt.Money value={12.5} />
      </FmtProvider>,
    );
    expect(screen.getByText(/£12\.50/)).toBeTruthy();
  });

  it('honours per-call currency override', () => {
    render(
      <FmtProvider locale="en-US" currency="USD">
        <Fmt.Money value={1000} currency="EUR" />
      </FmtProvider>,
    );
    // €1,000.00 (no decimal forced; default = 2)
    expect(screen.getByText(/€/)).toBeTruthy();
  });
});

describe('Fmt.Number', () => {
  it('formats with provider locale', () => {
    render(
      <FmtProvider locale="de-DE">
        <Fmt.Number value={1234.5} />
      </FmtProvider>,
    );
    // German uses comma decimal separator
    expect(screen.getByText('1.234,5')).toBeTruthy();
  });

  it('percent style', () => {
    render(<Fmt.Number value={0.42} style="percent" />);
    expect(screen.getByText(/42\s?%/)).toBeTruthy();
  });
});

describe('Lens', () => {
  it('toggles override on click', () => {
    function Probe() {
      const { locale, currency } = useFmt();
      return <span data-testid="loc">{locale}|{currency}</span>;
    }
    render(
      <FmtProvider locale="en-GB" currency="GBP">
        <Lens label="US view" locale="en-US" currency="USD">
          <Probe />
        </Lens>
      </FmtProvider>,
    );
    expect(screen.getByTestId('loc').textContent).toBe('en-GB|GBP');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('loc').textContent).toBe('en-US|USD');
  });

  it('shows the read-only hint when on', () => {
    render(
      <Lens label="EU view" locale="fr-FR" defaultOn>
        <span>body</span>
      </Lens>,
    );
    expect(screen.getByRole('note').textContent).toContain('Read-only');
  });
});
