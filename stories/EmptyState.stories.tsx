/**
 * EmptyState stories — long-tail variants + multi-action.
 */
import * as React from 'react';
import { EmptyState } from '../react/EmptyState';

export default {
  title: 'Foundation/EmptyState',
  component: EmptyState,
};

export function Default() {
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <EmptyState
        title="No vendors yet"
        description="Add your first vendor to start onboarding."
        action={{ label: 'Add vendor', onClick: () => {} }}
      />
    </div>
  );
}

export function Variants() {
  const variants = ['empty', 'offline', 'rate-limited', 'permissioned-out', 'stale', 'partial', 'error', 'loading'] as const;
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16 }}>
      {variants.map((v) => (
        <EmptyState
          key={v}
          variant={v}
          title={v.charAt(0).toUpperCase() + v.slice(1)}
          description={`Variant: ${v}. Action picks the right tone + ARIA role automatically.`}
          action={[
            { label: 'Primary', onClick: () => {} },
            { label: 'Help', onClick: () => {} },
          ]}
        />
      ))}
    </div>
  );
}
