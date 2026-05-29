/**
 * BulkSelectableTable — composes useMultiSelect + Toolbar (mode="bulk") with a
 * list of rows and provides keyboard shortcuts, a tri-state header, and a
 * typed bulk-action result contract.
 *
 * Pair with `useMultiSelect` (internal); the bulk action bar is auto-mounted
 * via `<Toolbar mode="bulk">`. Caller supplies `rows`, `rowKey`, `renderRow`,
 * and a list of `bulkActions` — each action returns a `BulkActionResult`
 * describing which rows succeeded and which failed.
 *
 * Failed-results detail is shown inline in a `role="status"` live region;
 * caller can also subscribe via `onResult` to surface a Drawer.
 */
import * as React from 'react';
import { useMultiSelect } from './hooks/useMultiSelect';
import { Toolbar, type ToolbarAction } from './Toolbar';

/**
 * Contract returned by a bulk action. Keys are the values produced by
 * `rowKey(row)` for the original row set.
 */
export interface BulkActionResult<T> {
  /** Keys that succeeded. */
  succeeded: ReadonlyArray<string>;
  /** Per-row failures with a human-readable reason. */
  failed: ReadonlyArray<{ key: string; reason: string }>;
  /** Optional aggregated note (e.g. "skipped 3 already-done rows"). */
  note?: string;
  /** Identity of the action that produced this result (helps multi-action callers). */
  actionId?: string;
}

export interface BulkSelectableTableAction<T> {
  id: string;
  label: string;
  /** Visual tone forwarded to the bulk Toolbar. */
  tone?: ToolbarAction['tone'];
  /** Optional disable predicate based on the current selection. */
  disabled?: (selection: ReadonlyArray<T>) => boolean;
  /** Optional icon forwarded to the bulk Toolbar. */
  icon?: React.ReactNode;
  /**
   * Run the bulk action against the selected rows and return a result.
   * The component will display a summary; the caller can use `onResult`
   * for richer surfaces (drawer, toast, etc.).
   */
  run: (selection: ReadonlyArray<T>) => Promise<BulkActionResult<T>>;
}

export interface BulkSelectableTableProps<T> {
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  /** Render a single row's body content. The checkbox column is added automatically. */
  renderRow: (row: T) => React.ReactNode;
  bulkActions: ReadonlyArray<BulkSelectableTableAction<T>>;
  /** Optional callback fired after a bulk action completes. */
  onResult?: (result: BulkActionResult<T>) => void;
  /** Accessible label for the grid as a whole. */
  ariaLabel?: string;
  className?: string;
  /** Optional column heading rendered above the row content. */
  rowHeading?: React.ReactNode;
}

/**
 * Header tri-state checkbox: empty / indeterminate / all-checked.
 */
function HeaderCheckbox({
  total,
  selectedCount,
  onChange,
}: {
  total: number;
  selectedCount: number;
  onChange: (selectAll: boolean) => void;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  const allChecked = total > 0 && selectedCount === total;
  const indeterminate = selectedCount > 0 && selectedCount < total;
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={allChecked ? 'Deselect all rows' : 'Select all rows'}
      className="cc-bst__cb cc-bst__cb--header"
      checked={allChecked}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  );
}

export function BulkSelectableTable<T>({
  rows,
  rowKey,
  renderRow,
  bulkActions,
  onResult,
  ariaLabel = 'Selectable rows',
  className,
  rowHeading,
}: BulkSelectableTableProps<T>) {
  const sel = useMultiSelect<T>({ items: rows, getKey: rowKey });
  const [busy, setBusy] = React.useState<string | null>(null);
  const [lastResult, setLastResult] = React.useState<BulkActionResult<T> | null>(null);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        sel.clear();
        setLastResult(null);
      }
    },
    [sel],
  );

  const runAction = React.useCallback(
    async (action: BulkSelectableTableAction<T>) => {
      const items = sel.selectedItems;
      if (items.length === 0) return;
      setBusy(action.id);
      setLastResult(null);
      try {
        const result = await action.run(items);
        const tagged: BulkActionResult<T> = { ...result, actionId: action.id };
        setLastResult(tagged);
        onResult?.(tagged);
        // Convention: on full success, clear selection. On any failure, keep so user can act.
        if (tagged.failed.length === 0) sel.clear();
      } finally {
        setBusy(null);
      }
    },
    [sel, onResult],
  );

  const barActions: ToolbarAction[] = bulkActions.map((a) => ({
    id: a.id,
    label: a.label,
    tone: a.tone,
    icon: a.icon,
    disabled: busy !== null || (a.disabled?.(sel.selectedItems) ?? false),
    onClick: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      runAction(a);
    },
  }));

  return (
    <div
      className={['cc-bst', className].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
    >
      <div role="grid" aria-label={ariaLabel} className="cc-bst__grid" tabIndex={-1}>
        <div role="row" className="cc-bst__row cc-bst__row--header">
          <div role="columnheader" className="cc-bst__cell cc-bst__cell--checkbox">
            <HeaderCheckbox
              total={rows.length}
              selectedCount={sel.count}
              onChange={(checked) => (checked ? sel.selectAll() : sel.clear())}
            />
          </div>
          {rowHeading && (
            <div role="columnheader" className="cc-bst__cell cc-bst__cell--heading">
              {rowHeading}
            </div>
          )}
        </div>
        {rows.map((r) => {
          const key = rowKey(r);
          const checked = sel.isSelected(r);
          return (
            <div
              key={key}
              role="row"
              aria-selected={checked}
              className={['cc-bst__row', checked ? 'cc-bst__row--selected' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <div role="gridcell" className="cc-bst__cell cc-bst__cell--checkbox">
                <input
                  type="checkbox"
                  className="cc-bst__cb"
                  aria-label={`Select row ${key}`}
                  checked={checked}
                  onChange={(e) => {
                    // Native onChange doesn't carry shift; use the click event for that.
                    const ev = e.nativeEvent as MouseEvent;
                    sel.toggle(r, { shift: ev.shiftKey });
                  }}
                />
              </div>
              <div role="gridcell" className="cc-bst__cell">
                {renderRow(r)}
              </div>
            </div>
          );
        })}
      </div>

      <Toolbar
        mode="bulk"
        selectedCount={sel.count}
        onClear={() => {
          sel.clear();
          setLastResult(null);
        }}
        actions={barActions}
      />

      {lastResult && (
        <div role="status" aria-live="polite" className="cc-bst__result">
          {lastResult.succeeded.length} succeeded
          {lastResult.failed.length > 0 ? `, ${lastResult.failed.length} failed` : ''}
          {lastResult.note ? ` — ${lastResult.note}` : ''}
          {lastResult.failed.length > 0 && (
            <ul className="cc-bst__result-failures">
              {lastResult.failed.map((f) => (
                <li key={f.key}>
                  <code>{f.key}</code>: {f.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
