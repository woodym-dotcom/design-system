/**
 * ListView stories — Storybook CSF v3 format.
 *
 * Run with: npx storybook dev (once Storybook is added to the repo).
 * Each story exports a named function that renders the component in a specific state.
 */
import * as React from 'react';
import { ListView, type ListViewColumn } from '../react/ListView';

export default {
  title: 'Shell Primitives/ListView',
  component: ListView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table-based entity list with sortable headers, scope filter tabs, and pagination. ' +
          'Use instead of card-based entity layouts (see @ds/eslint-plugin no-card-entity-layout).',
      },
    },
  },
};

interface Vendor {
  id: string;
  name: string;
  riskLevel: string;
  status: string;
  lastReviewed: string;
}

const COLUMNS: ListViewColumn<Vendor>[] = [
  { key: 'name', label: 'Vendor name', sortable: true, render: (r) => r.name, minWidth: '180px' },
  { key: 'riskLevel', label: 'Risk level', sortable: true, render: (r) => r.riskLevel },
  { key: 'status', label: 'Status', render: (r) => r.status },
  { key: 'lastReviewed', label: 'Last reviewed', render: (r) => r.lastReviewed },
];

const ROWS: (Vendor & { id: string })[] = [
  { id: '1', name: 'Acme Corp', riskLevel: 'High', status: 'Active', lastReviewed: '01 May 2026' },
  { id: '2', name: 'Beta Systems', riskLevel: 'Medium', status: 'Active', lastReviewed: '28 Apr 2026' },
  { id: '3', name: 'Gamma Solutions', riskLevel: 'Low', status: 'Inactive', lastReviewed: '15 Mar 2026' },
  { id: '4', name: 'Delta Tech', riskLevel: 'High', status: 'Under review', lastReviewed: '02 May 2026' },
  { id: '5', name: 'Epsilon Ltd', riskLevel: 'Medium', status: 'Active', lastReviewed: '30 Apr 2026' },
];

const SCOPE_FILTERS = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'active', label: 'Active', count: 3 },
  { id: 'inactive', label: 'Inactive', count: 1 },
];

/** Golden path: full list with scope filters, sorting, and pagination */
export function Default() {
  const [activeScopeId, setActiveScopeId] = React.useState('all');
  const [sortKey, setSortKey] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | 'none'>('none');
  const [page, setPage] = React.useState(1);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <ListView
      columns={COLUMNS}
      rows={ROWS}
      heading="Vendors"
      subtitle="Onboarded suppliers and their risk posture"
      scopeFilters={SCOPE_FILTERS}
      activeScopeId={activeScopeId}
      onScopeChange={setActiveScopeId}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={(key, dir) => { setSortKey(key); setSortDirection(dir); }}
      pagination={{ page, pageSize: 3, totalItems: ROWS.length }}
      onPageChange={setPage}
      selectedId={selectedId}
      onRowClick={setSelectedId}
      createAction={<button type="button" className="cc-btn cc-btn--primary">+ New vendor</button>}
    />
  );
}

/** Empty state */
export function Empty() {
  return (
    <ListView
      columns={COLUMNS}
      rows={[]}
      heading="Vendors"
      emptyState={<span>No vendors found. Create your first vendor to get started.</span>}
    />
  );
}

/** Loading skeleton */
export function Loading() {
  return (
    <ListView
      columns={COLUMNS}
      rows={[]}
      heading="Vendors"
      loading
    />
  );
}

/** Infinite scroll mode */
export function InfiniteScroll() {
  const [rows, setRows] = React.useState(ROWS.slice(0, 3));
  const [hasMore, setHasMore] = React.useState(true);

  const loadMore = () => {
    const next = ROWS.slice(rows.length, rows.length + 2);
    setRows((prev) => [...prev, ...next]);
    if (rows.length + next.length >= ROWS.length) setHasMore(false);
  };

  return (
    <ListView
      columns={COLUMNS}
      rows={rows}
      heading="Vendors"
      paginationMode="infinite-scroll"
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}

/** Single column, no sorting, no scope filters */
export function Minimal() {
  const simpleColumns: ListViewColumn<Vendor>[] = [
    { key: 'name', label: 'Vendor name', render: (r) => r.name },
  ];
  return (
    <ListView
      columns={simpleColumns}
      rows={ROWS}
      heading="Vendors"
    />
  );
}
