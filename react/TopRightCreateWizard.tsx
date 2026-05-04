/**
 * <TopRightCreateWizard> — top-right Create button that opens a wizard modal/drawer.
 *
 * §14 L2: composes CreateMenu (trigger) + CreationWizard (the stepped form)
 * from the existing DS exports. Does NOT re-implement either primitive.
 *
 * Two variants:
 *  - 'manual'  — standard form flow via CreationWizard steps.
 *  - 'ai'      — placeholder panel; actual AI implementation lands in Phase 6.1.
 *               The placeholder renders a coming-soon message so the UI slot is
 *               reserved without any provider SDK calls (workspace rule §18).
 *
 * The wizard opens in a modal overlay (cc-modal + cc-scrim) so it
 * sits above the page content without a URL change.
 *
 * Accessibility:
 *  - Modal uses role="dialog" aria-modal aria-labelledby.
 *  - Focus trapped within modal; Escape closes.
 *  - Trigger button has aria-haspopup="dialog".
 */
import * as React from 'react';
import { CreationWizard, type CreationWizardProps } from './CreationWizard';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TopRightCreateWizardVariant = 'manual' | 'ai';

export interface TopRightCreateWizardProps<TValues> {
  /**
   * Variant. 'manual' uses the full wizard flow; 'ai' shows a Phase-6.1
   * placeholder panel.
   */
  variant?: TopRightCreateWizardVariant;
  /** Label for the trigger button. Default: "Create". */
  triggerLabel?: string;
  /** Title shown in the modal header. */
  modalTitle: string;
  /** Props forwarded to <CreationWizard> (manual variant only). */
  wizard: Omit<CreationWizardProps<TValues>, 'className'>;
  /** Called after the wizard submits and the modal closes. */
  onComplete?: () => void;
  /** Extra class for the trigger button. */
  className?: string;
}

// ── Focus trap helpers ────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex="0"]',
  '[contenteditable=true]',
].join(', ');

// ── AI placeholder ────────────────────────────────────────────────────────────

function AiVariantPlaceholder() {
  return (
    <div className="cc-create-wizard-modal__ai-placeholder">
      <p className="cc-create-wizard-modal__ai-placeholder-label">
        AI-assisted creation lands in Phase 6.1.
      </p>
      <p className="cc-text-muted" style={{ fontSize: 'var(--text-sm)' }}>
        This slot is reserved. The AI flow will be wired to an AA Orchestrator process
        and will not import any provider SDK directly.
      </p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TopRightCreateWizard<TValues>({
  variant = 'manual',
  triggerLabel = 'Create',
  modalTitle,
  wizard,
  onComplete,
  className,
}: TopRightCreateWizardProps<TValues>) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();

  const openModal = () => setOpen(true);
  const closeModal = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Focus first focusable element when modal opens
  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const node = dialogRef.current;
    if (node) {
      const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? node).focus();
    }
  }, [open]);

  // Focus trap + Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const node = dialogRef.current;
      if (!node) return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  const handleSubmit = async (values: TValues) => {
    await wizard.onSubmit(values);
    closeModal();
    onComplete?.();
  };

  const triggerClasses = ['cc-btn', 'cc-btn--primary', 'cc-create-wizard-trigger'];
  if (className) triggerClasses.push(className);

  return (
    <>
      {/* Trigger — always top-right by layout convention; parent positions it */}
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses.join(' ')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openModal}
      >
        {triggerLabel}
      </button>

      {/* Modal overlay */}
      {open ? (
        <>
          <div
            className="cc-scrim"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="cc-modal cc-create-wizard-modal"
          >
            <div className="cc-create-wizard-modal__header">
              <h2
                id={titleId}
                className="cc-create-wizard-modal__title"
              >
                {modalTitle}
              </h2>
              <button
                type="button"
                className="cc-btn cc-btn--ghost cc-btn--sm cc-btn--icon"
                aria-label="Close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            <div className="cc-create-wizard-modal__body">
              {variant === 'ai' ? (
                <AiVariantPlaceholder />
              ) : (
                <CreationWizard
                  {...wizard}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
