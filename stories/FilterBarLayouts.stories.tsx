/**
 * FilterBar layout-mode stories — RW lift additions.
 * Covers: horizontal (default), sidebar, responsive.
 * The wired story shows useUrlFilterState round-trip.
 */
import * as React from 'react';
import { FilterBar } from '../react/FilterBar';
import { useUrlFilterState } from '../react/hooks/useUrlFilterState';

export default {
  title: 'Shell Primitives/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Filter chip bar. RW lift adds sidebar and responsive layout modes. ' +
          'The "URL Roundtrip" story wires FilterBar to useUrlFilterState.',
      },
    },
  },
};

const OPTIONS = [
  { id: 'active', label: 'Active', group: 'Status', count: 12 },
  { id: 'pending', label: 'Pending', group: 'Status', count: 4 },
  { id: 'closed', label: 'Closed', group: 'Status', count: 0 },
  { id: 'senior', label: 'Senior', group: 'Level', count: 7 },
  { id: 'mid', label: 'Mid', group: 'Level', count: 9 },
  { id: 'junior', label: 'Junior', group: 'Level', count: 3 },
];

// ---------------------------------------------------------------------------
// Horizontal (default — backward compat)
// ---------------------------------------------------------------------------

export function Horizontal() {
  const [activeIds, setActiveIds] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  return (
    <FilterBar
      options={OPTIONS}
      activeIds={activeIds}
      onToggle={toggle}
      layout="horizontal"
    />
  );
}
Horizontal.storyName = 'Horizontal (default)';

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export function Sidebar() {
  const [activeIds, setActiveIds] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <FilterBar
        options={OPTIONS}
        activeIds={activeIds}
        onToggle={toggle}
        layout="sidebar"
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          Active: {activeIds.join(', ') || '—'}
        </p>
      </div>
    </div>
  );
}
Sidebar.storyName = 'Sidebar';

// ---------------------------------------------------------------------------
// Responsive
// ---------------------------------------------------------------------------

export function Responsive() {
  const [activeIds, setActiveIds] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  return (
    <div>
      <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '12px' }}>
        Resize the viewport: sidebar at ≥768px, horizontal chips below.
      </p>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <FilterBar
          options={OPTIONS}
          activeIds={activeIds}
          onToggle={toggle}
          layout="responsive"
          collapsedAt={768}
        />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            Active: {activeIds.join(', ') || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
Responsive.storyName = 'Responsive (sidebar ≥768px)';

// ---------------------------------------------------------------------------
// URL Roundtrip — FilterBar + useUrlFilterState wired together
// ---------------------------------------------------------------------------

export function UrlRoundtrip() {
  const [filters, setFilters] = useUrlFilterState(
    { status: [], level: [] },
    { paramPrefix: 'story_' },
  );

  // Map flat filter arrays to activeIds for FilterBar.
  const activeIds = [...filters.status, ...filters.level];

  const toggle = (id: string) => {
    const statusIds = OPTIONS.filter((o) => o.group === 'Status').map((o) => o.id);
    const levelIds = OPTIONS.filter((o) => o.group === 'Level').map((o) => o.id);

    if (statusIds.includes(id)) {
      const next = filters.status.includes(id)
        ? filters.status.filter((x) => x !== id)
        : [...filters.status, id];
      setFilters({ ...filters, status: next });
    } else if (levelIds.includes(id)) {
      const next = filters.level.includes(id)
        ? filters.level.filter((x) => x !== id)
        : [...filters.level, id];
      setFilters({ ...filters, level: next });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <FilterBar
        options={OPTIONS}
        activeIds={activeIds}
        onToggle={toggle}
        layout="sidebar"
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          URL params written via useUrlFilterState:
        </p>
        <pre style={{ fontSize: '11px', background: 'var(--surface-2)', padding: '8px', borderRadius: '4px' }}>
          {JSON.stringify(filters, null, 2)}
        </pre>
        <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
          Check the browser address bar — changes are written to ?story_status=&hellip; via replaceState.
        </p>
      </div>
    </div>
  );
}
UrlRoundtrip.storyName = 'URL Roundtrip (useUrlFilterState)';
