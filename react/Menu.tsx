/**
 * Menu — anchored popover dropdown.
 *
 * ARIA menu pattern: role="menu" / role="menuitem".
 * Click-outside closes, ESC closes, focus trap on open,
 * returns focus to trigger on close.
 *
 * Positioning uses CSS absolute/fixed positioning relative to trigger.
 * No external dependency required.
 */
import * as React from 'react';
import { useFocusTrap } from './a11y/useFocusTrap';

// ── Types ─────────────────────────────────────────────────────────────────────

export type MenuPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

export interface MenuProps {
  trigger: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: MenuPlacement;
  children: React.ReactNode;
  closeOnSelect?: boolean;
  ariaLabel?: string;
}

export interface MenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export interface MenuSeparatorProps {}

export interface MenuLabelProps {
  children: React.ReactNode;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface MenuContextValue {
  close: () => void;
  closeOnSelect: boolean;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('Menu sub-components must be used inside <Menu>');
  return ctx;
}

// ── Placement helpers ──────────────────────────────────────────────────────────

function getPopoverStyle(
  triggerEl: HTMLElement,
  placement: MenuPlacement,
): React.CSSProperties {
  const rect = triggerEl.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  switch (placement) {
    case 'bottom-end':
      return {
        top: rect.bottom + scrollY + 4,
        left: rect.right + scrollX,
        transform: 'translateX(-100%)',
      };
    case 'bottom-start':
      return {
        top: rect.bottom + scrollY + 4,
        left: rect.left + scrollX,
      };
    case 'top-end':
      return {
        top: rect.top + scrollY - 4,
        left: rect.right + scrollX,
        transform: 'translateX(-100%) translateY(-100%)',
      };
    case 'top-start':
      return {
        top: rect.top + scrollY - 4,
        left: rect.left + scrollX,
        transform: 'translateY(-100%)',
      };
  }
}

// ── Menu ──────────────────────────────────────────────────────────────────────

export function Menu({
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-end',
  children,
  closeOnSelect = true,
  ariaLabel,
}: MenuProps): React.ReactElement {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const menuId = React.useId();
  const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({});

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  // Focus trap
  const trapRef = useFocusTrap<HTMLDivElement>({
    active: open,
    restoreFocus: true,
  });

  // Merge popoverRef and trapRef
  const setPopoverEl = React.useCallback(
    (el: HTMLDivElement | null) => {
      popoverRef.current = el;
      (trapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [trapRef],
  );

  // Recalculate position when opening
  React.useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverStyle(getPopoverStyle(triggerRef.current, placement));
    }
  }, [open, placement]);

  // Click-outside close
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !popoverRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  // ESC close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Clone trigger to attach ref and toggle handler
  const triggerEl = trigger as React.ReactElement<Record<string, unknown>>;
  const clonedTrigger = React.cloneElement(triggerEl, {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      // Forward existing ref if present
      const existingRef = (triggerEl as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof existingRef === 'function') existingRef(el);
      else if (existingRef && typeof existingRef === 'object') {
        (existingRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }
    },
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': menuId,
    onClick: (e: React.MouseEvent) => {
      (triggerEl.props.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setOpen(!open);
    },
  });

  const popoverStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 'var(--z-popover, 1000)' as unknown as number,
    background: 'var(--surface-0)',
    border: '1px solid var(--border-1)',
    borderRadius: '6px',
    boxShadow: 'var(--shadow-2)',
    minWidth: '160px',
    padding: 'var(--space-2) 0',
    ...popoverStyle,
  };

  return (
    <MenuContext.Provider value={{ close, closeOnSelect }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {clonedTrigger}
        {open && (
          <div
            ref={setPopoverEl}
            id={menuId}
            role="menu"
            aria-label={ariaLabel}
            style={popoverStyles}
          >
            {children}
          </div>
        )}
      </span>
    </MenuContext.Provider>
  );
}

// ── MenuItem ──────────────────────────────────────────────────────────────────

export function MenuItem({
  children,
  onSelect,
  href,
  disabled = false,
  destructive = false,
  icon,
}: MenuItemProps): React.ReactElement {
  const { close, closeOnSelect } = useMenuContext();

  const handleActivate = () => {
    if (disabled) return;
    onSelect?.();
    if (closeOnSelect) close();
  };

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: destructive
      ? 'var(--error)'
      : disabled
      ? 'var(--text-4)'
      : 'var(--text-1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    userSelect: 'none',
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        role="menuitem"
        style={style}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleActivate();
        }}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      style={style}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleActivate();
      }}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}

// ── MenuSeparator ─────────────────────────────────────────────────────────────

export function MenuSeparator(_props: MenuSeparatorProps): React.ReactElement {
  return (
    <hr
      role="separator"
      style={{
        border: 'none',
        borderTop: '1px solid var(--border-1)',
        margin: 'var(--space-2) 0',
      }}
    />
  );
}

// ── MenuLabel ─────────────────────────────────────────────────────────────────

export function MenuLabel({ children }: MenuLabelProps): React.ReactElement {
  return (
    <div
      role="presentation"
      style={{
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}
