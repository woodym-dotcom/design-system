/**
 * <CreateMenu> — single create entry-point primitive (G8 / "+" menu pattern).
 *
 * A "+" button that opens a dropdown menu with CreateMenuItem[] sub-actions.
 * Built-in sub-action kinds: manual | ai-generated | from-template | import | custom.
 * Consumers extend with `kind: 'custom'` and a `label`.
 *
 * Accessibility:
 *  - Trigger: role="button", aria-haspopup="menu", aria-expanded.
 *  - Menu: role="menu", aria-label.
 *  - Items: role="menuitem", aria-disabled.
 *  - Keyboard: Escape closes; ArrowDown/ArrowUp navigate items; Enter/Space activate.
 *  - Outside-click closes.
 *  - Focus returns to trigger on close.
 *
 * Composes cc-menu-anchor / cc-menu / cc-menu__item CSS primitives.
 * Does NOT import a DropdownMenu component — one doesn't exist in DS yet;
 * uses the existing cc-menu CSS classes directly (search-before-build §14).
 */
import * as React from 'react';

export type CreateMenuKind =
  | 'manual'
  | 'ai-generated'
  | 'from-template'
  | 'import'
  | 'custom';

export interface CreateMenuItem {
  /** One of the built-in kinds or 'custom'. */
  kind: CreateMenuKind;
  /** Display label. Required for kind='custom'; optional for built-ins (falls back to default label). */
  label?: string;
  /** Called when the item is activated. */
  onSelect: () => void;
  /** When true, item is shown but not interactive. */
  disabled?: boolean;
}

export interface CreateMenuProps {
  /** Sub-actions to show in the dropdown. */
  items: CreateMenuItem[];
  /** Accessible label for the menu. Default: "Create options". */
  menuLabel?: string;
  /** Label / content inside the trigger button. Default: "+". */
  triggerLabel?: React.ReactNode;
  /** Additional class on the root anchor element. */
  className?: string;
}

const DEFAULT_LABELS: Record<Exclude<CreateMenuKind, 'custom'>, string> = {
  manual: 'Create manually',
  'ai-generated': 'Generate with AI',
  'from-template': 'From template',
  import: 'Import',
};

function itemLabel(item: CreateMenuItem): string {
  if (item.label) return item.label;
  if (item.kind === 'custom') return 'Custom';
  return DEFAULT_LABELS[item.kind];
}

export function CreateMenu({
  items,
  menuLabel = 'Create options',
  triggerLabel = '+',
  className,
}: CreateMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      const anchor = triggerRef.current?.parentElement;
      if (anchor && !anchor.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Focus first item when menu opens
  React.useEffect(() => {
    if (open) {
      // Defer one tick so the menu is in the DOM
      const id = setTimeout(() => itemRefs.current[0]?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open]);

  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const activeItems = items.filter((it) => !it.disabled);
    const refs = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const focusedIndex = refs.findIndex((r) => r === document.activeElement);

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusedIndex + 1) % refs.length;
      refs[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (focusedIndex - 1 + refs.length) % refs.length;
      refs[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      refs[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      refs[refs.length - 1]?.focus();
    }
    void activeItems; // suppress unused warning
  };

  const handleItemClick = (item: CreateMenuItem) => {
    if (item.disabled) return;
    close();
    item.onSelect();
  };

  const anchorClasses = ['cc-menu-anchor'];
  if (className) anchorClasses.push(className);

  return (
    <div className={anchorClasses.join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        className="cc-btn cc-btn--primary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? 'cc-create-menu' : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          id="cc-create-menu"
          ref={menuRef}
          role="menu"
          aria-label={menuLabel}
          className="cc-menu"
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={`${item.kind}-${index}`}
              ref={(el) => { itemRefs.current[index] = el; }}
              type="button"
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              className="cc-menu__item"
              onClick={() => handleItemClick(item)}
              tabIndex={-1}
            >
              {itemLabel(item)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
