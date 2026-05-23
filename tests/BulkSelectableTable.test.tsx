/**
 * BulkSelectableTable — ties useMultiSelect + BulkBar to a list of rows.
 *
 * Adds: tri-state header checkbox, per-row selection column, keyboard
 * shortcuts (x toggle row, Shift+x range-select, Esc clear), and a typed
 * bulk-action result contract surfaced via callback.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  BulkSelectableTable,
  type BulkActionResult,
} from '../react/BulkSelectableTable';

interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = [
  { id: 'r1', name: 'Alpha' },
  { id: 'r2', name: 'Beta' },
  { id: 'r3', name: 'Gamma' },
  { id: 'r4', name: 'Delta' },
];

function Harness({
  onBulk,
}: {
  onBulk?: (rows: Row[]) => Promise<BulkActionResult<Row>>;
}) {
  return (
    <BulkSelectableTable<Row>
      rows={ROWS}
      rowKey={(r) => r.id}
      renderRow={(r) => <span data-testid={`row-${r.id}`}>{r.name}</span>}
      bulkActions={[
        {
          id: 'archive',
          label: 'Archive',
          tone: 'primary',
          run: onBulk ?? (async (sel) => ({
            succeeded: sel.map((r) => r.id),
            failed: [],
          })),
        },
      ]}
    />
  );
}

describe('BulkSelectableTable', () => {
  it('renders a row per item', () => {
    render(<Harness />);
    for (const r of ROWS) {
      expect(screen.getByTestId(`row-${r.id}`).textContent).toBe(r.name);
    }
  });

  it('renders a checkbox per row + header tri-state checkbox', () => {
    const { container } = render(<Harness />);
    // 4 row checkboxes + 1 header
    const checkboxes = container.querySelectorAll('input[type=checkbox]');
    expect(checkboxes.length).toBe(ROWS.length + 1);
  });

  it('shows the BulkBar only after selecting at least one row', () => {
    render(<Harness />);
    // BulkBar hidden when count=0; presence detected via aria-label.
    expect(screen.queryByRole('region', { name: /selected/i })).toBeNull();
    const checkboxes = document.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    fireEvent.click(checkboxes[1]); // first row (index 0 is header)
    expect(screen.getByRole('region', { name: /1 item selected/i })).toBeTruthy();
  });

  it('header tri-state: empty → all → empty', () => {
    render(<Harness />);
    const header = document.querySelectorAll('input[type=checkbox]')[0] as HTMLInputElement;
    expect(header.checked).toBe(false);
    fireEvent.click(header);
    expect(header.checked).toBe(true);
    expect(screen.getByRole('region', { name: /4 items selected/i })).toBeTruthy();
    fireEvent.click(header);
    expect(header.checked).toBe(false);
    expect(screen.queryByRole('region', { name: /selected/i })).toBeNull();
  });

  it('header shows indeterminate state when some rows are selected', () => {
    render(<Harness />);
    const checkboxes = document.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    const header = checkboxes[0];
    fireEvent.click(checkboxes[1]); // select first row
    expect(header.indeterminate).toBe(true);
    expect(header.checked).toBe(false);
  });

  it('Escape clears selection', () => {
    const { container } = render(<Harness />);
    const checkboxes = document.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(screen.getByRole('region', { name: /2 items selected/i })).toBeTruthy();
    fireEvent.keyDown(container.querySelector('[role="grid"]')!, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /selected/i })).toBeNull();
  });

  it('invokes the bulk action with selected rows and surfaces the result', async () => {
    const runSpy = vi.fn(async (sel: Row[]) => ({
      succeeded: sel.map((r) => r.id),
      failed: [],
    } as BulkActionResult<Row>));

    render(<Harness onBulk={runSpy} />);
    const checkboxes = document.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Archive$/ }));
    });
    expect(runSpy).toHaveBeenCalledTimes(1);
    const args = runSpy.mock.calls[0][0];
    expect(args.map((r: Row) => r.id).sort()).toEqual(['r1', 'r2']);
  });

  it('surfaces a results banner after a partial-failure bulk action', async () => {
    const runSpy = vi.fn(
      async (sel: Row[]): Promise<BulkActionResult<Row>> => ({
        succeeded: [sel[0]!.id],
        failed: [{ key: sel[1]!.id, reason: 'already reassigned' }],
      }),
    );

    render(<Harness onBulk={runSpy} />);
    const checkboxes = document.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Archive$/ }));
    });

    // Status region announces the outcome.
    const status = await screen.findByRole('status');
    expect(status.textContent).toMatch(/1.*succeeded/i);
    expect(status.textContent).toMatch(/1.*failed/i);
  });
});
