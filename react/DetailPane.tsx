import * as React from 'react';

export interface DetailPaneSection {
  heading: string;
  content: React.ReactNode;
}

export interface DetailPaneProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sections: DetailPaneSection[];
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable=true]';

export function DetailPane({ open, onClose, title, sections, className }: DetailPaneProps) {
  const paneRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    if (typeof document === 'undefined') return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const node = paneRef.current;
    if (node) {
      const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? node).focus();
    }
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const node = paneRef.current;
      if (!node) return;
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute('disabled'),
      );
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
  }, [open, onClose]);

  const classes = ['cc-detail-pane'];
  if (open) classes.push('is-open');
  if (className) classes.push(className);

  return (
    <>
      <div
        className={`cc-detail-pane__backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={paneRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cc-detail-pane-title"
        aria-hidden={!open}
        tabIndex={-1}
        className={classes.join(' ')}
      >
        <header className="cc-detail-pane__header">
          <h2 id="cc-detail-pane-title" className="cc-detail-pane__title">{title}</h2>
          <button
            type="button"
            className="cc-detail-pane__close"
            onClick={onClose}
            aria-label="Close panel"
          >
            Close
          </button>
        </header>
        <div className="cc-detail-pane__body">
          {sections.map((section, index) => (
            <section key={index} className="cc-detail-pane__section">
              <h3 className="cc-detail-pane__section-heading">{section.heading}</h3>
              <div className="cc-detail-pane__section-content">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
