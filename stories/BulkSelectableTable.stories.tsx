import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  BulkSelectableTable,
  type BulkActionResult,
  type BulkSelectableTableAction,
} from '../react/BulkSelectableTable';

interface Ticket {
  id: string;
  title: string;
  state: 'open' | 'closed' | 'flagged';
}

const TICKETS: Ticket[] = [
  { id: 't-001', title: 'Reassign reviewer for case 4421', state: 'open' },
  { id: 't-002', title: 'Approve evidence bundle 7e88a', state: 'open' },
  { id: 't-003', title: 'Replay failed delivery wf-29', state: 'flagged' },
  { id: 't-004', title: 'Acknowledge drift alert ds-12', state: 'open' },
  { id: 't-005', title: 'Promote feature flag onboarding-v2', state: 'open' },
];

const meta: Meta<typeof BulkSelectableTable<Ticket>> = {
  title: 'Primitives/BulkSelectableTable',
  component: BulkSelectableTable<Ticket>,
  parameters: {
    docs: {
      description: {
        component:
          'Composes useMultiSelect + BulkBar with a list of rows. Header tri-state, per-row checkboxes, Escape clears selection, bulk-action result contract surfaced inline.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof BulkSelectableTable<Ticket>>;

const archive: BulkSelectableTableAction<Ticket> = {
  id: 'archive',
  label: 'Archive',
  tone: 'primary',
  run: async (sel) => {
    await new Promise((r) => setTimeout(r, 250));
    return { succeeded: sel.map((s) => s.id), failed: [] };
  },
};

const closeWithSomeFailures: BulkSelectableTableAction<Ticket> = {
  id: 'close',
  label: 'Close',
  run: async (sel): Promise<BulkActionResult<Ticket>> => {
    await new Promise((r) => setTimeout(r, 400));
    const failed = sel
      .filter((t) => t.state === 'flagged')
      .map((t) => ({ key: t.id, reason: 'Flagged tickets need triage first' }));
    const succeeded = sel.filter((t) => t.state !== 'flagged').map((t) => t.id);
    return { succeeded, failed };
  },
};

export const Default: Story = {
  args: {
    rows: TICKETS,
    rowKey: (t) => t.id,
    renderRow: (t) => (
      <span>
        <code style={{ fontFamily: 'monospace', marginRight: '0.5em' }}>{t.id}</code>
        {t.title}
      </span>
    ),
    bulkActions: [archive, closeWithSomeFailures],
    rowHeading: 'Ticket',
    ariaLabel: 'Open Workforce tickets',
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    rowKey: (t) => t.id,
    renderRow: (t) => <span>{t.title}</span>,
    bulkActions: [archive],
    rowHeading: 'Ticket',
  },
};

export const ReversibleWithUndoHint: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Reversible actions (approve, reassign, replay) should expose `onResult` to wire a 5s undo toast via the consumer app shell. Destructive actions still go through KillSwitchConfirm — not BulkBar Undo.',
      },
    },
  },
  args: {
    rows: TICKETS.slice(0, 3),
    rowKey: (t) => t.id,
    renderRow: (t) => <span>{t.title}</span>,
    bulkActions: [
      { ...archive, label: 'Reassign' },
      { ...archive, label: 'Replay' },
    ],
    onResult: (r) => {
      // eslint-disable-next-line no-console
      console.log('bulk result', r);
    },
  },
};
