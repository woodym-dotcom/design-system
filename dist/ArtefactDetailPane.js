import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExpandableDetailPane } from './ExpandableDetailPane.js';
/**
 * Read-only pseudo-code render of an artefact's definition.
 * Shows pre-rules → orchestration steps → post-rules, plus generated
 * procedure text when present.
 */
export function ArtefactDefinition({ definition }) {
    return (_jsxs("section", { className: "aa-artefact-definition", "aria-label": "Artefact definition", children: [_jsxs("div", { className: "aa-artefact-definition__meta", children: [definition.namespace && (_jsx("span", { className: "aa-artefact-definition__namespace", children: definition.namespace })), definition.executionModel && (_jsx("span", { className: "aa-artefact-definition__execution-model cc-chip cc-chip--neutral", children: definition.executionModel }))] }), definition.preRules.length > 0 && (_jsxs("div", { className: "aa-artefact-definition__section", children: [_jsx("h3", { className: "aa-artefact-definition__section-heading", children: "Pre-rules" }), _jsx("ol", { className: "aa-artefact-definition__rule-list", children: definition.preRules.map((rule, i) => (_jsx("li", { className: "aa-artefact-definition__rule-item", children: rule }, i))) })] })), _jsxs("div", { className: "aa-artefact-definition__section", children: [_jsx("h3", { className: "aa-artefact-definition__section-heading", children: "Orchestration model" }), _jsx("ol", { className: "aa-artefact-definition__step-list", children: definition.orchestrationSteps.map((step, i) => (_jsxs("li", { className: "aa-artefact-definition__step-item", children: [_jsx("span", { className: "aa-artefact-definition__step-number", children: i + 1 }), _jsx("span", { className: "aa-artefact-definition__step-text", children: step })] }, i))) })] }), definition.postRules.length > 0 && (_jsxs("div", { className: "aa-artefact-definition__section", children: [_jsx("h3", { className: "aa-artefact-definition__section-heading", children: "Post-rules" }), _jsx("ol", { className: "aa-artefact-definition__rule-list", children: definition.postRules.map((rule, i) => (_jsx("li", { className: "aa-artefact-definition__rule-item", children: rule }, i))) })] })), definition.generatedProcedureText && (_jsxs("div", { className: "aa-artefact-definition__section aa-artefact-definition__section--procedure", children: [_jsx("h3", { className: "aa-artefact-definition__section-heading", children: "Generated procedure" }), _jsx("p", { className: "aa-artefact-definition__procedure-text", children: definition.generatedProcedureText })] }))] }));
}
function SchemaFieldTable({ fields, label, }) {
    if (fields.length === 0) {
        return (_jsxs("p", { className: "aa-artefact-io__empty", role: "status", children: ["No ", label.toLowerCase(), " fields defined."] }));
    }
    return (_jsxs("table", { className: "aa-artefact-io__table cc-table cc-table--sm", "aria-label": label, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Name" }), _jsx("th", { scope: "col", children: "Type" }), _jsx("th", { scope: "col", children: "Required" }), _jsx("th", { scope: "col", children: "Description" })] }) }), _jsx("tbody", { children: fields.map((f) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: f.name }) }), _jsx("td", { children: _jsx("code", { children: f.type }) }), _jsx("td", { children: f.required ? 'Yes' : 'No' }), _jsx("td", { children: f.description ?? '—' })] }, f.name))) })] }));
}
/** Input / output / context schema viewer. */
export function ArtefactIOContractView({ contract }) {
    return (_jsxs("section", { className: "aa-artefact-io", "aria-label": "IO contract", children: [_jsxs("div", { className: "aa-artefact-io__group", children: [_jsx("h3", { className: "aa-artefact-io__group-heading", children: "Input" }), _jsx(SchemaFieldTable, { fields: contract.inputSchema, label: "Input schema" })] }), _jsxs("div", { className: "aa-artefact-io__group", children: [_jsx("h3", { className: "aa-artefact-io__group-heading", children: "Output" }), _jsx(SchemaFieldTable, { fields: contract.outputSchema, label: "Output schema" })] }), _jsxs("div", { className: "aa-artefact-io__group", children: [_jsx("h3", { className: "aa-artefact-io__group-heading", children: "Context" }), _jsx(SchemaFieldTable, { fields: contract.contextSchema, label: "Context schema" })] })] }));
}
/** Metrics tile strip. Renders placeholder when no data available. */
export function ArtefactMetricsView({ metrics }) {
    if (!metrics) {
        return (_jsx("div", { className: "aa-artefact-metrics aa-artefact-metrics--empty", role: "status", children: _jsx("p", { className: "aa-artefact-metrics__placeholder", children: "No metrics data available yet." }) }));
    }
    const successPct = Math.round(metrics.successRate * 100);
    return (_jsx("section", { className: "aa-artefact-metrics", "aria-label": "Artefact metrics", children: _jsxs("dl", { className: "aa-artefact-metrics__grid", children: [_jsxs("div", { className: "aa-artefact-metrics__tile", children: [_jsx("dt", { className: "aa-artefact-metrics__tile-label", children: "Total executions" }), _jsx("dd", { className: "aa-artefact-metrics__tile-value", children: metrics.totalExecutions.toLocaleString() })] }), _jsxs("div", { className: "aa-artefact-metrics__tile", children: [_jsx("dt", { className: "aa-artefact-metrics__tile-label", children: "Success rate" }), _jsxs("dd", { className: "aa-artefact-metrics__tile-value", children: [successPct, "%"] })] }), metrics.p50LatencyMs !== undefined && (_jsxs("div", { className: "aa-artefact-metrics__tile", children: [_jsx("dt", { className: "aa-artefact-metrics__tile-label", children: "p50 latency" }), _jsxs("dd", { className: "aa-artefact-metrics__tile-value", children: [metrics.p50LatencyMs, "ms"] })] })), metrics.p99LatencyMs !== undefined && (_jsxs("div", { className: "aa-artefact-metrics__tile", children: [_jsx("dt", { className: "aa-artefact-metrics__tile-label", children: "p99 latency" }), _jsxs("dd", { className: "aa-artefact-metrics__tile-value", children: [metrics.p99LatencyMs, "ms"] })] })), metrics.lastExecutedAt && (_jsxs("div", { className: "aa-artefact-metrics__tile", children: [_jsx("dt", { className: "aa-artefact-metrics__tile-label", children: "Last executed" }), _jsx("dd", { className: "aa-artefact-metrics__tile-value", children: new Date(metrics.lastExecutedAt).toLocaleString() })] }))] }) }));
}
// ── Sub-component: ArtefactHistory ────────────────────────────────────────────
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
        render: (row) => (_jsx("span", { className: `cc-chip cc-chip--${row.state === 'COMPLETED' ? 'success' : row.state === 'FAILED' ? 'danger' : 'neutral'}`, children: row.state })),
    },
    {
        key: 'subjectId',
        label: 'Subject',
        render: (row) => row.subjectId ? (_jsxs("span", { children: [row.subjectType ? _jsxs("em", { children: [row.subjectType, ": "] }) : null, row.subjectId] })) : ('—'),
    },
    {
        key: 'durationMs',
        label: 'Duration',
        render: (row) => (row.durationMs !== undefined ? `${row.durationMs}ms` : '—'),
    },
];
/** Paginated execution/session history list. */
export function ArtefactHistory({ entries, totalItems, page = 1, pageSize = 20, onPageChange, }) {
    return (_jsxs("div", { className: "aa-artefact-history", children: [_jsxs("table", { className: "cc-table", "aria-label": "Execution history", children: [_jsx("thead", { children: _jsx("tr", { children: HISTORY_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: entries.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: HISTORY_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "aa-artefact-history__empty", children: "No execution history available." }) }) })) : (entries.map((entry) => (_jsx("tr", { className: "cc-table__row", children: HISTORY_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(entry) }, col.key))) }, entry.id)))) })] }), totalItems !== undefined && (_jsxs("nav", { className: "aa-artefact-history__pagination", "aria-label": "History pagination", role: "navigation", children: [_jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: page <= 1, onClick: () => onPageChange?.(page - 1), "aria-label": "Previous page", children: "\u2039 Prev" }), _jsxs("span", { className: "aa-artefact-history__page-info", "aria-live": "polite", children: ["Page ", page, " of ", Math.max(1, Math.ceil(totalItems / pageSize))] }), _jsx("button", { type: "button", className: "cc-btn cc-btn--ghost cc-btn--sm", disabled: page >= Math.max(1, Math.ceil(totalItems / pageSize)), onClick: () => onPageChange?.(page + 1), "aria-label": "Next page", children: "Next \u203A" })] }))] }));
}
// ── Sub-component: ArtefactCallers ────────────────────────────────────────────
const CALLERS_COLUMNS = [
    {
        key: 'name',
        label: 'Caller',
        render: (row) => row.name,
    },
    {
        key: 'callerType',
        label: 'Type',
        render: (row) => (_jsx("span", { className: "cc-chip cc-chip--neutral", children: row.callerType })),
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
/** Version-aware list of callers bound to this artefact. */
export function ArtefactCallers({ callers }) {
    return (_jsx("div", { className: "aa-artefact-callers", children: _jsxs("table", { className: "cc-table", "aria-label": "Callers", children: [_jsx("thead", { children: _jsx("tr", { children: CALLERS_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: callers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: CALLERS_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "aa-artefact-callers__empty", children: "No callers found." }) }) })) : (callers.map((caller) => (_jsx("tr", { className: "cc-table__row", children: CALLERS_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(caller) }, col.key))) }, caller.id)))) })] }) }));
}
// ── Sub-component: ArtefactVersioning ─────────────────────────────────────────
const VERSIONS_COLUMNS = [
    {
        key: 'version',
        label: 'Version',
        render: (row) => (_jsxs("span", { children: ["v", row.version, row.isActive && (_jsx("span", { className: "cc-chip cc-chip--success", style: { marginLeft: 8 }, children: "Active" }))] })),
    },
    {
        key: 'state',
        label: 'State',
        render: (row) => (_jsx("span", { className: "cc-chip cc-chip--neutral", children: row.state })),
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
/** Version list with active version pointer. */
export function ArtefactVersioning({ versions }) {
    return (_jsx("div", { className: "aa-artefact-versions", children: _jsxs("table", { className: "cc-table", "aria-label": "Versions", children: [_jsx("thead", { children: _jsx("tr", { children: VERSIONS_COLUMNS.map((col) => (_jsx("th", { scope: "col", className: "cc-table__th", children: col.label }, col.key))) }) }), _jsx("tbody", { children: versions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: VERSIONS_COLUMNS.length, className: "cc-table__td", children: _jsx("p", { role: "status", className: "aa-artefact-versions__empty", children: "No versions found." }) }) })) : (versions.map((version) => (_jsx("tr", { className: "cc-table__row", children: VERSIONS_COLUMNS.map((col) => (_jsx("td", { className: "cc-table__td", children: col.render(version) }, col.key))) }, String(version.version))))) })] }) }));
}
/**
 * ArtefactDetailPane — the canonical detail pane for any AA artefact.
 *
 * Composes ExpandableDetailPane as the shell with six standard tabs:
 * Definition · IO Contract · Metrics · History · Callers · Versioning.
 *
 * Per-artefact phases (3.2–3.11) mount this component and supply real data;
 * this component itself is data-agnostic — it only renders what it's given.
 */
export function ArtefactDetailPane({ open, onClose, title, subtitle, headerActions, definition, ioContract, metrics, history, callers = [], versions = [], }) {
    const tabs = [
        {
            id: 'definition',
            label: 'Definition',
            render: () => _jsx(ArtefactDefinition, { definition: definition }),
        },
        {
            id: 'io-contract',
            label: 'IO Contract',
            render: () => _jsx(ArtefactIOContractView, { contract: ioContract }),
        },
        {
            id: 'metrics',
            label: 'Metrics',
            render: () => _jsx(ArtefactMetricsView, { metrics: metrics }),
        },
        {
            id: 'history',
            label: 'History',
            render: () => history ? (_jsx(ArtefactHistory, { ...history })) : (_jsx("p", { role: "status", className: "aa-artefact-history__empty", children: "No history data available." })),
        },
        {
            id: 'callers',
            label: 'Callers',
            render: () => _jsx(ArtefactCallers, { callers: callers }),
        },
        {
            id: 'versioning',
            label: 'Versioning',
            render: () => _jsx(ArtefactVersioning, { versions: versions }),
        },
    ];
    return (_jsx(ExpandableDetailPane, { open: open, onClose: onClose, title: title, subtitle: subtitle, headerActions: headerActions, tabs: tabs }));
}
//# sourceMappingURL=ArtefactDetailPane.js.map