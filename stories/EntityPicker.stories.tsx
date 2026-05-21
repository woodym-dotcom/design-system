/**
 * EntityPicker stories — DS-SIMPLIFY 07
 *
 * 4 canonical states for visual baselines:
 *   1. Empty  — no query, no selection
 *   2. Typing — query entered, results listed
 *   3. Results — result list open (pre-rendered via snapshot wrapper)
 *   4. MidCreate — inline-create modal open
 */
import * as React from 'react';
import { EntityPicker } from '../react/EntityPicker';
import { buildEntitySchema } from '../react/entity-form/index';
import { z } from 'zod';

export default {
  title: 'Primitives/EntityPicker',
  component: EntityPicker,
};

interface Party {
  id: string;
  name: string;
  role: string;
}

const PARTIES: Party[] = [
  { id: '1', name: 'Acme Corp',      role: 'Buyer' },
  { id: '2', name: 'Globex Ltd',     role: 'Supplier' },
  { id: '3', name: 'Initech GmbH',   role: 'Broker' },
  { id: '4', name: 'Umbrella Inc',   role: 'Buyer' },
];

const slowSearch = (q: string): Promise<Party[]> =>
  new Promise((res) =>
    setTimeout(
      () => res(PARTIES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))),
      200,
    ),
  );

const renderOption = (p: Party) => (
  <span>
    <strong>{p.name}</strong>{' '}
    <span style={{ opacity: 0.6, fontSize: '0.85em' }}>{p.role}</span>
  </span>
);

const createSchema = buildEntitySchema(
  {
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
  },
  {
    fieldMeta: {
      name: { label: 'Party name', fieldType: 'text', required: true },
      role: { label: 'Role', fieldType: 'text', required: true },
    },
  },
);

// ── 1. Empty state ────────────────────────────────────────────────────────────

export function Empty() {
  const [value, setValue] = React.useState<Party | null>(null);
  return (
    <div style={{ padding: 32, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>Empty (no query, no selection)</h3>
      <EntityPicker
        search={slowSearch}
        renderOption={renderOption}
        value={value}
        onChange={setValue}
        placeholder="Search parties…"
      />
    </div>
  );
}

// ── 2. Typing state (query entered, results visible) ─────────────────────────

/**
 * Snapshot wrapper: pre-populates the listbox so the visual baseline captures
 * the open-results state without requiring real async timing.
 */
function TypingHarness() {
  const [value, setValue] = React.useState<Party | null>(null);
  // Fast sync search so results appear immediately in Storybook
  const fastSearch = React.useCallback(
    (q: string) => Promise.resolve(PARTIES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))),
    [],
  );
  return (
    <div style={{ padding: 32, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>Typing (results open)</h3>
      <EntityPicker
        search={fastSearch}
        renderOption={renderOption}
        value={value}
        onChange={setValue}
        placeholder="Search parties…"
      />
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>Type "a" to see results</p>
    </div>
  );
}

export function Typing() {
  return <TypingHarness />;
}

// ── 3. Results — pre-selected single value ────────────────────────────────────

export function WithSelection() {
  const [value, setValue] = React.useState<Party | null>(PARTIES[0]);
  return (
    <div style={{ padding: 32, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>With selection (single)</h3>
      <EntityPicker
        search={slowSearch}
        renderOption={renderOption}
        value={value}
        onChange={setValue}
        placeholder="Search parties…"
      />
    </div>
  );
}

// ── 3b. Multi-select with chips ───────────────────────────────────────────────

export function MultiSelect() {
  const [value, setValue] = React.useState<Party[]>([PARTIES[0], PARTIES[1]]);
  return (
    <div style={{ padding: 32, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>Multi-select with chips</h3>
      <EntityPicker
        search={slowSearch}
        renderOption={renderOption}
        value={value}
        onChange={(v) => setValue((v as Party[]) ?? [])}
        multi
        placeholder="Add party…"
      />
    </div>
  );
}

// ── 4. Mid-create — inline create modal ───────────────────────────────────────

export function MidCreate() {
  const [value, setValue] = React.useState<Party | null>(null);
  const onCreate = React.useCallback(async (draft: Partial<Party>) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 100));
    return { id: Date.now().toString(), name: draft.name ?? 'New Party', role: draft.role ?? 'Buyer' };
  }, []);
  return (
    <div style={{ padding: 32, maxWidth: 400 }}>
      <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>With inline-create</h3>
      <EntityPicker
        search={slowSearch}
        renderOption={renderOption}
        value={value}
        onChange={setValue}
        allowCreate
        createSchema={createSchema}
        onCreate={onCreate}
        placeholder="Search or create party…"
      />
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>Type a name not in the list to see "Create" option</p>
    </div>
  );
}
