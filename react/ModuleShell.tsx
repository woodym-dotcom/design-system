import * as React from 'react';
import { useModuleShellRouter } from './ModuleShellProvider';

export type ModuleShellTabId = 'review' | 'monitoring' | 'list' | 'configurations';

export interface ModuleShellTab {
  id: ModuleShellTabId;
  label: string;
  render: () => React.ReactNode;
}

/**
 * A caller-controlled tab definition for use with the {@link ModuleShellProps.tabs} prop.
 *
 * **Contract:** Supply an ordered array of tabs; the shell renders them in the
 * order given. Set `hidden: true` to suppress a tab without removing it from
 * the array (useful when tab visibility depends on runtime data or role).
 * Omitting `hidden` (or passing `false`) keeps the tab visible.
 *
 * The `id` is any string unique within the shell instance — it is used as the
 * URL `?tab=` value, the ARIA `id` suffix, and the React key. Keep it URL-safe
 * (lowercase, hyphens OK).
 *
 * When `tabs` is provided it takes full precedence over the legacy named props
 * (`review`, `monitoring`, `list`, `configurations`). Do not mix the two forms
 * in a single call-site.
 */
export interface ModuleShellTabDef {
  /** Stable, URL-safe identifier (e.g. `'list'`, `'review-queue'`). */
  id: string;
  /** Human-readable tab label. */
  label: string;
  /**
   * When `true` the tab is removed from the strip and never rendered.
   * Defaults to `false`.
   */
  hidden?: boolean;
  /** Returns the content to render when this tab is active. */
  render: () => React.ReactNode;
}

export interface ModuleShellProps {
  title: string;
  /** Optional icon rendered before the title. */
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * **Preferred API.** Ordered array of tab definitions; the shell renders
   * them in the supplied order. See {@link ModuleShellTabDef} for the full
   * contract.
   *
   * When this prop is supplied the legacy named props (`review`, `monitoring`,
   * `list`, `configurations`) are ignored.
   */
  tabs?: ModuleShellTabDef[];
  /**
   * **Legacy API — named props.** Each tab is individually optional; omit by
   * leaving the prop undefined. Ignored when the `tabs` array prop is present.
   * At least one tab (named or via `tabs`) must be supplied.
   */
  review?: Omit<ModuleShellTab, 'id'>;
  monitoring?: Omit<ModuleShellTab, 'id'>;
  list?: Omit<ModuleShellTab, 'id'>;
  configurations?: Omit<ModuleShellTab, 'id'>;
  /**
   * URL search-param name driving the active tab. Default: `tab`.
   */
  searchParamName?: string;
  /**
   * Default active tab when the URL param is missing or invalid.
   * Default: `list` when using named props; first visible tab when using
   * the `tabs` array prop.
   */
  defaultTab?: string;
  className?: string;
}

const DEFAULT_LABELS: Record<ModuleShellTabId, string> = {
  review: 'Review queue',
  monitoring: 'Monitoring',
  list: 'List',
  configurations: 'Configurations',
};

function readTabFromUrl(paramName: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

function writeTabToUrl(paramName: string, value: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.history.replaceState(null, '', url.toString());
}

export function ModuleShell({
  title,
  icon,
  actions,
  tabs: tabsProp,
  review,
  monitoring,
  list,
  configurations,
  searchParamName = 'tab',
  defaultTab,
  className,
}: ModuleShellProps) {
  const router = useModuleShellRouter();
  const idScope = React.useId();
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // Resolve the effective tab list: caller-controlled array takes precedence.
  const tabs: ModuleShellTab[] = React.useMemo(() => {
    if (tabsProp) {
      return tabsProp
        .filter((t) => !t.hidden)
        .map((t) => ({ id: t.id as ModuleShellTabId, label: t.label, render: t.render }));
    }
    const ordered: Array<[ModuleShellTabId, Omit<ModuleShellTab, 'id'> | undefined]> = [
      ['review', review],
      ['monitoring', monitoring],
      ['list', list],
      ['configurations', configurations],
    ];
    return ordered
      .filter((entry): entry is [ModuleShellTabId, Omit<ModuleShellTab, 'id'>] => entry[1] !== undefined)
      .map(([id, tab]) => ({ id, label: tab.label || DEFAULT_LABELS[id], render: tab.render }));
  }, [tabsProp, review, monitoring, list, configurations]);

  // Default-tab resolution: caller-supplied > 'list' (named-props mode) > first visible tab.
  const resolvedDefaultTab: string =
    defaultTab ??
    (tabsProp ? (tabs[0]?.id ?? 'list') : 'list');

  const fallback: string | undefined = tabs.find((tab) => tab.id === resolvedDefaultTab)?.id ?? tabs[0]?.id;

  const readParam = React.useCallback((): string | null => {
    if (router) return router.getParam(searchParamName);
    return readTabFromUrl(searchParamName);
  }, [router, searchParamName]);

  const writeParam = React.useCallback((value: string) => {
    if (router) router.setParam(searchParamName, value);
    else writeTabToUrl(searchParamName, value);
  }, [router, searchParamName]);

  const [activeId, setActiveId] = React.useState<string | undefined>(() => {
    const fromUrl = readParam();
    if (fromUrl && tabs.some((tab) => tab.id === fromUrl)) return fromUrl;
    return fallback;
  });

  // Sync via router adapter subscribe
  React.useEffect(() => {
    if (!router) return;
    return router.subscribe(() => {
      const fromUrl = router.getParam(searchParamName);
      if (fromUrl && tabs.some((tab) => tab.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallback);
    });
  }, [router, searchParamName, tabs, fallback]);

  // Fallback: popstate when no router adapter
  React.useEffect(() => {
    if (router) return;
    if (typeof window === 'undefined') return;
    const onPop = () => {
      const fromUrl = readTabFromUrl(searchParamName);
      if (fromUrl && tabs.some((tab) => tab.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallback);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [router, searchParamName, tabs, fallback]);

  React.useEffect(() => {
    if (activeId && !tabs.some((tab) => tab.id === activeId)) setActiveId(fallback);
  }, [tabs, activeId, fallback]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    writeParam(id);
  };

  const handleSelectAndFocus = (id: string) => {
    handleSelect(id);
    queueMicrotask(() => tabRefs.current[id]?.focus());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeId) return;
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
    if (currentIndex === -1) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleSelectAndFocus(tabs[(currentIndex + 1) % tabs.length].id as string);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handleSelectAndFocus(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id as string);
    } else if (event.key === 'Home') {
      event.preventDefault();
      handleSelectAndFocus(tabs[0].id as string);
    } else if (event.key === 'End') {
      event.preventDefault();
      handleSelectAndFocus(tabs[tabs.length - 1].id as string);
    }
  };

  const active = tabs.find((tab) => tab.id === activeId);
  const classes = ['cc-module-shell'];
  if (className) classes.push(className);

  return (
    <section className={classes.join(' ')}>
      <header className="cc-module-shell__header">
        <div className="cc-module-shell__title-group">
          {icon ? <span className="cc-module-shell__icon" aria-hidden="true">{icon}</span> : null}
          <h1 className="cc-module-shell__title">{title}</h1>
        </div>
        {actions ? <div className="cc-module-shell__actions">{actions}</div> : null}
      </header>
      {tabs.length > 1 ? (
        <div
          className="cc-tabs cc-module-shell__tabs"
          role="tablist"
          aria-label={`${title} sections`}
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`cc-module-shell-tab-${idScope}-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`cc-module-shell-panel-${idScope}-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`cc-tab${isActive ? ' is-active' : ''}`}
                onClick={() => handleSelect(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {active ? (
        <div
          id={`cc-module-shell-panel-${idScope}-${active.id}`}
          role="tabpanel"
          aria-labelledby={`cc-module-shell-tab-${idScope}-${active.id}`}
          className="cc-module-shell__panel"
        >
          {active.render()}
        </div>
      ) : null}
    </section>
  );
}
