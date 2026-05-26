import * as React from 'react';
import type { SavedView } from './hooks/useSavedViews';

export interface SavedViewsMenuProps<TState = unknown> {
  /** Current views, typically from `useSavedViews({ scope }).views`. */
  views: ReadonlyArray<SavedView<TState>>;
  /** Called when the user selects a saved view. */
  onSelect?: (view: SavedView<TState>) => void;
  /** @deprecated Use onSelect instead. */
  onApply?: (view: SavedView<TState>) => void;
  /**
   * Optional active view id (matches `view.id`). When set, the matching
   * menu item is marked as current.
   */
  activeId?: string;
  /** @deprecated Use activeId instead. */
  activeViewId?: string;
  /** Called when the user clicks "Save current as…" — host opens a name prompt. */
  onSaveCurrent?: () => void;
  /** Called when the user pins/unpins a view. */
  onTogglePin?: (id: string) => void;
  /** Called when the user removes a view. Host should confirm before destructive action. */
  onRemove?: (id: string) => void;
  /** Called when the user renames a view (host renders the input). */
  onRename?: (id: string) => void;
  /** Trigger label. Defaults to the active view name, then 'Views'. */
  triggerLabel?: string;
  /** Empty state copy when there are no saved views. */
  emptyMessage?: string;
  className?: string;
}

/**
 * Saved-views picker — dropdown on top of `useSavedViews()`. Renders a
 * trigger button that opens a menu of saved views, pinned ones first,
 * with optional inline rename / pin / remove controls. The host wires
 * the actions back into the hook.
 *
 * Composes a tiny click-outside + ESC menu (no portal — sits inline
 * with the trigger). For richer overlays, compose `<Drawer>` instead.
 */
export function SavedViewsMenu<TState = unknown>({
  views,
  onSelect,
  onApply,
  activeId,
  activeViewId,
  onSaveCurrent,
  onTogglePin,
  onRemove,
  onRename,
  triggerLabel,
  emptyMessage = 'No saved views yet.',
  className,
}: SavedViewsMenuProps<TState>) {
  const handler = onApply ?? onSelect ?? (() => {});
  const active = activeViewId ?? activeId;

  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeView = active ? views.find((v) => v.id === active) : undefined;
  const label = triggerLabel ?? activeView?.name ?? 'Views';

  return (
    <div
      ref={rootRef}
      className={['cc-saved-views', open && 'is-open', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="cc-saved-views__trigger cc-btn cc-btn--ghost"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span aria-hidden="true" className="cc-saved-views__caret">▾</span>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Saved views"
          className="cc-saved-views__menu"
        >
          {views.length === 0 ? (
            <p className="cc-saved-views__empty">{emptyMessage}</p>
          ) : (
            <ul className="cc-saved-views__list">
              {views.map((v) => {
                const isActive = v.id === active;
                return (
                  <li key={v.id} className="cc-saved-views__item" role="none">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      className={`cc-saved-views__select${isActive ? ' is-active' : ''}`}
                      onClick={() => {
                        handler(v);
                        setOpen(false);
                      }}
                    >
                      {v.pinned && <span aria-hidden="true" className="cc-saved-views__pin">★</span>}
                      <span className="cc-saved-views__name">{v.name}</span>
                    </button>
                    {(onTogglePin || onRename || onRemove) && (
                      <span className="cc-saved-views__row-actions">
                        {onTogglePin && (
                          <button
                            type="button"
                            className="cc-saved-views__action"
                            onClick={(e) => { e.stopPropagation(); onTogglePin(v.id); }}
                            aria-label={v.pinned ? `Unpin ${v.name}` : `Pin ${v.name}`}
                          >
                            {v.pinned ? 'Unpin' : 'Pin'}
                          </button>
                        )}
                        {onRename && (
                          <button
                            type="button"
                            className="cc-saved-views__action"
                            onClick={(e) => { e.stopPropagation(); onRename(v.id); setOpen(false); }}
                            aria-label={`Rename ${v.name}`}
                          >
                            Rename
                          </button>
                        )}
                        {onRemove && (
                          <button
                            type="button"
                            className="cc-saved-views__action cc-saved-views__action--danger"
                            onClick={(e) => { e.stopPropagation(); onRemove(v.id); }}
                            aria-label={`Remove ${v.name}`}
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {onSaveCurrent && (
            <div className="cc-saved-views__footer">
              <button
                type="button"
                role="menuitem"
                className="cc-saved-views__save"
                onClick={() => { onSaveCurrent(); setOpen(false); }}
              >
                + Save current as…
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
