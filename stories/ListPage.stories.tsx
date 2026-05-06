/**
 * ListPage stories — Phase 2 keystone entity surface.
 *
 * Four stories mirroring the four canonical consumer archetypes:
 *  1. Companies-like: chips + sidebar filter, edit-mode detail, bulk actions
 *  2. Decisions-like: sort + scope filters + detail pane (read-only)
 *  3. Journey-like: infinite pagination, empty state, permissions gating
 *  4. Configurations-like: tabs composition (ModuleShell wrapping ListPage)
 */
import * as React from 'react';
import { ListPage } from '../react/ListPage';
import { ModuleShell } from '../react/ModuleShell';
import type { ListViewColumn } from '../react/ListView';

export default {
  title: 'Shell Primitives/ListPage (Phase 2)',
  component: ListPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The canonical entity-surface keystone. Every entity list surface mounts ' +
          'exactly one <ListPage>. See DESIGN.md §Entity surface composition for usage.',
      },
    },
  },
};

// ── Shared types ──────────────────────────────────────────────────────────────

interface Company {
  id: string;
  name: string;
  status: string;
  riskLevel: string;
}

const COMPANY_COLS: ListViewColumn<Company>[] = [
  { key: 'name', label: 'Company', sortable: true, minWidth: '200px', render: (r) => r.name },
  { key: 'status', label: 'Status', render: (r) => r.status },
  { key: 'riskLevel', label: 'Risk', sortable: true, render: (r) => r.riskLevel },
];

const COMPANIES: Company[] = [
  { id: '1', name: 'Acme Corp', status: 'Active', riskLevel: 'High' },
  { id: '2', name: 'Beta Systems', status: 'Active', riskLevel: 'Medium' },
  { id: '3', name: 'Gamma Solutions', status: 'Inactive', riskLevel: 'Low' },
  { id: '4', name: 'Delta Tech', status: 'Under review', riskLevel: 'High' },
  { id: '5', name: 'Epsilon Ltd', status: 'Active', riskLevel: 'Medium' },
];

const FILTER_OPTIONS = [
  { id: 'active', label: 'Active', group: 'Status', count: 3 },
  { id: 'inactive', label: 'Inactive', group: 'Status', count: 1 },
  { id: 'review', label: 'Under review', group: 'Status', count: 1 },
  { id: 'high', label: 'High', group: 'Risk' },
  { id: 'medium', label: 'Medium', group: 'Risk' },
  { id: 'low', label: 'Low', group: 'Risk' },
];

// ── Story 1: Companies-like ───────────────────────────────────────────────────

/**
 * Companies-like: chips filters, detail pane with edit-mode, bulk actions.
 */
export function CompaniesLike() {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [bulkSelected, setBulkSelected] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<{ key: string; direction: 'asc' | 'desc' | 'none' }>({
    key: '',
    direction: 'none',
  });

  const filteredRows = activeFilters.length === 0
    ? COMPANIES
    : COMPANIES.filter(
        (c) =>
          activeFilters.includes(c.status.toLowerCase().replace(' ', '')) ||
          activeFilters.includes(c.riskLevel.toLowerCase()),
      );

  return (
    <div style={{ padding: 24 }}>
      <ListPage
        heading="Companies"
        subtitle="All registered companies and their risk posture"
        breadcrumb={
          <nav aria-label="Breadcrumb" style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>
            <a href="/">Home</a> / <span>Companies</span>
          </nav>
        }
        createMenu={{
          items: [{ kind: 'manual', label: 'New company', onSelect: () => alert('New company') }],
          triggerLabel: 'New company',
        }}
        filters={{
          kind: 'chips',
          options: FILTER_OPTIONS,
          activeIds: activeFilters,
          onToggle: (id) =>
            setActiveFilters((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            ),
        }}
        list={{
          columns: COMPANY_COLS,
          rows: filteredRows,
          sort,
          onSortChange: (key, direction) => setSort({ key, direction }),
          onRowClick: setSelectedId,
        }}
        detail={{
          selectedId,
          onClose: () => setSelectedId(null),
          render: (id, { editMode, setEditMode: _setEM }) => (
            <div style={{ padding: 16 }}>
              <p><strong>Company #{id}</strong></p>
              <p>{editMode ? 'Edit mode — form goes here' : 'View mode — details here'}</p>
            </div>
          ),
        }}
        bulk={{
          selectedIds: bulkSelected,
          onChange: setBulkSelected,
          actions: [
            { id: 'archive', label: 'Archive', onRun: (rows) => alert(`Archive: ${rows.map((r) => r.name).join(', ')}`) },
            { id: 'delete', label: 'Delete', onRun: (rows) => alert(`Delete: ${rows.map((r) => r.name).join(', ')}`) },
          ],
        }}
        permissions={{ canCreate: true, canEdit: true, canDelete: true }}
      />
    </div>
  );
}

// ── Story 2: Decisions-like ───────────────────────────────────────────────────

interface Decision {
  id: string;
  title: string;
  owner: string;
  phase: string;
  due: string;
}

const DECISION_COLS: ListViewColumn<Decision>[] = [
  { key: 'title', label: 'Decision', sortable: true, minWidth: '200px', render: (r) => r.title },
  { key: 'owner', label: 'Owner', render: (r) => r.owner },
  { key: 'phase', label: 'Phase', render: (r) => r.phase },
  { key: 'due', label: 'Due', sortable: true, render: (r) => r.due },
];

const DECISIONS: Decision[] = [
  { id: 'd1', title: 'Expand to APAC', owner: 'Alice', phase: 'Screen', due: '2026-06-01' },
  { id: 'd2', title: 'Vendor consolidation', owner: 'Bob', phase: 'Allocate', due: '2026-05-15' },
  { id: 'd3', title: 'Platform migration', owner: 'Carol', phase: 'Score', due: '2026-07-01' },
];

const SCOPE_FILTERS = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'active', label: 'Active', count: 2 },
  { id: 'complete', label: 'Complete', count: 1 },
];

/**
 * Decisions-like: scope filter tabs, sort, read-only detail pane, no bulk.
 */
export function DecisionsLike() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [activeScopeId, setActiveScopeId] = React.useState('all');
  const [sort, setSort] = React.useState<{ key: string; direction: 'asc' | 'desc' | 'none' }>({
    key: 'due',
    direction: 'asc',
  });

  return (
    <div style={{ padding: 24 }}>
      <ListPage
        heading="Decisions"
        list={{
          columns: DECISION_COLS,
          rows: DECISIONS,
          scopeFilters: SCOPE_FILTERS,
          activeScopeId,
          onScopeChange: setActiveScopeId,
          sort,
          onSortChange: (key, direction) => setSort({ key, direction }),
          onRowClick: setSelectedId,
        }}
        detail={{
          selectedId,
          onClose: () => setSelectedId(null),
          render: (id, _ctx) => {
            const d = DECISIONS.find((dec) => dec.id === id);
            return d ? (
              <div style={{ padding: 16 }}>
                <h3>{d.title}</h3>
                <p>Owner: {d.owner}</p>
                <p>Phase: {d.phase}</p>
                <p>Due: {d.due}</p>
              </div>
            ) : null;
          },
        }}
        permissions={{ canEdit: false }}
      />
    </div>
  );
}

// ── Story 3: Journey-like ─────────────────────────────────────────────────────

interface Journey {
  id: string;
  name: string;
  trigger: string;
  status: string;
}

const JOURNEY_COLS: ListViewColumn<Journey>[] = [
  { key: 'name', label: 'Journey', sortable: true, render: (r) => r.name },
  { key: 'trigger', label: 'Trigger', render: (r) => r.trigger },
  { key: 'status', label: 'Status', render: (r) => r.status },
];

/**
 * Journey-like: empty state, permission gating (read-only user).
 */
export function JourneyLike() {
  return (
    <div style={{ padding: 24 }}>
      <ListPage
        heading="Journeys"
        subtitle="Automated customer journeys"
        list={{
          columns: JOURNEY_COLS,
          rows: [],
          emptyState: (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontWeight: 600 }}>No journeys yet</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>
                Create your first journey to automate customer touchpoints.
              </p>
            </div>
          ),
        }}
        createMenu={{
          items: [{ kind: 'manual', label: 'New journey', onSelect: () => alert('New journey') }],
          triggerLabel: 'New journey',
        }}
        permissions={{ canCreate: false, canEdit: false, canDelete: false }}
      />
    </div>
  );
}

// ── Story 4: Configurations-like (tab composition with ModuleShell) ───────────

interface Config {
  id: string;
  key: string;
  value: string;
  scope: string;
}

const CONFIG_COLS: ListViewColumn<Config>[] = [
  { key: 'key', label: 'Key', sortable: true, render: (r) => r.key },
  { key: 'value', label: 'Value', render: (r) => r.value },
  { key: 'scope', label: 'Scope', render: (r) => r.scope },
];

const CONFIGS: Config[] = [
  { id: 'c1', key: 'max-retries', value: '3', scope: 'Global' },
  { id: 'c2', key: 'timeout-ms', value: '5000', scope: 'Global' },
  { id: 'c3', key: 'debug-mode', value: 'false', scope: 'Dev' },
];

/**
 * Configurations-like: ModuleShell wrapping ListPage in a tab, showing the
 * canonical composition (this is what every entity route looks like).
 */
export function ConfigurationsLike() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <ModuleShell
      title="Settings"
      tabs={[
        {
          id: 'configurations',
          label: 'Configurations',
          render: () => (
            <div style={{ padding: 24 }}>
              <ListPage
                heading="Configurations"
                subtitle="Platform-level settings"
                list={{
                  columns: CONFIG_COLS,
                  rows: CONFIGS,
                  onRowClick: setSelectedId,
                }}
                detail={{
                  selectedId,
                  onClose: () => setSelectedId(null),
                  render: (id, { editMode }) => {
                    const c = CONFIGS.find((cfg) => cfg.id === id);
                    return c ? (
                      <div style={{ padding: 16 }}>
                        <h4>{c.key}</h4>
                        {editMode ? (
                          <input defaultValue={c.value} style={{ display: 'block', marginTop: 8 }} />
                        ) : (
                          <p>{c.value}</p>
                        )}
                        <p style={{ color: '#6b7280', fontSize: 12 }}>Scope: {c.scope}</p>
                      </div>
                    ) : null;
                  },
                }}
                createMenu={{
                  items: [{ kind: 'manual', label: 'Add config', onSelect: () => alert('Add config') }],
                }}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
