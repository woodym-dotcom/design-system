import * as React from 'react';

export type ModuleShellTabId = 'review' | 'monitoring' | 'list' | 'configurations';

export interface ModuleShellTab {
  id: ModuleShellTabId;
  label: string;
  render: () => React.ReactNode;
}

export interface ModuleShellProps {
  title: string;
  actions?: React.ReactNode;
  /**
   * Tabs to render. Each tab is individually optional; omit by leaving its
   * prop undefined. At least one tab must be supplied.
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
   * Default: `list` (falls back to first available tab if `list` is omitted).
   */
  defaultTab?: ModuleShellTabId;
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
  actions,
  review,
  monitoring,
  list,
  configurations,
  searchParamName = 'tab',
  defaultTab = 'list',
  className,
}: ModuleShellProps) {
  const tabs: ModuleShellTab[] = React.useMemo(() => {
    const ordered: Array<[ModuleShellTabId, Omit<ModuleShellTab, 'id'> | undefined]> = [
      ['review', review],
      ['monitoring', monitoring],
      ['list', list],
      ['configurations', configurations],
    ];
    return ordered
      .filter((entry): entry is [ModuleShellTabId, Omit<ModuleShellTab, 'id'>] => entry[1] !== undefined)
      .map(([id, tab]) => ({ id, label: tab.label || DEFAULT_LABELS[id], render: tab.render }));
  }, [review, monitoring, list, configurations]);

  const fallback: ModuleShellTabId | undefined = tabs.find((tab) => tab.id === defaultTab)?.id ?? tabs[0]?.id;

  const [activeId, setActiveId] = React.useState<ModuleShellTabId | undefined>(() => {
    const fromUrl = readTabFromUrl(searchParamName) as ModuleShellTabId | null;
    if (fromUrl && tabs.some((tab) => tab.id === fromUrl)) return fromUrl;
    return fallback;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => {
      const fromUrl = readTabFromUrl(searchParamName) as ModuleShellTabId | null;
      if (fromUrl && tabs.some((tab) => tab.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallback);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [searchParamName, tabs, fallback]);

  React.useEffect(() => {
    if (activeId && !tabs.some((tab) => tab.id === activeId)) setActiveId(fallback);
  }, [tabs, activeId, fallback]);

  const handleSelect = (id: ModuleShellTabId) => {
    setActiveId(id);
    writeTabToUrl(searchParamName, id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeId) return;
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
    if (currentIndex === -1) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleSelect(tabs[(currentIndex + 1) % tabs.length].id);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handleSelect(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id);
    } else if (event.key === 'Home') {
      event.preventDefault();
      handleSelect(tabs[0].id);
    } else if (event.key === 'End') {
      event.preventDefault();
      handleSelect(tabs[tabs.length - 1].id);
    }
  };

  const active = tabs.find((tab) => tab.id === activeId);
  const classes = ['cc-module-shell'];
  if (className) classes.push(className);

  return (
    <section className={classes.join(' ')}>
      <header className="cc-module-shell__header">
        <h1 className="cc-module-shell__title">{title}</h1>
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
                type="button"
                role="tab"
                id={`cc-module-shell-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`cc-module-shell-panel-${tab.id}`}
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
          id={`cc-module-shell-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`cc-module-shell-tab-${active.id}`}
          className="cc-module-shell__panel"
        >
          {active.render()}
        </div>
      ) : null}
    </section>
  );
}
