/**
 * ConfigurationsPage — two-column layout with section nav + content area.
 * Driven by ?section= URL search param (default: first section).
 */
import * as React from 'react';
import { useModuleShellRouter } from './ModuleShellProvider';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ConfigurationsSection {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

export interface ConfigurationsPageProps {
  sections: ConfigurationsSection[];
  /** URL search-param name for the active section. Default: `section`. */
  searchParamName?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readSectionFromUrl(paramName: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(paramName);
}

function writeSectionToUrl(paramName: string, value: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.history.replaceState(null, '', url.toString());
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ConfigurationsPage({
  sections,
  searchParamName = 'section',
  className,
}: ConfigurationsPageProps) {
  const router = useModuleShellRouter();

  const readParam = React.useCallback((): string | null => {
    if (router) return router.getParam(searchParamName);
    return readSectionFromUrl(searchParamName);
  }, [router, searchParamName]);

  const writeParam = React.useCallback((value: string) => {
    if (router) router.setParam(searchParamName, value);
    else writeSectionToUrl(searchParamName, value);
  }, [router, searchParamName]);

  const fallbackId = sections[0]?.id ?? null;

  const [activeId, setActiveId] = React.useState<string | null>(() => {
    const fromUrl = readParam();
    if (fromUrl && sections.some((s) => s.id === fromUrl)) return fromUrl;
    return fallbackId;
  });

  // Sync on router subscribe
  React.useEffect(() => {
    if (!router) return;
    return router.subscribe(() => {
      const fromUrl = router.getParam(searchParamName);
      if (fromUrl && sections.some((s) => s.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallbackId);
    });
  }, [router, searchParamName, sections, fallbackId]);

  // Fallback: popstate listener when no router adapter
  React.useEffect(() => {
    if (router) return;
    if (typeof window === 'undefined') return;
    const onPop = () => {
      const fromUrl = readSectionFromUrl(searchParamName);
      if (fromUrl && sections.some((s) => s.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallbackId);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [router, searchParamName, sections, fallbackId]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    writeParam(id);
  };

  const active = sections.find((s) => s.id === activeId);
  const classes = ['cc-config-page'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')}>
      <nav className="cc-config-page__nav" aria-label="Configuration sections">
        <ul role="list" className="cc-config-page__nav-list">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  className={`cc-config-page__nav-item${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleSelect(section.id)}
                >
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="cc-config-page__content">
        {active ? active.render() : null}
      </div>
    </div>
  );
}
