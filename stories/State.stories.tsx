/**
 * State stories — variant × density matrix (24 combinations) + override demos.
 */
import * as React from 'react';
import { State } from '../react/State';
import type { StateVariant, StateDensity } from '../react/State';

export default {
  title: 'Primitives/State',
  component: State,
};

const ALL_VARIANTS: StateVariant[] = [
  'empty', 'loading', 'error', 'offline', 'stale',
  'not-found', 'forbidden', 'degraded',
];

// ── page density ──────────────────────────────────────────────────────────────

export function PageEmpty() {
  return <State variant="empty" />;
}

export function PageLoading() {
  return <State variant="loading" />;
}

export function PageError() {
  return <State variant="error" />;
}

export function PageOffline() {
  return <State variant="offline" />;
}

export function PageStale() {
  return <State variant="stale" />;
}

export function PageNotFound() {
  return <State variant="not-found" />;
}

export function PageForbidden() {
  return <State variant="forbidden" />;
}

export function PageDegraded() {
  return <State variant="degraded" />;
}

// ── banner density ────────────────────────────────────────────────────────────

export function BannerEmpty() {
  return <State variant="empty" density="banner" />;
}

export function BannerLoading() {
  return <State variant="loading" density="banner" />;
}

export function BannerError() {
  return <State variant="error" density="banner" />;
}

export function BannerOffline() {
  return <State variant="offline" density="banner" />;
}

export function BannerStale() {
  return <State variant="stale" density="banner" />;
}

export function BannerNotFound() {
  return <State variant="not-found" density="banner" />;
}

export function BannerForbidden() {
  return <State variant="forbidden" density="banner" />;
}

export function BannerDegraded() {
  return <State variant="degraded" density="banner" />;
}

// ── chip density ──────────────────────────────────────────────────────────────

export function ChipEmpty() {
  return (
    <p>
      Some list content <State variant="empty" density="chip" /> here.
    </p>
  );
}

export function ChipLoading() {
  return (
    <p>
      Status: <State variant="loading" density="chip" />
    </p>
  );
}

export function ChipError() {
  return (
    <p>
      Status: <State variant="error" density="chip" />
    </p>
  );
}

export function ChipOffline() {
  return (
    <p>
      Network: <State variant="offline" density="chip" />
    </p>
  );
}

export function ChipStale() {
  return (
    <p>
      Data: <State variant="stale" density="chip" />
    </p>
  );
}

export function ChipNotFound() {
  return (
    <p>
      Result: <State variant="not-found" density="chip" />
    </p>
  );
}

export function ChipForbidden() {
  return (
    <p>
      Access: <State variant="forbidden" density="chip" />
    </p>
  );
}

export function ChipDegraded() {
  return (
    <p>
      Service: <State variant="degraded" density="chip" />
    </p>
  );
}

// ── override + actions showcase ───────────────────────────────────────────────

export function WithActionsPage() {
  return (
    <State
      variant="error"
      title="Failed to load report"
      description="The report export timed out. Try again or download a smaller date range."
      primaryAction={{ label: 'Retry', onClick: () => alert('Retrying…') }}
      secondaryAction={{ label: 'Get help', href: '/support' }}
    />
  );
}

export function WithActionsBanner() {
  return (
    <State
      variant="offline"
      density="banner"
      primaryAction={{ label: 'Dismiss', onClick: () => {} }}
      secondaryAction={{ label: 'Learn more', href: '/docs/offline' }}
    />
  );
}

export function AllVariantsPage() {
  return (
    <div style={{ display: 'grid', gap: 16, padding: 24 }}>
      {ALL_VARIANTS.map((v) => (
        <State key={v} variant={v} />
      ))}
    </div>
  );
}

export function AllVariantsBanner() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {ALL_VARIANTS.map((v) => (
        <State key={v} variant={v} density="banner" />
      ))}
    </div>
  );
}

export function AllVariantsChip() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24 }}>
      {ALL_VARIANTS.map((v) => (
        <State key={v} variant={v} density="chip" />
      ))}
    </div>
  );
}

// Explicitly defined matrix view showing all 24 variant×density combos
export function FullMatrix() {
  const densities: StateDensity[] = ['page', 'banner', 'chip'];
  return (
    <div style={{ padding: 24 }}>
      {ALL_VARIANTS.map((v) => (
        <section key={v} style={{ marginBottom: 48 }}>
          <h3 style={{ fontFamily: 'monospace', marginBottom: 12 }}>{v}</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {densities.map((d) => (
              <div key={d}>
                <small style={{ fontFamily: 'monospace', opacity: 0.6 }}>{d}</small>
                <div style={{ marginTop: 4 }}>
                  <State variant={v} density={d} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
