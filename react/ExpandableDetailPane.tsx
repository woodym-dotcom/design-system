/**
 * <ExpandableDetailPane> — right-side detail pane with full-screen toggle
 * and composable tab structure.
 *
 * §14 L2: extends DetailPane (which already exists). Rather than modifying
 * DetailPane (breaking change), this is a superset with tab + full-screen
 * features. Shares FOCUSABLE_SELECTOR logic and CSS primitives.
 *
 * Accessibility:
 *  - role="dialog" with aria-modal, aria-labelledby.
 *  - Focus trap: Tab / Shift+Tab cycle within pane.
 *  - Escape closes pane OR exits full-screen (first press exits full-screen
 *    when in full-screen mode; second press closes pane).
 *  - Tabs use role="tablist" / role="tab" / role="tabpanel" pattern.
 *  - Full-screen toggle button has a meaningful aria-label.
 */
import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExpandableDetailPaneTab {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

export interface ExpandableDetailPaneProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /**
   * Tabs to render inside the pane. At least one required when using tabs mode.
   * When only one tab is provided, the tab bar is hidden and content is shown directly.
   */
  tabs: ExpandableDetailPaneTab[];
  /** Initially active tab id. Defaults to the first tab. */
  defaultTabId?: string;
  /** Subtitle shown below the title. */
  subtitle?: string;
  /** Optional actions (e.g. Edit, Delete buttons) rendered in the header. */
  headerActions?: React.ReactNode;
  /** Whether to allow full-screen expansion. Default true. */
  allowFullScreen?: boolean;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export function ExpandableDetailPane({
  open,
  onClose,
  title,
  tabs,
  defaultTabId,
  subtitle,
  headerActions,
  allowFullScreen = true,
  className,
}: ExpandableDetailPaneProps) {
  const paneRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const tabPanelId = React.useId();

  const [activeTabId, setActiveTabId] = React.useState<string>(
    defaultTabId ?? tabs[0]?.id ?? '',
  );
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Reset full-screen when pane closes
  React.useEffect(() => {
    if (!open) setIsFullScreen(false);
  }, [open]);

  // Focus management on open
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

  // Keyboard: Escape and Tab trap
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
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
  }, [open, onClose, isFullScreen]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const showTabBar = tabs.length > 1;

  const classes = [
    'cc-expandable-pane',
    open ? 'is-open' : '',
    isFullScreen ? 'is-fullscreen' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={`cc-expandable-pane__backdrop${open ? ' is-open' : ''}`}
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
        className={classes}
      >
        <header className="cc-expandable-pane__header">
          <div className="cc-expandable-pane__title-group">
            <h2 id={titleId} className="cc-expandable-pane__title">
              {title}
            </h2>
            {subtitle ? (
              <p className="cc-expandable-pane__subtitle">{subtitle}</p>
            ) : null}
          </div>
          <div className="cc-expandable-pane__header-actions">
            {headerActions ?? null}
            {allowFullScreen ? (
              <button
                type="button"
                className="cc-btn cc-btn--ghost cc-btn--icon cc-btn--sm"
                aria-label={isFullScreen ? 'Exit full screen' : 'Expand to full screen'}
                aria-pressed={isFullScreen}
                onClick={() => setIsFullScreen((v) => !v)}
              >
                {isFullScreen ? '⊡' : '⛶'}
              </button>
            ) : null}
            <button
              type="button"
              className="cc-expandable-pane__close cc-btn cc-btn--ghost cc-btn--sm"
              onClick={onClose}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>
        </header>

        {showTabBar ? (
          <div
            role="tablist"
            aria-label={`${title} sections`}
            className="cc-expandable-pane__tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${tabPanelId}-tab-${tab.id}`}
                aria-selected={tab.id === activeTabId}
                aria-controls={`${tabPanelId}-panel-${tab.id}`}
                tabIndex={tab.id === activeTabId ? 0 : -1}
                className={[
                  'cc-expandable-pane__tab',
                  tab.id === activeTabId ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveTabId(tab.id)}
                onKeyDown={(e) => {
                  const idx = tabs.findIndex((t) => t.id === tab.id);
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    setActiveTabId(tabs[(idx + 1) % tabs.length].id);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setActiveTabId(tabs[(idx - 1 + tabs.length) % tabs.length].id);
                  } else if (e.key === 'Home') {
                    e.preventDefault();
                    setActiveTabId(tabs[0].id);
                  } else if (e.key === 'End') {
                    e.preventDefault();
                    setActiveTabId(tabs[tabs.length - 1].id);
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`${tabPanelId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={showTabBar ? `${tabPanelId}-tab-${tab.id}` : undefined}
            hidden={tab.id !== activeTab?.id}
            className="cc-expandable-pane__body"
          >
            {tab.id === activeTab?.id ? tab.render() : null}
          </div>
        ))}
      </div>
    </>
  );
}
