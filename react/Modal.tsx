import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './a11y/useFocusTrap';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'auto';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog (also rendered as the visual title). */
  title: React.ReactNode;
  /** Optional supporting text below the title. */
  description?: React.ReactNode;
  /** Footer slot — typically primary + secondary buttons. */
  footer?: React.ReactNode;
  /** Body content. */
  children: React.ReactNode;
  /** Visual size, mapped to max-width. Default 'md'. */
  size?: ModalSize;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdropClick?: boolean;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  className?: string;
  /**
   * Optional override of the element to focus on open. Defaults to the
   * first focusable child in the dialog.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Generic centred modal dialog. Owns focus trap, ESC, backdrop click,
 * ARIA dialog semantics, and portal mounting. Compose primary content
 * freely as children — Modal does not impose a section layout.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  initialFocusRef,
}: ModalProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({
    active: open,
    initialFocus: initialFocusRef,
  });
  const titleId = React.useId();
  const descId = React.useId();

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

  // Lock body scroll while open.
  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const dialog = (
    <div className="cc-modal-root" data-modal-open="true">
      <div
        className="cc-modal__backdrop"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={['cc-modal', `cc-modal--${size}`, className].filter(Boolean).join(' ')}
      >
        <header className="cc-modal__header">
          <h2 id={titleId} className="cc-modal__title">{title}</h2>
          <button
            type="button"
            className="cc-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </header>
        {description && (
          <p id={descId} className="cc-modal__description">{description}</p>
        )}
        <div className="cc-modal__body">{children}</div>
        {footer && <footer className="cc-modal__footer">{footer}</footer>}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return dialog;
  return createPortal(dialog, document.body);
}
