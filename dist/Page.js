import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { Breadcrumbs } from "./Breadcrumbs.js";
import { ConfigurationsPage } from "./ConfigurationsPage.js";
import { EmptyState } from "./EmptyState.js";
import { Graph } from "./Graph.js";
import { HomepageCards } from "./HomepageCards.js";
import { ListPage } from "./ListPage.js";
import { Overlay } from "./Overlay.js";
import { ReviewQueue } from "./ReviewQueue.js";
import { useModuleShellRouter } from "./ModuleShellProvider.js";
// ── URL helpers (mirrors ModuleShell so we don't take a dependency on it) ────
function readParamFromUrl(name) {
    if (typeof window === "undefined")
        return null;
    return new URLSearchParams(window.location.search).get(name);
}
function writeParamToUrl(name, value) {
    if (typeof window === "undefined")
        return;
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState(null, "", url.toString());
}
// ── Header ────────────────────────────────────────────────────────────────────
function Header({ header }) {
    const { title, subtitle, breadcrumbs, actions, backHref } = header;
    return (_jsxs("header", { className: "cc-page__header", children: [(backHref || (breadcrumbs && breadcrumbs.length > 0)) && (_jsxs("div", { className: "cc-page__header-nav", children: [backHref ? (_jsx("a", { className: "cc-page__back", href: backHref, children: "\u2190 Back" })) : null, breadcrumbs && breadcrumbs.length > 0 ? (_jsx(Breadcrumbs, { items: breadcrumbs })) : null] })), _jsxs("div", { className: "cc-page__header-row", children: [_jsxs("div", { className: "cc-page__header-text", children: [_jsx("h1", { className: "cc-page__title", children: title }), subtitle ? (_jsx("p", { className: "cc-page__subtitle", children: subtitle })) : null] }), actions ? (_jsx("div", { className: "cc-page__header-actions", children: actions })) : null] })] }));
}
function TabsRegion({ tabs, searchParamName, ariaLabel, fallback }) {
    const router = useModuleShellRouter();
    const idScope = React.useId();
    const tabRefs = React.useRef({});
    const visible = React.useMemo(() => tabs.filter((t) => !t.hidden), [tabs]);
    const readParam = React.useCallback(() => {
        if (router)
            return router.getParam(searchParamName);
        return readParamFromUrl(searchParamName);
    }, [router, searchParamName]);
    const writeParam = React.useCallback((value) => {
        if (router)
            router.setParam(searchParamName, value);
        else
            writeParamToUrl(searchParamName, value);
    }, [router, searchParamName]);
    const fallbackId = visible[0]?.id;
    const [activeId, setActiveId] = React.useState(() => {
        const fromUrl = readParam();
        if (fromUrl && visible.some((t) => t.id === fromUrl))
            return fromUrl;
        return fallbackId;
    });
    React.useEffect(() => {
        if (!router)
            return;
        return router.subscribe(() => {
            const fromUrl = router.getParam(searchParamName);
            if (fromUrl && visible.some((t) => t.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallbackId);
        });
    }, [router, searchParamName, visible, fallbackId]);
    React.useEffect(() => {
        if (router)
            return;
        if (typeof window === "undefined")
            return;
        const onPop = () => {
            const fromUrl = readParamFromUrl(searchParamName);
            if (fromUrl && visible.some((t) => t.id === fromUrl))
                setActiveId(fromUrl);
            else
                setActiveId(fallbackId);
        };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, [router, searchParamName, visible, fallbackId]);
    React.useEffect(() => {
        if (activeId && !visible.some((t) => t.id === activeId))
            setActiveId(fallbackId);
    }, [visible, activeId, fallbackId]);
    const handleSelect = (id) => {
        setActiveId(id);
        writeParam(id);
    };
    const handleSelectAndFocus = (id) => {
        handleSelect(id);
        queueMicrotask(() => tabRefs.current[id]?.focus());
    };
    const handleKeyDown = (event) => {
        if (!activeId)
            return;
        const idx = visible.findIndex((t) => t.id === activeId);
        if (idx === -1)
            return;
        if (event.key === "ArrowRight") {
            event.preventDefault();
            handleSelectAndFocus(visible[(idx + 1) % visible.length].id);
        }
        else if (event.key === "ArrowLeft") {
            event.preventDefault();
            handleSelectAndFocus(visible[(idx - 1 + visible.length) % visible.length].id);
        }
        else if (event.key === "Home") {
            event.preventDefault();
            handleSelectAndFocus(visible[0].id);
        }
        else if (event.key === "End") {
            event.preventDefault();
            handleSelectAndFocus(visible[visible.length - 1].id);
        }
    };
    const active = visible.find((t) => t.id === activeId);
    if (visible.length === 0)
        return _jsx(_Fragment, { children: fallback ?? null });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "cc-tabs cc-page__tabs", role: "tablist", "aria-label": ariaLabel, onKeyDown: handleKeyDown, children: visible.map((tab) => {
                    const isActive = tab.id === activeId;
                    const tabId = `cc-page-tab-${idScope}-${tab.id}`;
                    const panelId = `cc-page-panel-${idScope}-${tab.id}`;
                    const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: "cc-tab__label", children: tab.label }), typeof tab.count === "number" ? (_jsx("span", { className: "cc-tab__count", "aria-hidden": "true", children: tab.count })) : null] }));
                    if (tab.href) {
                        // Anchor mode — still toggles state but follows href on click for SSR/router caller.
                        return (_jsx("a", { ref: (el) => {
                                tabRefs.current[tab.id] = el;
                            }, role: "tab", id: tabId, href: tab.href, "aria-selected": isActive, "aria-controls": panelId, tabIndex: isActive ? 0 : -1, className: `cc-tab${isActive ? " is-active" : ""}`, onClick: (e) => {
                                // Allow modifier-clicks to follow the link; otherwise update state.
                                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
                                    return;
                                e.preventDefault();
                                handleSelect(tab.id);
                            }, children: content }, tab.id));
                    }
                    return (_jsx("button", { ref: (el) => {
                            tabRefs.current[tab.id] = el;
                        }, type: "button", role: "tab", id: tabId, "aria-selected": isActive, "aria-controls": panelId, tabIndex: isActive ? 0 : -1, className: `cc-tab${isActive ? " is-active" : ""}`, onClick: () => handleSelect(tab.id), children: content }, tab.id));
                }) }), active ? (_jsx("div", { id: `cc-page-panel-${idScope}-${active.id}`, role: "tabpanel", "aria-labelledby": `cc-page-tab-${idScope}-${active.id}`, className: "cc-page__panel", children: active.content })) : (fallback ?? null)] }));
}
// ── Variant: list ─────────────────────────────────────────────────────────────
function ListBody(props) {
    const { filters, rows, columns, selectable = "none", selectedIds, onSelectionChange, bulkActions, sort, onSortChange, pagination, detail, search, urlState, permissions, onRowClick, loading, error, emptyState, } = props;
    // Bulk + selection bridging — ListPage exposes a single `bulk` slot.
    const bulkSlot = selectable === "multi" && onSelectionChange && bulkActions
        ? {
            selectedIds: selectedIds ?? [],
            onChange: onSelectionChange,
            actions: bulkActions,
        }
        : undefined;
    // ListPage already handles the table + filters + detail. We compose it
    // *without* its built-in heading — Page's <Header /> is canonical.
    return (_jsx(ListPage, { heading: "", filters: filters, list: {
            columns,
            rows,
            loading,
            error,
            sort,
            onSortChange,
            pagination,
            onRowClick,
            emptyState,
        }, detail: detail
            ? {
                selectedId: detail.open ? detail.open.id : null,
                onClose: () => {
                    /* Host owns close: setting `detail.open = null` re-renders. */
                },
                render: (id) => {
                    const row = rows.find((r) => r.id === id);
                    if (!row)
                        return null;
                    const overlayProps = detail.render(row);
                    return _jsx(Overlay, { ...overlayProps });
                },
            }
            : undefined, bulk: bulkSlot, urlState: urlState, permissions: permissions, search: search }));
}
// ── Variant: config ──────────────────────────────────────────────────────────
function ConfigBody(props) {
    const { sections, searchParamName, emptyState } = props;
    if (sections.length === 0) {
        return (_jsx("div", { className: "cc-page__body cc-page__body--config", children: emptyState ?? _jsx(EmptyState, { title: "No configuration sections", variant: "empty" }) }));
    }
    return (_jsx("div", { className: "cc-page__body cc-page__body--config", children: _jsx(ConfigurationsPage, { sections: sections, searchParamName: searchParamName }) }));
}
// ── Variant: monitor ─────────────────────────────────────────────────────────
function KpiCard({ kpi }) {
    if (kpi.graph) {
        const graphProps = {
            ariaLabel: `${kpi.label} trend`,
            ...kpi.graph,
        };
        return (_jsxs("div", { className: "cc-kpi-tile cc-kpi-tile--graph", role: "group", "aria-label": kpi.label, children: [_jsx("p", { className: "cc-kpi-tile__label", children: kpi.label }), _jsx("div", { className: "cc-kpi-tile__value", children: kpi.value }), kpi.delta !== undefined ? (_jsx("div", { className: "cc-kpi-tile__delta", children: kpi.delta })) : null, _jsx("div", { className: "cc-kpi-tile__graph", children: _jsx(Graph, { ...graphProps }) })] }));
    }
    return (_jsxs("div", { className: "cc-kpi-tile", role: "group", "aria-label": kpi.label, children: [_jsx("p", { className: "cc-kpi-tile__label", children: kpi.label }), _jsx("div", { className: "cc-kpi-tile__value", children: kpi.value }), kpi.delta !== undefined ? (_jsx("div", { className: "cc-kpi-tile__delta", children: kpi.delta })) : null] }));
}
function ChartCard({ card }) {
    return (_jsxs("section", { className: "cc-page__chart-card", children: [_jsxs("header", { className: "cc-page__chart-card-head", children: [_jsx("h3", { className: "cc-page__chart-card-heading", children: card.heading }), card.subtitle ? (_jsx("p", { className: "cc-page__chart-card-subtitle", children: card.subtitle })) : null] }), _jsxs("div", { className: "cc-page__chart-card-body", children: [card.graph ? _jsx(Graph, { ...card.graph }) : null, card.render ? card.render() : null] })] }));
}
function MonitorBody(props) {
    const { kpis = [], chartCards = [], emptyState } = props;
    const hasContent = kpis.length > 0 || chartCards.length > 0;
    if (!hasContent) {
        return (_jsx("div", { className: "cc-page__body cc-page__body--monitor", children: emptyState ?? _jsx(EmptyState, { title: "No monitoring data", variant: "empty" }) }));
    }
    return (_jsxs("div", { className: "cc-page__body cc-page__body--monitor", children: [kpis.length > 0 ? (_jsx("div", { className: "cc-page__kpi-row", children: kpis.map((kpi) => (_jsx(KpiCard, { kpi: kpi }, kpi.id))) })) : null, chartCards.length > 0 ? (_jsx("div", { className: "cc-page__chart-grid", children: chartCards.map((card) => (_jsx(ChartCard, { card: card }, card.id))) })) : null] }));
}
// ── Variant: review ──────────────────────────────────────────────────────────
function ReviewBody(props) {
    const { items, reviewActions, onApprove, onReject, onEscalate, loading, emptyState } = props;
    // ReviewQueue requires title:string but we accept ReactNode. Coerce when string.
    const queueItems = items.map((it) => ({
        id: it.id,
        title: typeof it.title === "string" ? it.title : String(it.title),
        meta: typeof it.meta === "string" ? it.meta : it.meta ? String(it.meta) : undefined,
        data: it.data,
    }));
    return (_jsx("div", { className: "cc-page__body cc-page__body--review", children: _jsx(ReviewQueue, { items: queueItems, onApprove: (qi) => {
                const original = items.find((it) => it.id === qi.id);
                if (original && onApprove)
                    onApprove(original);
            }, onReject: (qi) => {
                const original = items.find((it) => it.id === qi.id);
                if (original && onReject)
                    onReject(original);
            }, onEscalate: onEscalate
                ? (qi) => {
                    const original = items.find((it) => it.id === qi.id);
                    if (original)
                        onEscalate(original);
                }
                : undefined, customActions: reviewActions?.map((a) => ({
                label: a.label,
                onAction: (qi) => {
                    const original = items.find((it) => it.id === qi.id);
                    if (original)
                        a.onAction(original);
                },
                isDisabled: a.isDisabled
                    ? (qi) => {
                        const original = items.find((it) => it.id === qi.id);
                        return original ? a.isDisabled(original) : true;
                    }
                    : undefined,
            })), isLoading: loading, emptyState: emptyState }) }));
}
// ── Variant: detail ──────────────────────────────────────────────────────────
function DetailBody(props) {
    return (_jsx("div", { className: "cc-page__body cc-page__body--detail", children: props.children ?? props.emptyState ?? null }));
}
// ── Variant: auth ────────────────────────────────────────────────────────────
function AuthBody(props) {
    const { authForm, authBrand, authError, authFooter } = props;
    return (_jsx("div", { className: "cc-page__body cc-page__body--auth", "data-brand": authBrand, children: _jsxs("div", { className: "cc-page__auth-card", children: [authError ? (_jsx("div", { className: "cc-page__auth-error", role: "alert", children: authError })) : null, _jsx("div", { className: "cc-page__auth-form", children: authForm }), authFooter ? (_jsx("div", { className: "cc-page__auth-footer", children: authFooter })) : null] }) }));
}
// ── Variant: home ────────────────────────────────────────────────────────────
function HomeBody(props) {
    const { homepageCards, viewerRoles, columns = 3, loading } = props;
    return (_jsx("div", { className: "cc-page__body cc-page__body--home", children: _jsx(HomepageCards, { viewerRoles: viewerRoles, cards: homepageCards, loading: loading, columns: columns }) }));
}
// ── Variant: workbench ───────────────────────────────────────────────────────
function WorkbenchBody(props) {
    const { children, rail, emptyState } = props;
    const body = children ?? emptyState ?? null;
    return (_jsxs("div", { className: "cc-page__body cc-page__body--workbench", children: [_jsx("div", { className: "cc-page__workbench-primary", children: body }), rail ? _jsx("aside", { className: "cc-page__workbench-rail", children: rail }) : null] }));
}
// ── Variant: studio ──────────────────────────────────────────────────────────
function StudioBody(props) {
    const { children, preview, emptyState } = props;
    const body = children ?? emptyState ?? null;
    return (_jsxs("div", { className: "cc-page__body cc-page__body--studio", children: [_jsx("div", { className: "cc-page__studio-author", children: body }), preview ? _jsx("aside", { className: "cc-page__studio-preview", children: preview }) : null] }));
}
// ── Variant: console ─────────────────────────────────────────────────────────
function ConsoleBody(props) {
    return (_jsx("div", { className: "cc-page__body cc-page__body--console", children: props.children ?? props.emptyState ?? null }));
}
// ── Variant: inspector ───────────────────────────────────────────────────────
function InspectorBody(props) {
    return (_jsx("div", { className: "cc-page__body cc-page__body--inspector", children: props.children ?? props.emptyState ?? null }));
}
// ── Variant: dashboard ───────────────────────────────────────────────────────
function DashboardBody(props) {
    return (_jsx("div", { className: "cc-page__body cc-page__body--dashboard", children: props.children ?? props.emptyState ?? null }));
}
// ── Variant body router ──────────────────────────────────────────────────────
function VariantBody(props) {
    if (props.error) {
        return (_jsx("div", { className: "cc-page__error", role: "alert", children: props.error }));
    }
    switch (props.variant) {
        case "list":
            return _jsx(ListBody, { ...props });
        case "config":
            return _jsx(ConfigBody, { ...props });
        case "monitor":
            return _jsx(MonitorBody, { ...props });
        case "review":
            return _jsx(ReviewBody, { ...props });
        case "detail":
            return _jsx(DetailBody, { ...props });
        case "auth":
            return _jsx(AuthBody, { ...props });
        case "home":
            return _jsx(HomeBody, { ...props });
        case "workbench":
            return _jsx(WorkbenchBody, { ...props });
        case "studio":
            return _jsx(StudioBody, { ...props });
        case "console":
            return _jsx(ConsoleBody, { ...props });
        case "inspector":
            return _jsx(InspectorBody, { ...props });
        case "dashboard":
            return _jsx(DashboardBody, { ...props });
        default: {
            // Exhaustiveness check
            const _exhaustive = props;
            return _exhaustive;
        }
    }
}
// ── Public API ───────────────────────────────────────────────────────────────
/**
 * Page — render any page surface from a single primitive.
 * See `Page.types.ts` for the discriminated-union prop contract.
 */
export function Page(props) {
    const { header, tabs, tabsAriaLabel, tabsSearchParamName = "tab", className, source, } = props;
    const classes = ["cc-page", `cc-page--${props.variant}`];
    if (className)
        classes.push(className);
    const ariaLabelDefault = typeof header.title === "string" ? `${header.title} sections` : "Page sections";
    return (_jsxs("section", { className: classes.join(" "), "data-source-model": source?.model, "data-source-prompt-version": source?.promptVersion, children: [_jsx(Header, { header: header }), tabs && tabs.length > 0 ? (_jsx(TabsRegion, { tabs: tabs, searchParamName: tabsSearchParamName, ariaLabel: tabsAriaLabel ?? ariaLabelDefault, fallback: _jsx(VariantBody, { ...props }) })) : (_jsx(VariantBody, { ...props }))] }));
}
//# sourceMappingURL=Page.js.map