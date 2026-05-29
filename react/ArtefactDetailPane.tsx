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
import { Overlay } from './Overlay';
import { Tag } from './Tag';
/**
 * Column definition for the inline tables in this file.
 * Previously imported from ./ListView (deleted in Phase 2). The shape is
 * intentionally identical to ListViewColumn so existing column arrays
 * remain valid.
 */
interface ArtefactColumnDef<TRow> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (row: TRow) => import('react').ReactNode;
}

// ── Domain types ─────────────────────────────────────────────────────────────

/** A single property in an input/output/context schema. */
export interface ArtefactSchemaField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

/**
 * The definition document for an artefact — pseudo-code structure,
 * pre-rules, orchestration model text, post-rules, and generated procedure.
 */
export interface ArtefactDefinitionDoc {
  /** Human-readable name. */
  artefactName: string;
  /** Optional namespace / domain qualifier. */
  namespace?: string;
  /** Execution model label, e.g. "AGENT_LOOP", "SYNCHRONOUS". */
  executionModel?: string;
  /** Free-text pre-rules / guardrail lines applied before execution. */
  preRules: string[];
  /** Ordered step descriptions representing the orchestration model. */
  orchestrationSteps: string[];
  /** Free-text post-rules / side-effects applied after execution. */
  postRules: string[];
  /**
   * Auto-generated procedure narrative paragraph.
   * Produced by the backend from the step graph; displayed read-only.
   */
  generatedProcedureText?: string;
}

/** Input / output / context schema for an artefact. */
export interface ArtefactIOContract {
  inputSchema: ArtefactSchemaField[];
  outputSchema: ArtefactSchemaField[];
  contextSchema: ArtefactSchemaField[];
}

/** Aggregate metrics for an artefact. null → no data yet (renders placeholder). */
export interface ArtefactMetrics {
  totalExecutions: number;
  successRate: number; // 0–1
  p50LatencyMs?: number;
  p99LatencyMs?: number;
  lastExecutedAt?: string; // ISO-8601
}

/** One entry in the execution / session history list. */
export interface ArtefactHistoryEntry {
  id: string;
  executedAt: string; // ISO-8601
  state: string;
  /** Human-readable label for the row's target (rendered as-is). */
  targetLabel?: string;
  /** Optional href if the target is navigable. */
  targetHref?: string;
  durationMs?: number;
}

/** A caller that binds to this artefact, with version awareness. */
export interface ArtefactCaller {
  id: string;
  name: string;
  callerType: string;
  boundVersion: number | null; // null = unversioned / latest
  domain?: string;
}

/** One version entry in the version list. */
export interface ArtefactVersion {
  version: number;
  state: string; // e.g. DRAFT, ACTIVE, ARCHIVED
  createdAt: string; // ISO-8601
  notes?: string;
  isActive: boolean;
}

// ── Internal: Definition section ─────────────────────────────────────────────

interface DefinitionViewProps {
  definition: ArtefactDefinitionDoc;
}

function DefinitionView({ definition }: DefinitionViewProps) {
  return (
    <section className="cc-detail-definition" aria-label="Artefact definition">
      <div className="cc-detail-definition__meta">
        {definition.namespace && (
          <span className="cc-detail-definition__namespace">{definition.namespace}</span>
        )}
        {definition.executionModel && (
          <Tag variant="chip" tone="neutral" className="cc-detail-definition__execution-model">
            {definition.executionModel}
          </Tag>
        )}
      </div>

      {definition.preRules.length > 0 && (
        <div className="cc-detail-definition__section">
          <h3 className="cc-detail-definition__section-heading">Pre-rules</h3>
          <ol className="cc-detail-definition__rule-list">
            {definition.preRules.map((rule, i) => (
              <li key={i} className="cc-detail-definition__rule-item">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="cc-detail-definition__section">
        <h3 className="cc-detail-definition__section-heading">Orchestration model</h3>
        <ol className="cc-detail-definition__step-list">
          {definition.orchestrationSteps.map((step, i) => (
            <li key={i} className="cc-detail-definition__step-item">
              <span className="cc-detail-definition__step-number">{i + 1}</span>
              <span className="cc-detail-definition__step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {definition.postRules.length > 0 && (
        <div className="cc-detail-definition__section">
          <h3 className="cc-detail-definition__section-heading">Post-rules</h3>
          <ol className="cc-detail-definition__rule-list">
            {definition.postRules.map((rule, i) => (
              <li key={i} className="cc-detail-definition__rule-item">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      )}

      {definition.generatedProcedureText && (
        <div className="cc-detail-definition__section cc-detail-definition__section--procedure">
          <h3 className="cc-detail-definition__section-heading">Generated procedure</h3>
          <p className="cc-detail-definition__procedure-text">
            {definition.generatedProcedureText}
          </p>
        </div>
      )}
    </section>
  );
}

// ── Internal: IO Contract view ───────────────────────────────────────────────

interface IOContractViewProps {
  contract: ArtefactIOContract;
}

function SchemaFieldTable({
  fields,
  label,
}: {
  fields: ArtefactSchemaField[];
  label: string;
}) {
  if (fields.length === 0) {
    return (
      <p className="cc-detail-io__empty" role="status">
        No {label.toLowerCase()} fields defined.
      </p>
    );
  }
  return (
    <table className="cc-detail-io__table cc-table cc-table--sm" aria-label={label}>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Required</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => (
          <tr key={f.name}>
            <td>
              <code>{f.name}</code>
            </td>
            <td>
              <code>{f.type}</code>
            </td>
            <td>{f.required ? 'Yes' : 'No'}</td>
            <td>{f.description ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function IOContractView({ contract }: IOContractViewProps) {
  return (
    <section className="cc-detail-io" aria-label="IO contract">
      <div className="cc-detail-io__group">
        <h3 className="cc-detail-io__group-heading">Input</h3>
        <SchemaFieldTable fields={contract.inputSchema} label="Input schema" />
      </div>
      <div className="cc-detail-io__group">
        <h3 className="cc-detail-io__group-heading">Output</h3>
        <SchemaFieldTable fields={contract.outputSchema} label="Output schema" />
      </div>
      <div className="cc-detail-io__group">
        <h3 className="cc-detail-io__group-heading">Context</h3>
        <SchemaFieldTable fields={contract.contextSchema} label="Context schema" />
      </div>
    </section>
  );
}

// ── Internal: Metrics view ──────────────────────────────────────────────────

interface MetricsViewProps {
  metrics: ArtefactMetrics | null | undefined;
}

function MetricsView({ metrics }: MetricsViewProps) {
  if (!metrics) {
    return (
      <div className="cc-detail-metrics cc-detail-metrics--empty" role="status">
        <p className="cc-detail-metrics__placeholder">No metrics data available yet.</p>
      </div>
    );
  }

  const successPct = Math.round(metrics.successRate * 100);

  return (
    <section className="cc-detail-metrics" aria-label="Artefact metrics">
      <dl className="cc-detail-metrics__grid">
        <div className="cc-detail-metrics__tile">
          <dt className="cc-detail-metrics__tile-label">Total executions</dt>
          <dd className="cc-detail-metrics__tile-value">
            {metrics.totalExecutions.toLocaleString()}
          </dd>
        </div>
        <div className="cc-detail-metrics__tile">
          <dt className="cc-detail-metrics__tile-label">Success rate</dt>
          <dd className="cc-detail-metrics__tile-value">{successPct}%</dd>
        </div>
        {metrics.p50LatencyMs !== undefined && (
          <div className="cc-detail-metrics__tile">
            <dt className="cc-detail-metrics__tile-label">p50 latency</dt>
            <dd className="cc-detail-metrics__tile-value">{metrics.p50LatencyMs}ms</dd>
          </div>
        )}
        {metrics.p99LatencyMs !== undefined && (
          <div className="cc-detail-metrics__tile">
            <dt className="cc-detail-metrics__tile-label">p99 latency</dt>
            <dd className="cc-detail-metrics__tile-value">{metrics.p99LatencyMs}ms</dd>
          </div>
        )}
        {metrics.lastExecutedAt && (
          <div className="cc-detail-metrics__tile">
            <dt className="cc-detail-metrics__tile-label">Last executed</dt>
            <dd className="cc-detail-metrics__tile-value">
              {new Date(metrics.lastExecutedAt).toLocaleString()}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

// ── Internal: History view ──────────────────────────────────────────────────

function historyStateTone(state: string): 'success' | 'error' | 'neutral' {
  if (state === 'COMPLETED') return 'success';
  if (state === 'FAILED') return 'error';
  return 'neutral';
}

const HISTORY_COLUMNS: ArtefactColumnDef<ArtefactHistoryEntry>[] = [
  {
    key: 'executedAt',
    label: 'Executed at',
    sortable: true,
    render: (row) => new Date(row.executedAt).toLocaleString(),
  },
  {
    key: 'state',
    label: 'State',
    render: (row) => (
      <Tag variant="chip" tone={historyStateTone(row.state)}>
        {row.state}
      </Tag>
    ),
  },
  {
    key: 'targetLabel',
    label: 'Target',
    render: (row) =>
      row.targetLabel ? (
        row.targetHref ? (
          <a href={row.targetHref}>{row.targetLabel}</a>
        ) : (
          <span>{row.targetLabel}</span>
        )
      ) : (
        '—'
      ),
  },
  {
    key: 'durationMs',
    label: 'Duration',
    render: (row) => (row.durationMs !== undefined ? `${row.durationMs}ms` : '—'),
  },
];

interface HistoryViewProps {
  entries: ArtefactHistoryEntry[];
  /** Total items for pagination. */
  totalItems?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

function HistoryView({
  entries,
  totalItems,
  page = 1,
  pageSize = 20,
  onPageChange,
}: HistoryViewProps) {
  return (
    <div className="cc-detail-history">
      <table className="cc-table" aria-label="Execution history">
        <thead>
          <tr>
            {HISTORY_COLUMNS.map((col) => (
              <th key={col.key} scope="col" className="cc-table__th">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td
                colSpan={HISTORY_COLUMNS.length}
                className="cc-table__td"
              >
                <p role="status" className="cc-detail-history__empty">
                  No execution history available.
                </p>
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} className="cc-table__row">
                {HISTORY_COLUMNS.map((col) => (
                  <td key={col.key} className="cc-table__td">
                    {col.render(entry)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalItems !== undefined && (
        <nav
          className="cc-detail-history__pagination"
          aria-label="History pagination"
          role="navigation"
        >
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="cc-detail-history__page-info" aria-live="polite">
            Page {page} of {Math.max(1, Math.ceil(totalItems / pageSize))}
          </span>
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-btn--sm"
            disabled={page >= Math.max(1, Math.ceil(totalItems / pageSize))}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
}

// ── Internal: Callers view ──────────────────────────────────────────────────

const CALLERS_COLUMNS: ArtefactColumnDef<ArtefactCaller>[] = [
  {
    key: 'name',
    label: 'Caller',
    render: (row) => row.name,
  },
  {
    key: 'callerType',
    label: 'Type',
    render: (row) => (
      <Tag variant="chip" tone="neutral">
        {row.callerType}
      </Tag>
    ),
  },
  {
    key: 'boundVersion',
    label: 'Bound version',
    render: (row) =>
      row.boundVersion !== null ? `v${row.boundVersion}` : 'latest',
  },
  {
    key: 'domain',
    label: 'Domain',
    render: (row) => row.domain ?? '—',
  },
];

interface CallersViewProps {
  callers: ArtefactCaller[];
}

function CallersView({ callers }: CallersViewProps) {
  return (
    <div className="cc-detail-callers">
      <table className="cc-table" aria-label="Callers">
        <thead>
          <tr>
            {CALLERS_COLUMNS.map((col) => (
              <th key={col.key} scope="col" className="cc-table__th">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {callers.length === 0 ? (
            <tr>
              <td
                colSpan={CALLERS_COLUMNS.length}
                className="cc-table__td"
              >
                <p role="status" className="cc-detail-callers__empty">
                  No callers found.
                </p>
              </td>
            </tr>
          ) : (
            callers.map((caller) => (
              <tr key={caller.id} className="cc-table__row">
                {CALLERS_COLUMNS.map((col) => (
                  <td key={col.key} className="cc-table__td">
                    {col.render(caller)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Internal: Versioning view ───────────────────────────────────────────────

const VERSIONS_COLUMNS: ArtefactColumnDef<ArtefactVersion>[] = [
  {
    key: 'version',
    label: 'Version',
    render: (row) => (
      <span>
        v{row.version}
        {row.isActive && (
          <Tag variant="chip" tone="success" className="cc-detail-version__active">
            Active
          </Tag>
        )}
      </span>
    ),
  },
  {
    key: 'state',
    label: 'State',
    render: (row) => (
      <Tag variant="chip" tone="neutral">
        {row.state}
      </Tag>
    ),
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

interface VersioningViewProps {
  versions: ArtefactVersion[];
}

function VersioningView({ versions }: VersioningViewProps) {
  return (
    <div className="cc-detail-versions">
      <table className="cc-table" aria-label="Versions">
        <thead>
          <tr>
            {VERSIONS_COLUMNS.map((col) => (
              <th key={col.key} scope="col" className="cc-table__th">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {versions.length === 0 ? (
            <tr>
              <td
                colSpan={VERSIONS_COLUMNS.length}
                className="cc-table__td"
              >
                <p role="status" className="cc-detail-versions__empty">
                  No versions found.
                </p>
              </td>
            </tr>
          ) : (
            versions.map((version) => (
              <tr key={String(version.version)} className="cc-table__row">
                {VERSIONS_COLUMNS.map((col) => (
                  <td key={col.key} className="cc-table__td">
                    {col.render(version)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Main composing component: ArtefactDetailPane ──────────────────────────────

export interface ArtefactDetailPaneProps {
  open: boolean;
  onClose: () => void;

  /** Artefact display name shown in the pane title. */
  title: string;
  /** Optional subtitle, e.g. namespace or version badge. */
  subtitle?: string;
  /** Optional actions rendered in the pane header (e.g. Edit, Deprecate). */
  headerActions?: React.ReactNode;

  definition: ArtefactDefinitionDoc;
  ioContract: ArtefactIOContract;
  metrics?: ArtefactMetrics | null;

  history?: HistoryViewProps;
  callers?: ArtefactCaller[];
  versions?: ArtefactVersion[];
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
export function ArtefactDetailPane({
  open,
  onClose,
  title,
  subtitle,
  headerActions,
  definition,
  ioContract,
  metrics,
  history,
  callers = [],
  versions = [],
}: ArtefactDetailPaneProps) {
  const tabs = [
    {
      id: 'definition',
      label: 'Definition',
      render: () => <DefinitionView definition={definition} />,
    },
    {
      id: 'io-contract',
      label: 'IO Contract',
      render: () => <IOContractView contract={ioContract} />,
    },
    {
      id: 'metrics',
      label: 'Metrics',
      render: () => <MetricsView metrics={metrics} />,
    },
    {
      id: 'history',
      label: 'History',
      render: () =>
        history ? (
          <HistoryView {...history} />
        ) : (
          <p role="status" className="cc-detail-history__empty">
            No history data available.
          </p>
        ),
    },
    {
      id: 'callers',
      label: 'Callers',
      render: () => <CallersView callers={callers} />,
    },
    {
      id: 'versioning',
      label: 'Versioning',
      render: () => <VersioningView versions={versions} />,
    },
  ];

  const [activeTabId, setActiveTabId] = React.useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const tabPanelId = React.useId();

  return (
    <Overlay
      placement="detail-right"
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      expandable
    >
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
                const nextId = tabs[(idx + 1) % tabs.length].id;
                setActiveTabId(nextId);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevId = tabs[(idx - 1 + tabs.length) % tabs.length].id;
                setActiveTabId(prevId);
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
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tabPanelId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${tabPanelId}-tab-${tab.id}`}
          hidden={tab.id !== activeTab.id}
          className="cc-expandable-pane__body"
        >
          {tab.id === activeTab.id ? tab.render() : null}
        </div>
      ))}
    </Overlay>
  );
}
