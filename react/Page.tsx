/**
 * Page — the single page-template primitive.
 *
 * Subsumes:
 *   - ListPage (variant="list")
 *   - ConfigurationsPage (variant="config")
 *   - MonitoringPage (variant="monitor")
 *   - ReviewQueue (variant="review")
 *   - ArtefactDetailPane full-page detail (variant="detail")
 *   - AuthLayout (variant="auth")
 *   - HomepageCards (variant="home")
 *   - ModuleShell — folded into the optional `tabs?` prop
 *
 * Plus operator/authoring surfaces:
 *   - variant="workbench" → focused work surface + optional rail
 *   - variant="studio"    → authoring form + optional preview
 *   - variant="console"   → multi-pane ops surface
 *   - variant="inspector" → read-only structured drill-down
 *   - variant="dashboard" → grid of status cards / health panels
 *
 * One header (title + breadcrumbs + actions), one optional tab strip, one
 * variant body. Variant bodies compose the existing primitives internally
 * so we don't re-implement: ListPage handles `list`, ConfigurationsPage
 * handles `config`, etc.
 */
import * as React from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { ConfigurationsPage } from "./ConfigurationsPage";
import { EmptyState } from "./EmptyState";
import { Graph } from "./Graph";
import { HomepageCards } from "./HomepageCards";
import { ListPage } from "./ListPage";
import { Overlay } from "./Overlay";
import { ReviewQueue } from "./ReviewQueue";
import { useModuleShellRouter } from "./ModuleShellProvider";
import type {
  PageProps,
  PageTab,
  PageHeader,
  ListVariantProps,
  ConfigVariantProps,
  MonitorVariantProps,
  ReviewVariantProps,
  DetailVariantProps,
  AuthVariantProps,
  HomeVariantProps,
  WorkbenchVariantProps,
  StudioVariantProps,
  ConsoleVariantProps,
  InspectorVariantProps,
  DashboardVariantProps,
  ChartCardDef,
  KpiDef,
} from "./Page.types";

export type {
  PageProps,
  PageTab,
  PageHeader,
  PageVariant,
  ListVariantProps,
  ConfigVariantProps,
  MonitorVariantProps,
  ReviewVariantProps,
  DetailVariantProps,
  AuthVariantProps,
  HomeVariantProps,
  WorkbenchVariantProps,
  StudioVariantProps,
  ConsoleVariantProps,
  InspectorVariantProps,
  DashboardVariantProps,
} from "./Page.types";

// ── URL helpers (mirrors ModuleShell so we don't take a dependency on it) ────

function readParamFromUrl(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

function writeParamToUrl(name: string, value: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState(null, "", url.toString());
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ header }: { header: PageHeader }) {
  const { title, subtitle, breadcrumbs, actions, backHref } = header;
  return (
    <header className="cc-page__header">
      {(backHref || (breadcrumbs && breadcrumbs.length > 0)) && (
        <div className="cc-page__header-nav">
          {backHref ? (
            <a className="cc-page__back" href={backHref}>
              ← Back
            </a>
          ) : null}
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumbs items={breadcrumbs} />
          ) : null}
        </div>
      )}
      <div className="cc-page__header-row">
        <div className="cc-page__header-text">
          <h1 className="cc-page__title">{title}</h1>
          {subtitle ? (
            <p className="cc-page__subtitle">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="cc-page__header-actions">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

interface TabsRegionProps {
  tabs: PageTab[];
  searchParamName: string;
  ariaLabel: string;
  /** Rendered when no tab is active (e.g. all hidden). */
  fallback?: React.ReactNode;
}

function TabsRegion({ tabs, searchParamName, ariaLabel, fallback }: TabsRegionProps) {
  const router = useModuleShellRouter();
  const idScope = React.useId();
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const visible = React.useMemo(() => tabs.filter((t) => !t.hidden), [tabs]);

  const readParam = React.useCallback((): string | null => {
    if (router) return router.getParam(searchParamName);
    return readParamFromUrl(searchParamName);
  }, [router, searchParamName]);

  const writeParam = React.useCallback(
    (value: string) => {
      if (router) router.setParam(searchParamName, value);
      else writeParamToUrl(searchParamName, value);
    },
    [router, searchParamName],
  );

  const fallbackId = visible[0]?.id;

  const [activeId, setActiveId] = React.useState<string | undefined>(() => {
    const fromUrl = readParam();
    if (fromUrl && visible.some((t) => t.id === fromUrl)) return fromUrl;
    return fallbackId;
  });

  React.useEffect(() => {
    if (!router) return;
    return router.subscribe(() => {
      const fromUrl = router.getParam(searchParamName);
      if (fromUrl && visible.some((t) => t.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallbackId);
    });
  }, [router, searchParamName, visible, fallbackId]);

  React.useEffect(() => {
    if (router) return;
    if (typeof window === "undefined") return;
    const onPop = () => {
      const fromUrl = readParamFromUrl(searchParamName);
      if (fromUrl && visible.some((t) => t.id === fromUrl)) setActiveId(fromUrl);
      else setActiveId(fallbackId);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [router, searchParamName, visible, fallbackId]);

  React.useEffect(() => {
    if (activeId && !visible.some((t) => t.id === activeId)) setActiveId(fallbackId);
  }, [visible, activeId, fallbackId]);

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
    const idx = visible.findIndex((t) => t.id === activeId);
    if (idx === -1) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleSelectAndFocus(visible[(idx + 1) % visible.length].id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleSelectAndFocus(visible[(idx - 1 + visible.length) % visible.length].id);
    } else if (event.key === "Home") {
      event.preventDefault();
      handleSelectAndFocus(visible[0].id);
    } else if (event.key === "End") {
      event.preventDefault();
      handleSelectAndFocus(visible[visible.length - 1].id);
    }
  };

  const active = visible.find((t) => t.id === activeId);

  if (visible.length === 0) return <>{fallback ?? null}</>;

  return (
    <>
      <div
        className="cc-tabs cc-page__tabs"
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
      >
        {visible.map((tab) => {
          const isActive = tab.id === activeId;
          const tabId = `cc-page-tab-${idScope}-${tab.id}`;
          const panelId = `cc-page-panel-${idScope}-${tab.id}`;
          const content = (
            <>
              <span className="cc-tab__label">{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span className="cc-tab__count" aria-hidden="true">
                  {tab.count}
                </span>
              ) : null}
            </>
          );
          if (tab.href) {
            // Anchor mode — still toggles state but follows href on click for SSR/router caller.
            return (
              <a
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el as unknown as HTMLButtonElement | null;
                }}
                role="tab"
                id={tabId}
                href={tab.href}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                className={`cc-tab${isActive ? " is-active" : ""}`}
                onClick={(e) => {
                  // Allow modifier-clicks to follow the link; otherwise update state.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  handleSelect(tab.id);
                }}
              >
                {content}
              </a>
            );
          }
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={`cc-tab${isActive ? " is-active" : ""}`}
              onClick={() => handleSelect(tab.id)}
            >
              {content}
            </button>
          );
        })}
      </div>
      {active ? (
        <div
          id={`cc-page-panel-${idScope}-${active.id}`}
          role="tabpanel"
          aria-labelledby={`cc-page-tab-${idScope}-${active.id}`}
          className="cc-page__panel"
        >
          {active.content}
        </div>
      ) : (
        fallback ?? null
      )}
    </>
  );
}

// ── Variant: list ─────────────────────────────────────────────────────────────

function ListBody<Row extends { id: string }>(props: ListVariantProps<Row>) {
  const {
    filters,
    rows,
    columns,
    selectable = "none",
    selectedIds,
    onSelectionChange,
    bulkActions,
    sort,
    onSortChange,
    pagination,
    detail,
    search,
    urlState,
    permissions,
    onRowClick,
    loading,
    error,
    emptyState,
  } = props;

  // Bulk + selection bridging — ListPage exposes a single `bulk` slot.
  const bulkSlot =
    selectable === "multi" && onSelectionChange && bulkActions
      ? {
          selectedIds: selectedIds ?? [],
          onChange: onSelectionChange,
          actions: bulkActions,
        }
      : undefined;

  // ListPage already handles the table + filters + detail. We compose it
  // *without* its built-in heading — Page's <Header /> is canonical.
  return (
    <ListPage<Row>
      heading=""
      filters={filters}
      list={{
        columns,
        rows,
        loading,
        error,
        sort,
        onSortChange,
        pagination,
        onRowClick,
        emptyState,
      }}
      detail={
        detail
          ? {
              selectedId: detail.open ? detail.open.id : null,
              onClose: () => {
                /* Host owns close: setting `detail.open = null` re-renders. */
              },
              render: (id) => {
                const row = rows.find((r) => r.id === id);
                if (!row) return null;
                const overlayProps = detail.render(row);
                return <Overlay {...overlayProps} />;
              },
            }
          : undefined
      }
      bulk={bulkSlot}
      urlState={urlState}
      permissions={permissions}
      search={search}
    />
  );
}

// ── Variant: config ──────────────────────────────────────────────────────────

function ConfigBody(props: ConfigVariantProps) {
  const { sections, searchParamName, emptyState } = props;
  if (sections.length === 0) {
    return (
      <div className="cc-page__body cc-page__body--config">
        {emptyState ?? <EmptyState title="No configuration sections" variant="empty" />}
      </div>
    );
  }
  return (
    <div className="cc-page__body cc-page__body--config">
      <ConfigurationsPage sections={sections} searchParamName={searchParamName} />
    </div>
  );
}

// ── Variant: monitor ─────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KpiDef }) {
  if (kpi.graph) {
    const graphProps = {
      ariaLabel: `${kpi.label} trend`,
      ...kpi.graph,
    };
    return (
      <div className="cc-kpi-tile cc-kpi-tile--graph" role="group" aria-label={kpi.label}>
        <p className="cc-kpi-tile__label">{kpi.label}</p>
        <div className="cc-kpi-tile__value">{kpi.value}</div>
        {kpi.delta !== undefined ? (
          <div className="cc-kpi-tile__delta">{kpi.delta}</div>
        ) : null}
        <div className="cc-kpi-tile__graph">
          <Graph {...graphProps} />
        </div>
      </div>
    );
  }
  return (
    <div className="cc-kpi-tile" role="group" aria-label={kpi.label}>
      <p className="cc-kpi-tile__label">{kpi.label}</p>
      <div className="cc-kpi-tile__value">{kpi.value}</div>
      {kpi.delta !== undefined ? (
        <div className="cc-kpi-tile__delta">{kpi.delta}</div>
      ) : null}
    </div>
  );
}

function ChartCard({ card }: { card: ChartCardDef }) {
  return (
    <section className="cc-page__chart-card">
      <header className="cc-page__chart-card-head">
        <h3 className="cc-page__chart-card-heading">{card.heading}</h3>
        {card.subtitle ? (
          <p className="cc-page__chart-card-subtitle">{card.subtitle}</p>
        ) : null}
      </header>
      <div className="cc-page__chart-card-body">
        {card.graph ? <Graph {...card.graph} /> : null}
        {card.render ? card.render() : null}
      </div>
    </section>
  );
}

function MonitorBody(props: MonitorVariantProps) {
  const { kpis = [], chartCards = [], emptyState } = props;
  const hasContent = kpis.length > 0 || chartCards.length > 0;

  if (!hasContent) {
    return (
      <div className="cc-page__body cc-page__body--monitor">
        {emptyState ?? <EmptyState title="No monitoring data" variant="empty" />}
      </div>
    );
  }

  return (
    <div className="cc-page__body cc-page__body--monitor">
      {kpis.length > 0 ? (
        <div className="cc-page__kpi-row">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      ) : null}
      {chartCards.length > 0 ? (
        <div className="cc-page__chart-grid">
          {chartCards.map((card) => (
            <ChartCard key={card.id} card={card} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── Variant: review ──────────────────────────────────────────────────────────

function ReviewBody<Item extends { id: string; title: React.ReactNode; meta?: React.ReactNode }>(
  props: ReviewVariantProps<Item>,
) {
  const { items, reviewActions, onApprove, onReject, onEscalate, loading, emptyState } = props;

  // ReviewQueue requires title:string but we accept ReactNode. Coerce when string.
  const queueItems = items.map((it) => ({
    id: it.id,
    title: typeof it.title === "string" ? it.title : String(it.title),
    meta: typeof it.meta === "string" ? it.meta : it.meta ? String(it.meta) : undefined,
    data: (it as unknown as { data?: Record<string, unknown> }).data,
  }));

  return (
    <div className="cc-page__body cc-page__body--review">
      <ReviewQueue
        items={queueItems}
        onApprove={(qi) => {
          const original = items.find((it) => it.id === qi.id);
          if (original && onApprove) onApprove(original);
        }}
        onReject={(qi) => {
          const original = items.find((it) => it.id === qi.id);
          if (original && onReject) onReject(original);
        }}
        onEscalate={
          onEscalate
            ? (qi) => {
                const original = items.find((it) => it.id === qi.id);
                if (original) onEscalate(original);
              }
            : undefined
        }
        customActions={reviewActions?.map((a) => ({
          label: a.label,
          onAction: (qi) => {
            const original = items.find((it) => it.id === qi.id);
            if (original) a.onAction(original);
          },
          isDisabled: a.isDisabled
            ? (qi) => {
                const original = items.find((it) => it.id === qi.id);
                return original ? a.isDisabled!(original) : true;
              }
            : undefined,
        }))}
        isLoading={loading}
        emptyState={emptyState}
      />
    </div>
  );
}

// ── Variant: detail ──────────────────────────────────────────────────────────

function DetailBody(props: DetailVariantProps) {
  return (
    <div className="cc-page__body cc-page__body--detail">
      {props.children ?? props.emptyState ?? null}
    </div>
  );
}

// ── Variant: auth ────────────────────────────────────────────────────────────

function AuthBody(props: AuthVariantProps) {
  const { authForm, authBrand, authError, authFooter } = props;
  return (
    <div
      className="cc-page__body cc-page__body--auth"
      data-brand={authBrand}
    >
      <div className="cc-page__auth-card">
        {authError ? (
          <div className="cc-page__auth-error" role="alert">
            {authError}
          </div>
        ) : null}
        <div className="cc-page__auth-form">{authForm}</div>
        {authFooter ? (
          <div className="cc-page__auth-footer">{authFooter}</div>
        ) : null}
      </div>
    </div>
  );
}

// ── Variant: home ────────────────────────────────────────────────────────────

function HomeBody(props: HomeVariantProps) {
  const { homepageCards, viewerRoles, columns = 3, loading } = props;
  return (
    <div className="cc-page__body cc-page__body--home">
      <HomepageCards
        viewerRoles={viewerRoles}
        cards={homepageCards}
        loading={loading}
        columns={columns}
      />
    </div>
  );
}

// ── Variant: workbench ───────────────────────────────────────────────────────

function WorkbenchBody(props: WorkbenchVariantProps) {
  const { children, rail, emptyState } = props;
  const body = children ?? emptyState ?? null;
  return (
    <div className="cc-page__body cc-page__body--workbench">
      <div className="cc-page__workbench-primary">{body}</div>
      {rail ? <aside className="cc-page__workbench-rail">{rail}</aside> : null}
    </div>
  );
}

// ── Variant: studio ──────────────────────────────────────────────────────────

function StudioBody(props: StudioVariantProps) {
  const { children, preview, emptyState } = props;
  const body = children ?? emptyState ?? null;
  return (
    <div className="cc-page__body cc-page__body--studio">
      <div className="cc-page__studio-author">{body}</div>
      {preview ? <aside className="cc-page__studio-preview">{preview}</aside> : null}
    </div>
  );
}

// ── Variant: console ─────────────────────────────────────────────────────────

function ConsoleBody(props: ConsoleVariantProps) {
  return (
    <div className="cc-page__body cc-page__body--console">
      {props.children ?? props.emptyState ?? null}
    </div>
  );
}

// ── Variant: inspector ───────────────────────────────────────────────────────

function InspectorBody(props: InspectorVariantProps) {
  return (
    <div className="cc-page__body cc-page__body--inspector">
      {props.children ?? props.emptyState ?? null}
    </div>
  );
}

// ── Variant: dashboard ───────────────────────────────────────────────────────

function DashboardBody(props: DashboardVariantProps) {
  return (
    <div className="cc-page__body cc-page__body--dashboard">
      {props.children ?? props.emptyState ?? null}
    </div>
  );
}

// ── Variant body router ──────────────────────────────────────────────────────

function VariantBody<Row extends { id: string }>(props: PageProps<Row>) {
  if (props.error) {
    return (
      <div className="cc-page__error" role="alert">
        {props.error}
      </div>
    );
  }

  switch (props.variant) {
    case "list":
      return <ListBody<Row> {...(props as ListVariantProps<Row>)} />;
    case "config":
      return <ConfigBody {...props} />;
    case "monitor":
      return <MonitorBody {...props} />;
    case "review":
      return <ReviewBody {...(props as ReviewVariantProps)} />;
    case "detail":
      return <DetailBody {...props} />;
    case "auth":
      return <AuthBody {...props} />;
    case "home":
      return <HomeBody {...props} />;
    case "workbench":
      return <WorkbenchBody {...props} />;
    case "studio":
      return <StudioBody {...props} />;
    case "console":
      return <ConsoleBody {...props} />;
    case "inspector":
      return <InspectorBody {...props} />;
    case "dashboard":
      return <DashboardBody {...props} />;
    default: {
      // Exhaustiveness check
      const _exhaustive: never = props;
      return _exhaustive;
    }
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Page — render any page surface from a single primitive.
 * See `Page.types.ts` for the discriminated-union prop contract.
 */
export function Page<Row extends { id: string } = { id: string }>(
  props: PageProps<Row>,
) {
  const {
    header,
    tabs,
    tabsAriaLabel,
    tabsSearchParamName = "tab",
    className,
    source,
  } = props;

  const classes = ["cc-page", `cc-page--${props.variant}`];
  if (className) classes.push(className);

  const ariaLabelDefault =
    typeof header.title === "string" ? `${header.title} sections` : "Page sections";

  return (
    <section
      className={classes.join(" ")}
      data-source-model={source?.model}
      data-source-prompt-version={source?.promptVersion}
    >
      <Header header={header} />
      {tabs && tabs.length > 0 ? (
        <TabsRegion
          tabs={tabs}
          searchParamName={tabsSearchParamName}
          ariaLabel={tabsAriaLabel ?? ariaLabelDefault}
          fallback={<VariantBody<Row> {...props} />}
        />
      ) : (
        <VariantBody<Row> {...props} />
      )}
    </section>
  );
}
