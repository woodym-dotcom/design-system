import * as React from 'react';
import { Modal } from './Modal';
import { Kbd } from './Kbd';

export interface CommandItem {
  id: string;
  /** Visible label. */
  label: string;
  /** Optional supporting text rendered to the right of the label. */
  hint?: string;
  /** Group label (e.g. "Navigate", "Actions", "Recent"). */
  group?: string;
  /** Optional icon. */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut hint. */
  shortcut?: string | string[];
  /** Free-text keywords used during fuzzy match. */
  keywords?: string[];
  /** Called when the user selects the item. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  /** Static items to choose from. Either this OR `loadItems` is required. */
  items?: CommandItem[];
  /** Async loader. Called whenever the query changes; should be debounced. */
  loadItems?: (query: string) => CommandItem[] | Promise<CommandItem[]>;
  /** Placeholder shown in the search input. */
  placeholder?: string;
  /** Empty-state copy. */
  emptyMessage?: string;
}

function fuzzyMatch(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const haystacks = [item.label, item.hint, item.group, ...(item.keywords ?? [])]
    .filter(Boolean) as string[];
  return haystacks.some((h) => h.toLowerCase().includes(q));
}

/**
 * Cmd+K-style command palette. Composes `<Modal/>` for the dialog +
 * focus-trap, `<Kbd/>` for shortcut hints, and the platform fuzzy match
 * for filtering. Static items via `items` or async via `loadItems`.
 *
 * The palette does NOT bind a global hotkey — wire that in the host app
 * (typically by listening for `Cmd/Ctrl+K` and flipping `open`).
 */
export function CommandPalette({
  open,
  onClose,
  items,
  loadItems,
  placeholder = 'Search commands…',
  emptyMessage = 'No matches',
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [loaded, setLoaded] = React.useState<CommandItem[]>([]);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIdx(0);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !loadItems) return;
    let cancelled = false;
    Promise.resolve(loadItems(query)).then((next) => {
      if (!cancelled) setLoaded(next);
    });
    return () => {
      cancelled = true;
    };
  }, [open, query, loadItems]);

  const visible = React.useMemo(() => {
    const base = loadItems ? loaded : items ?? [];
    return base.filter((it) => fuzzyMatch(it, query));
  }, [loadItems, loaded, items, query]);

  // Group items in insertion order.
  const grouped = React.useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    visible.forEach((it) => {
      const g = it.group ?? '';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(it);
    });
    return Array.from(groups.entries());
  }, [visible]);

  React.useEffect(() => {
    if (activeIdx >= visible.length) setActiveIdx(Math.max(0, visible.length - 1));
  }, [visible.length, activeIdx]);

  const select = (it: CommandItem) => {
    it.onSelect();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(visible.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = visible[activeIdx];
      if (it) select(it);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Command palette"
      size="lg"
      initialFocusRef={inputRef}
      className="cc-cmdk"
    >
      <input
        ref={inputRef}
        type="search"
        className="cc-cmdk__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIdx(0);
        }}
        onKeyDown={onKeyDown}
        aria-label={placeholder}
        autoComplete="off"
      />
      <div
        role="listbox"
        aria-label="Commands"
        className="cc-cmdk__results"
      >
        {visible.length === 0 ? (
          <p className="cc-cmdk__empty">{emptyMessage}</p>
        ) : (
          grouped.map(([group, list]) => (
            <div key={group || '__'} className="cc-cmdk__group">
              {group && <p className="cc-cmdk__group-label">{group}</p>}
              {list.map((it) => {
                const idx = visible.indexOf(it);
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={it.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`cc-cmdk__item${isActive ? ' is-active' : ''}`}
                    onClick={() => select(it)}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    {it.icon && <span className="cc-cmdk__icon" aria-hidden="true">{it.icon}</span>}
                    <span className="cc-cmdk__label">{it.label}</span>
                    {it.hint && <span className="cc-cmdk__hint">{it.hint}</span>}
                    {it.shortcut && (
                      <span className="cc-cmdk__shortcut">
                        <Kbd keys={it.shortcut} size="sm" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
