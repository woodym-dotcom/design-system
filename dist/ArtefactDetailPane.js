import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ArtefactDetailPane — composable detail pane family for artefacts.
 *
 * Composes Overlay (placement="detail-right") + inline tab structure
 * into a single "detail pane for any artefact" abstraction.
 *
 * Accessibility: inherits Overlay a11y contract (dialog, focus trap,
 * keyboard navigation, axe-clean). Individual tab content uses semantic HTML.
 */
import * as React from 'react';
import { Overlay } from './Overlay.js';
import { Tag } from './Tag.js';
function DefinitionView({ definition }) {
    return (_jsxs("section", { className: "cc-detail-definition", "aria-label": "Artefact definition", children: [_jsxs("div", { className: "cc-detail-definition__meta", children: [definition.namespace && (_jsx("span", { className: "cc-detail-definition__namespace", children: definition.namespace })), definition.executionModel && (_jsx(Tag, { variant: "chip", tone: "neutral", className: "cc-detail-definition__execution-model", children: definition.executionModel }))] }), definition.preRules.length > 0 && (_jsxs("div", { className: "cc-detail-definition__section", children: [_jsx("h3", { className: "cc-detail-definition__section-heading", children: "Pre-rules" }), _jsx("ol", { className: "cc-detail-definition__rule-list", children: definition.preRules.map((rule, i) => (_jsx("li", { className: "cc-detail-definition__rule-item", children: rule }, i))) })] })), _jsxs("div", { className: "cc-detail-definition__section", children: [_jsx("h3", { className: "cc-detail-definition__section-heading", children: "Orchestration model" }), _jsx("ol", { className: "cc-detail-definition__step-list", children: definition.orchestrationSteps.map((step, i) => (_jsxs("li", { className: "cc-detail-definition__step-item", children: [_jsx("span", { className: "cc-detail-definition__step-number", children: i + 1 }), _jsx("span", { className: "cc-detail-definition__step-text", children: step })] }, i))) })] }), definition.postRules.length > 0 && (_jsxs("div", { className: "cc-detail-definition__section", children: [_jsx("h3", { className: "cc-detail-definition__section-heading", children: "Post-rules" }), _jsx("ol", { className: "cc-detail-definition__rule-list", children: definition.postRules.map((rule, i) => (_jsx("li", { className: "cc-detail-definition__rule-item", children: rule }, i))) })] })), definition.generatedProcedureText && (_jsxs("div", { className: "cc-detail-definition__section cc-detail-definition__section--procedure", children: [_jsx("h3", { className: "cc-detail-definition__section-heading", children: "Generated procedure" }), _jsx("p", { className: "cc-detail-definition__procedure-text", children: definition.generatedProcedureText })] }))] }));
}
function SchemaFieldTable({ fields, label, }) {
    if (fields.length === 0) {
        return (_jsxs("p", { className: "cc-detail-io__empty", role: "status", children: ["No ", label.toLowerCase(), " fields defined."] }));
    }
    return (_jsxs("table", { className: "cc-detail-io__table cc-table cc-table--sm", "aria-label": label, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Name" }), _jsx("th", { scope: "col", children: "Type" }), _jsx("th", { scope: "col", children: "Required" }), _jsx("th", { scope: "col", children: "Description" })] }) }), _jsx("tbody", { children: fields.map((f) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: f.name }) }), _jsx("td", { children: _jsx("code", { children: f.type }) }), _jsx("td", { children: f.required ? 'Yes' : 'No' }), _jsx("td", { children: f.description ?? '—' })] }, f.name))) })] }));
}
function IOContractView({ contract }) {
    return (_jsxs("section", { className: "cc-detail-io", "aria-label": "IO contract", children: [_jsxs("div", { className: "cc-detail-io__group", children: [_jsx("h3", { className: "cc-detail-io__group-heading", children: "Input" }), _jsx(SchemaFieldTable, { fields: contract.inputSchema, label: "Input schema" })] }), _jsxs("div", { className: "cc-detail-io__group", children: [_jsx("h3", { className: "cc-detail-io__group-heading", children: "Output" }), _jsx(SchemaFieldTable, { fields: contract.outputSchema, label: "Output schema" })] }), _jsxs("div", { className: "cc-detail-io__group", children: [_jsx("h3", { className: "cc-detail-io__group-heading", children: "Context" }), _jsx(SchemaFieldTable, { fields: contract.contextSchema, label: "Context schema" })] })] }));
}
function MetricsView({ metrics }) {
    if (!metrics) {
        return (_jsx("div", { className: "cc-detail-metrics cc-detail-metrics--empty", role: "status", children: _jsx("p", { className: "cc-detail-metrics__placeholder", children: "No metrics data available yet." }) }));
    }
    const successPct = Math.round(metrics.successRate * 100);
    return (_jsx("section", { className: "cc-detail-metrics", "aria-label": "Artefact metrics", children: _jsxs("dl", { className: "cc-detail-metrics__grid", children: [_jsxs("div", { className: "cc-detail-metrics__tile", children: [_jsx("dt", { className: "cc-detail-metrics__tile-label", children: "Total executions" }), _jsx("dd", { className: "cc-detail-metrics__tile-value", children: metrics.totalExecutions.toLocaleString() })] }), _jsxs("div", { className: "cc-detail-metrics__tile", children: [_jsx("dt", { className: "cc-detail-metrics__tile-label", children: "Success rate" }), _jsxs("dd", { className: "cc-detail-metrics__tile-value", children: [successPct, "%"] })] }), metrics.p50LatencyMs !== undefined && (_jsxs("div", { className: "cc-detail-metrics__tile", children: [_jsx("dt", { className: "cc-detail-metrics__tile-label", children: "p50 latency" }), _jsxs("dd", { className: "cc-detail-metrics__tile-value", children: [metrics.p50LatencyMs, "ms"] })] })), metrics.p99LatencyMs !== undefined && (_jsxs("div", { className: "cc-detail-metrics__tile", children: [_jsx("dt", { className: "cc-detail-metrics__tile-label", children: "p99 latency" }), _jsxs("dd", { className: "cc-detail-metrics__tile-value", children: [metrics.p99LatencyMs, "ms"] })] })), metrics.lastExecutedAt && (_jsxs("div", { className: "cc-detail-metrics__tile", children: [_jsx("dt", { className: "cc-detail-metrics__tile-label", children: "Last executed" }), _jsx("dd", { className: "cc-detail-metrics__tile-value", children: new Date(metrics.lastExecutedAt).toLocaleString() })] }))] }) }));
}
// ── Internal: History view ──────────────────────────────────────────────────
function historyStateTone(state) {
    if (state === 'COMPLETED')
        return 'success';
    if (state === 'FAILED')
        return 'error';
    return 'neutral';
}
const HISTORY_COLUMNS = [
    {
        key: 'executedAt',
        label: 'Executed at',
        sortable: true,
        render: (row) => new Date(row.executedAt).toLocaleString(),
    },
    {
        key: 'state',
        label: 'State',
        render: (row) => (_jsx(Tag, { variant: "chip", tone: historyStateTone(row.state), children: row.state })),
    },
    {
        key: 'targetLabel',
        label: 'Target',
        render: (row) => row.targetLabel ? (row.targetHref ? (_jsx("a", { href: row.targetHref, children: row.targetLabel })) : (_jsx("span", { children: row.targetLabel }))) : ('—'),
    },
    {
        key: 'durationMs',
        label: 'Duration',
        render: (row) => (row.durationMs !== undefined ? `${row.durationMs}ms` : '—'),
    },
];
function HistoryView({ entries, totalItems, page = 1, pageSize = 20, onPageChange, }) {
    return (_jsxs("div", { className: "cc-detail-history", children: [_jsxs("table", { className: "cc-table", "aria-label": "Execution history", children: [_jsx("thead", { children: _jsx("tr", { children: HISTORY_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: entries.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: HISTORY_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "cc-detail-history__empty", children: "No execution history available." }) }) })) : (entries.map((entry) => (_jsx("tr", { className: "cc-table__row", children: HISTORY_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(entry) }, col.key))) }, entry.id)))) })] }), totalItems !== undefined && (_jsxs("nav", { className: "cc-detail-history__pagination", "aria-label": "History pagination", role: "navigation", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: page <= 1, onClick: () => onPageChange?.(page - 1), "aria-label": "Previous page", children: "\u2039 Prev" }), _jsxs("span", { className: "cc-detail-history__page-info", "aria-live": "polite", children: ["Page ", page, " of ", Math.max(1, Math.ceil(totalItems / pageSize))] }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: page >= Math.max(1, Math.ceil(totalItems / pageSize)), onClick: () => onPageChange?.(page + 1), "aria-label": "Next page", children: "Next \u203A" })] }))] }));
}
// ── Internal: Callers view ──────────────────────────────────────────────────
const CALLERS_COLUMNS = [
    {
        key: 'name',
        label: 'Caller',
        render: (row) => row.name,
    },
    {
        key: 'callerType',
        label: 'Type',
        render: (row) => (_jsx(Tag, { variant: "chip", tone: "neutral", children: row.callerType })),
    },
    {
        key: 'boundVersion',
        label: 'Bound version',
        render: (row) => row.boundVersion !== null ? `v${row.boundVersion}` : 'latest',
    },
    {
        key: 'domain',
        label: 'Domain',
        render: (row) => row.domain ?? '—',
    },
];
function CallersView({ callers }) {
    return (_jsx("div", { className: "cc-detail-callers", children: _jsxs("table", { className: "cc-table", "aria-label": "Callers", children: [_jsx("thead", { children: _jsx("tr", { children: CALLERS_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: callers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: CALLERS_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "cc-detail-callers__empty", children: "No callers found." }) }) })) : (callers.map((caller) => (_jsx("tr", { className: "cc-table__row", children: CALLERS_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(caller) }, col.key))) }, caller.id)))) })] }) }));
}
// ── Internal: Versioning view ───────────────────────────────────────────────
const VERSIONS_COLUMNS = [
    {
        key: 'version',
        label: 'Version',
        render: (row) => (_jsxs("span", { children: ["v", row.version, row.isActive && (_jsx(Tag, { variant: "chip", tone: "success", className: "cc-detail-version__active", children: "Active" }))] })),
    },
    {
        key: 'state',
        label: 'State',
        render: (row) => (_jsx(Tag, { variant: "chip", tone: "neutral", children: row.state })),
    },
    {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
        key: 'notes',
        label: 'Notes',
        render: (row) => row.notes ?? '—',
    },
];
function VersioningView({ versions }) {
    return (_jsx("div", { className: "cc-detail-versions", children: _jsxs("table", { className: "cc-table", "aria-label": "Versions", children: [_jsx("thead", { children: _jsx("tr", { children: VERSIONS_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: versions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: VERSIONS_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "cc-detail-versions__empty", children: "No versions found." }) }) })) : (versions.map((version) => (_jsx("tr", { className: "cc-table__row", children: VERSIONS_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(version) }, col.key))) }, String(version.version))))) })] }) }));
}
/**
 * ArtefactDetailPane — the canonical detail pane for any artefact.
 *
 * Composes Overlay (placement="detail-right", expandable) as the shell with
 * six standard tabs:
 * Definition · IO Contract · Metrics · History · Callers · Versioning.
 *
 * The host supplies data; this component is data-agnostic — it only renders
 * what it's given. Sub-views are internal composition; consumers use the
 * single `<ArtefactDetailPane>`.
 */
export function ArtefactDetailPane({ open, onClose, title, subtitle, headerActions, definition, ioContract, metrics, history, callers = [], versions = [], }) {
    const tabs = [
        {
            id: 'definition',
            label: 'Definition',
            render: () => _jsx(DefinitionView, { definition: definition }),
        },
        {
            id: 'io-contract',
            label: 'IO Contract',
            render: () => _jsx(IOContractView, { contract: ioContract }),
        },
        {
            id: 'metrics',
            label: 'Metrics',
            render: () => _jsx(MetricsView, { metrics: metrics }),
        },
        {
            id: 'history',
            label: 'History',
            render: () => history ? (_jsx(HistoryView, { ...history })) : (_jsx("p", { role: "status", className: "cc-detail-history__empty", children: "No history data available." })),
        },
        {
            id: 'callers',
            label: 'Callers',
            render: () => _jsx(CallersView, { callers: callers }),
        },
        {
            id: 'versioning',
            label: 'Versioning',
            render: () => _jsx(VersioningView, { versions: versions }),
        },
    ];
    const [activeTabId, setActiveTabId] = React.useState(tabs[0].id);
    const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
    const tabPanelId = React.useId();
    return (_jsxs(Overlay, { placement: "detail-right", open: open, onOpenChange: (isOpen) => { if (!isOpen)
            onClose(); }, title: title, subtitle: subtitle, headerActions: headerActions, expandable: true, children: [_jsx("div", { role: "tablist", "aria-label": `${title} sections`, className: "cc-expandable-pane__tabs", children: tabs.map((tab) => (_jsx("button", { type: "button", role: "tab", id: `${tabPanelId}-tab-${tab.id}`, "aria-selected": tab.id === activeTabId, "aria-controls": `${tabPanelId}-panel-${tab.id}`, tabIndex: tab.id === activeTabId ? 0 : -1, className: [
                        'cc-expandable-pane__tab',
                        tab.id === activeTabId ? 'is-active' : '',
                    ]
                        .filter(Boolean)
                        .join(' '), onClick: () => setActiveTabId(tab.id), onKeyDown: (e) => {
                        const idx = tabs.findIndex((t) => t.id === tab.id);
                        if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            const nextId = tabs[(idx + 1) % tabs.length].id;
                            setActiveTabId(nextId);
                        }
                        else if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const prevId = tabs[(idx - 1 + tabs.length) % tabs.length].id;
                            setActiveTabId(prevId);
                        }
                        else if (e.key === 'Home') {
                            e.preventDefault();
                            setActiveTabId(tabs[0].id);
                        }
                        else if (e.key === 'End') {
                            e.preventDefault();
                            setActiveTabId(tabs[tabs.length - 1].id);
                        }
                    }, children: tab.label }, tab.id))) }), tabs.map((tab) => (_jsx("div", { id: `${tabPanelId}-panel-${tab.id}`, role: "tabpanel", "aria-labelledby": `${tabPanelId}-tab-${tab.id}`, hidden: tab.id !== activeTab.id, className: "cc-expandable-pane__body", children: tab.id === activeTab.id ? tab.render() : null }, tab.id)))] }));
}
//# sourceMappingURL=ArtefactDetailPane.js.map