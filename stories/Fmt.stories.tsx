/**
 * Fmt + Lens stories — locale/timezone/currency formatting.
 */
import * as React from 'react';
import { FmtProvider, Fmt } from '../react/fmt/Fmt';
import { Lens } from '../react/fmt/Lens';

export default {
  title: 'Foundation/Fmt',
};

export function DefaultLocale() {
  return (
    <FmtProvider locale="en-GB" timezone="UTC" currency="GBP">
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <div>Date: <Fmt.Date value="2026-05-17T15:30:00Z" /></div>
        <div>Date + time: <Fmt.Date value="2026-05-17T15:30:00Z" timeStyle="short" /></div>
        <div>Relative: <Fmt.Relative value="2026-05-17T15:30:00Z" now={new Date('2026-05-17T16:00:00Z')} /></div>
        <div>Money: <Fmt.Money value={12345.67} /></div>
        <div>Number: <Fmt.Number value={1234567.89} maxFractionDigits={1} /></div>
        <div>Percent: <Fmt.Number value={0.42} style="percent" /></div>
      </div>
    </FmtProvider>
  );
}

export function WithLens() {
  return (
    <FmtProvider locale="en-GB" timezone="UTC" currency="GBP">
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <div>Outside lens: <Fmt.Money value={12345.67} /></div>
        <Lens label="US view" locale="en-US" currency="USD" timezone="America/New_York" defaultOn>
          <div>Inside lens: <Fmt.Money value={12345.67} /></div>
          <div>Date: <Fmt.Date value="2026-05-17T15:30:00Z" timeStyle="short" /></div>
        </Lens>
      </div>
    </FmtProvider>
  );
}
