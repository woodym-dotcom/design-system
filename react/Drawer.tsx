import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './a11y/useFocusTrap';

export type DrawerSide = 'right' | 'left' | 'bottom' | 'top';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name + visible title. */
  title: React.ReactNode;
  /** Optional subtitle row. */
  subtitle?: React.ReactNode;
  /** Optional footer (e.g. action buttons). */
  footer?: React.ReactNode;
  /** Body content. */
  children: React.ReactNode;
  /** Edge the drawer enters from. Default 'right'. */
  side?: DrawerSide;
  /** Visual size (max width for left/right, max height for top/bottom). */
  size?: DrawerSize;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdropClick?: boolean;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  className?: string;
}

/**
 * Generic slide-in drawer. Distinct from `DetailPane` (which is a record
 * detail surface with a fixed section list) — use Drawer when you need
 * a side panel that hosts arbitrary content (filters, settings, wizards).
 *
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="drawer-right">`
 *   or `<Overlay placement="drawer-left">` instead. Removed at v1.0
 *   (DS-SIMPLIFY 14).
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  side = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: DrawerProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open });
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, closeOnEscape]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const drawer = (
    <div className="cc-drawer-root" data-drawer-side={side}>
      <div
        className="cc-drawer__backdrop is-open"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          'cc-drawer',
          `cc-drawer--${side}`,
          `cc-drawer--size-${size}`,
          'is-open',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <header className="cc-drawer__header">
          <div>
            <h2 id={titleId} className="cc-drawer__title">{title}</h2>
            {subtitle && <p className="cc-drawer__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="cc-drawer__close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ×
          </button>
        </header>
        <div className="cc-drawer__body">{children}</div>
        {footer && <div className="cc-drawer__footer">{footer}</div>}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return drawer;
  return createPortal(drawer, document.body);
}
