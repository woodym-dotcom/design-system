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
  /** Optional subtitle rendered below the title in the header. */
  subtitle?: string;
  /**
   * When provided, enables drag-to-resize on the left edge and persists the
   * user-chosen width to `localStorage[ds-detailpane-width-${resizeKey}]`.
   */
  resizeKey?: string;
  /**
   * Controlled fullscreen state. When omitted, fullscreen is managed
   * internally. Use together with `onFullscreenChange` for controlled usage.
   */
  fullscreen?: boolean;
  /** Called when the fullscreen state toggles. */
  onFullscreenChange?: (fs: boolean) => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable=true]';

const MIN_WIDTH = 320;
const MAX_WIDTH_VW = 95;
const STORAGE_PREFIX = 'ds-detailpane-width-';
const DEFAULT_WIDTH = 480;

function clampWidth(px: number): number {
  if (typeof window === 'undefined') return Math.max(MIN_WIDTH, px);
  const max = Math.floor((window.innerWidth * MAX_WIDTH_VW) / 100);
  return Math.min(Math.max(MIN_WIDTH, Math.round(px)), max);
}

function readStoredWidth(key: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    const n = parseInt(stored, 10);
    return Number.isFinite(n) ? clampWidth(n) : fallback;
  } catch {
    return fallback;
  }
}

export function DetailPane({
  open,
  onClose,
  title,
  sections,
  className,
  subtitle,
  resizeKey,
  fullscreen: fullscreenProp,
  onFullscreenChange,
}: DetailPaneProps) {
  const paneRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  // Fullscreen — controlled if `fullscreen` prop provided, otherwise internal.
  const isControlled = fullscreenProp !== undefined;
  const [internalFullscreen, setInternalFullscreen] = React.useState(false);
  const fullscreen = isControlled ? fullscreenProp : internalFullscreen;

  const toggleFullscreen = React.useCallback(() => {
    const next = !fullscreen;
    if (!isControlled) setInternalFullscreen(next);
    onFullscreenChange?.(next);
  }, [fullscreen, isControlled, onFullscreenChange]);

  // Resize state — only active when resizeKey provided.
  const storageKey = resizeKey ? `${STORAGE_PREFIX}${resizeKey}` : null;
  const [panelWidth, setPanelWidth] = React.useState<number>(() =>
    storageKey ? readStoredWidth(storageKey, DEFAULT_WIDTH) : DEFAULT_WIDTH,
  );
  const [resizing, setResizing] = React.useState(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(0);
  // Mirrors `panelWidth` so the resize-end handler can read the latest value
  // without forcing the effect (and its pointer listeners) to re-attach on
  // every pointermove.
  const panelWidthRef = React.useRef(panelWidth);
  React.useEffect(() => {
    panelWidthRef.current = panelWidth;
  }, [panelWidth]);

  const beginResize = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      startWidthRef.current = panelWidth;
      setResizing(true);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer capture is best-effort */
      }
    },
    [panelWidth],
  );

  React.useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      const dx = startXRef.current - e.clientX;
      setPanelWidth(clampWidth(startWidthRef.current + dx));
    };
    const onUp = () => {
      setResizing(false);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, String(panelWidthRef.current));
        } catch {
          /* localStorage may be unavailable (private mode); ignore. */
        }
      }
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [resizing, storageKey]);

  // Focus management.
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

  // Keyboard: Escape exits fullscreen first, then closes on second press.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (fullscreen) {
          if (!isControlled) setInternalFullscreen(false);
          onFullscreenChange?.(false);
          return;
        }
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const node = paneRef.current;
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
  }, [open, onClose, fullscreen, isControlled, onFullscreenChange]);

  const classes = ['cc-detail-pane'];
  if (open) classes.push('is-open');
  if (fullscreen) classes.push('cc-detail-pane--fullscreen');
  if (className) classes.push(className);

  const widthStyle =
    resizeKey && !fullscreen
      ? { width: panelWidth, maxWidth: `${MAX_WIDTH_VW}vw` }
      : undefined;

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
        aria-labelledby={titleId}
        aria-hidden={!open}
        tabIndex={-1}
        className={classes.join(' ')}
        style={widthStyle}
      >
        {/* Drag-resize handle — only when resizeKey provided and not fullscreen */}
        {resizeKey && !fullscreen && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
            onPointerDown={beginResize}
            className={`cc-detail-pane__resize-handle${resizing ? ' is-resizing' : ''}`}
          />
        )}

        <header className="cc-detail-pane__header">
          <div className="cc-detail-pane__header-title">
            <h2 id={titleId} className="cc-detail-pane__title">
              {title}
            </h2>
            {subtitle && (
              <p className="cc-detail-pane__subtitle">{subtitle}</p>
            )}
          </div>
          <div className="cc-detail-pane__header-actions">
            <button
              type="button"
              className="cc-detail-pane__fullscreen-toggle"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen panel'}
              aria-pressed={fullscreen}
            >
              {fullscreen ? 'Minimize' : 'Maximize'}
            </button>
            <button
              type="button"
              className="cc-detail-pane__close"
              onClick={onClose}
              aria-label="Close panel"
            >
              Close
            </button>
          </div>
        </header>
        <div className="cc-detail-pane__body">
          {sections.map((section, index) => (
            <section key={index} className="cc-detail-pane__section">
              <h3 className="cc-detail-pane__section-heading">
                {section.heading}
              </h3>
              <div className="cc-detail-pane__section-content">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
