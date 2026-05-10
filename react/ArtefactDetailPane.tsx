/**
 * ArtefactDetailPane — composable detail pane family for AA artefacts.
 *
 * Composes ExpandableDetailPane (tab shell) + ListView (history/callers/versions)
 * into a single "detail pane for any artefact" abstraction.
 *
 * §14 L1: no artefact detail primitive existed.
 * §14 L2: composes ExpandableDetailPane + ListView already in @ds/core.
 * §14 L3: follows cc-btn / cc-chip token pattern, ListViewColumn shape.
 *
 * Exported types mirror the BE DTOs in com.aa.platform.artefact — keep in sync.
 *
 * Accessibility: inherits ExpandableDetailPane a11y contract (dialog, focus trap,
 * keyboard navigation, axe-clean). Individual tab content uses semantic HTML.
 */
import * as React from 'react';
import { ExpandableDetailPane } from './ExpandableDetailPane';
import { type ListViewColumn } from './ListView';

// ── Domain types (mirrored from BE com.aa.platform.artefact DTOs) ─────────────

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
  /** Human-readable name, e.g. "Incident Investigation Process". */
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
   * Produced by the BE from the step graph; displayed read-only.
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
  subjectId?: string;
  subjectType?: string;
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

// ── Sub-component: ArtefactDefinition ────────────────────────────────────────

export interface ArtefactDefinitionProps {
  definition: ArtefactDefinitionDoc;
}

/**
 * Read-only pseudo-code render of an artefact's definition.
 * Shows pre-rules → orchestration steps → post-rules, plus generated
 * procedure text when present.
 */
export function ArtefactDefinition({ definition }: ArtefactDefinitionProps) {
  return (
    <section className="aa-artefact-definition" aria-label="Artefact definition">
      <div className="aa-artefact-definition__meta">
        {definition.namespace && (
          <span className="aa-artefact-definition__namespace">{definition.namespace}</span>
        )}
        {definition.executionModel && (
          <span className="aa-artefact-definition__execution-model cc-chip cc-chip--neutral">
            {definition.executionModel}
          </span>
        )}
      </div>

      {definition.preRules.length > 0 && (
        <div className="aa-artefact-definition__section">
          <h3 className="aa-artefact-definition__section-heading">Pre-rules</h3>
          <ol className="aa-artefact-definition__rule-list">
            {definition.preRules.map((rule, i) => (
              <li key={i} className="aa-artefact-definition__rule-item">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="aa-artefact-definition__section">
        <h3 className="aa-artefact-definition__section-heading">Orchestration model</h3>
        <ol className="aa-artefact-definition__step-list">
          {definition.orchestrationSteps.map((step, i) => (
            <li key={i} className="aa-artefact-definition__step-item">
              <span className="aa-artefact-definition__step-number">{i + 1}</span>
              <span className="aa-artefact-definition__step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {definition.postRules.length > 0 && (
        <div className="aa-artefact-definition__section">
          <h3 className="aa-artefact-definition__section-heading">Post-rules</h3>
          <ol className="aa-artefact-definition__rule-list">
            {definition.postRules.map((rule, i) => (
              <li key={i} className="aa-artefact-definition__rule-item">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      )}

      {definition.generatedProcedureText && (
        <div className="aa-artefact-definition__section aa-artefact-definition__section--procedure">
          <h3 className="aa-artefact-definition__section-heading">Generated procedure</h3>
          <p className="aa-artefact-definition__procedure-text">
            {definition.generatedProcedureText}
          </p>
        </div>
      )}
    </section>
  );
}

// ── Sub-component: ArtefactIOContractView ─────────────────────────────────────

export interface ArtefactIOContractProps {
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
      <p className="aa-artefact-io__empty" role="status">
        No {label.toLowerCase()} fields defined.
      </p>
    );
  }
  return (
    <table className="aa-artefact-io__table cc-table cc-table--sm" aria-label={label}>
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

/** Input / output / context schema viewer. */
export function ArtefactIOContractView({ contract }: ArtefactIOContractProps) {
  return (
    <section className="aa-artefact-io" aria-label="IO contract">
      <div className="aa-artefact-io__group">
        <h3 className="aa-artefact-io__group-heading">Input</h3>
        <SchemaFieldTable fields={contract.inputSchema} label="Input schema" />
      </div>
      <div className="aa-artefact-io__group">
        <h3 className="aa-artefact-io__group-heading">Output</h3>
        <SchemaFieldTable fields={contract.outputSchema} label="Output schema" />
      </div>
      <div className="aa-artefact-io__group">
        <h3 className="aa-artefact-io__group-heading">Context</h3>
        <SchemaFieldTable fields={contract.contextSchema} label="Context schema" />
      </div>
    </section>
  );
}

// ── Sub-component: ArtefactMetricsView ────────────────────────────────────────

export interface ArtefactMetricsProps {
  metrics: ArtefactMetrics | null | undefined;
}

/** Metrics tile strip. Renders placeholder when no data available. */
export function ArtefactMetricsView({ metrics }: ArtefactMetricsProps) {
  if (!metrics) {
    return (
      <div className="aa-artefact-metrics aa-artefact-metrics--empty" role="status">
        <p className="aa-artefact-metrics__placeholder">No metrics data available yet.</p>
      </div>
    );
  }

  const successPct = Math.round(metrics.successRate * 100);

  return (
    <section className="aa-artefact-metrics" aria-label="Artefact metrics">
      <dl className="aa-artefact-metrics__grid">
        <div className="aa-artefact-metrics__tile">
          <dt className="aa-artefact-metrics__tile-label">Total executions</dt>
          <dd className="aa-artefact-metrics__tile-value">
            {metrics.totalExecutions.toLocaleString()}
          </dd>
        </div>
        <div className="aa-artefact-metrics__tile">
          <dt className="aa-artefact-metrics__tile-label">Success rate</dt>
          <dd className="aa-artefact-metrics__tile-value">{successPct}%</dd>
        </div>
        {metrics.p50LatencyMs !== undefined && (
          <div className="aa-artefact-metrics__tile">
            <dt className="aa-artefact-metrics__tile-label">p50 latency</dt>
            <dd className="aa-artefact-metrics__tile-value">{metrics.p50LatencyMs}ms</dd>
          </div>
        )}
        {metrics.p99LatencyMs !== undefined && (
          <div className="aa-artefact-metrics__tile">
            <dt className="aa-artefact-metrics__tile-label">p99 latency</dt>
            <dd className="aa-artefact-metrics__tile-value">{metrics.p99LatencyMs}ms</dd>
          </div>
        )}
        {metrics.lastExecutedAt && (
          <div className="aa-artefact-metrics__tile">
            <dt className="aa-artefact-metrics__tile-label">Last executed</dt>
            <dd className="aa-artefact-metrics__tile-value">
              {new Date(metrics.lastExecutedAt).toLocaleString()}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

// ── Sub-component: ArtefactHistory ────────────────────────────────────────────

const HISTORY_COLUMNS: ListViewColumn<ArtefactHistoryEntry>[] = [
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
      <span
        className={`cc-chip cc-chip--${row.state === 'COMPLETED' ? 'success' : row.state === 'FAILED' ? 'danger' : 'neutral'}`}
      >
        {row.state}
      </span>
    ),
  },
  {
    key: 'subjectId',
    label: 'Subject',
    render: (row) =>
      row.subjectId ? (
        <span>
          {row.subjectType ? <em>{row.subjectType}: </em> : null}
          {row.subjectId}
        </span>
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

export interface ArtefactHistoryProps {
  entries: ArtefactHistoryEntry[];
  /** Total items for pagination. */
  totalItems?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

/** Paginated execution/session history list. */
export function ArtefactHistory({
  entries,
  totalItems,
  page = 1,
  pageSize = 20,
  onPageChange,
}: ArtefactHistoryProps) {
  return (
    <div className="aa-artefact-history">
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
                <p role="status" className="aa-artefact-history__empty">
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
          className="aa-artefact-history__pagination"
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
          <span className="aa-artefact-history__page-info" aria-live="polite">
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

// ── Sub-component: ArtefactCallers ────────────────────────────────────────────

const CALLERS_COLUMNS: ListViewColumn<ArtefactCaller>[] = [
  {
    key: 'name',
    label: 'Caller',
    render: (row) => row.name,
  },
  {
    key: 'callerType',
    label: 'Type',
    render: (row) => (
      <span className="cc-chip cc-chip--neutral">{row.callerType}</span>
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

export interface ArtefactCallersProps {
  callers: ArtefactCaller[];
}

/** Version-aware list of callers bound to this artefact. */
export function ArtefactCallers({ callers }: ArtefactCallersProps) {
  return (
    <div className="aa-artefact-callers">
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
                <p role="status" className="aa-artefact-callers__empty">
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

// ── Sub-component: ArtefactVersioning ─────────────────────────────────────────

const VERSIONS_COLUMNS: ListViewColumn<ArtefactVersion>[] = [
  {
    key: 'version',
    label: 'Version',
    render: (row) => (
      <span>
        v{row.version}
        {row.isActive && (
          <span className="cc-chip cc-chip--success" style={{ marginLeft: 8 }}>
            Active
          </span>
        )}
      </span>
    ),
  },
  {
    key: 'state',
    label: 'State',
    render: (row) => (
      <span className="cc-chip cc-chip--neutral">{row.state}</span>
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

export interface ArtefactVersioningProps {
  versions: ArtefactVersion[];
}

/** Version list with active version pointer. */
export function ArtefactVersioning({ versions }: ArtefactVersioningProps) {
  return (
    <div className="aa-artefact-versions">
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
                <p role="status" className="aa-artefact-versions__empty">
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

  history?: ArtefactHistoryProps;
  callers?: ArtefactCaller[];
  versions?: ArtefactVersion[];
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
      render: () => <ArtefactDefinition definition={definition} />,
    },
    {
      id: 'io-contract',
      label: 'IO Contract',
      render: () => <ArtefactIOContractView contract={ioContract} />,
    },
    {
      id: 'metrics',
      label: 'Metrics',
      render: () => <ArtefactMetricsView metrics={metrics} />,
    },
    {
      id: 'history',
      label: 'History',
      render: () =>
        history ? (
          <ArtefactHistory {...history} />
        ) : (
          <p role="status" className="aa-artefact-history__empty">
            No history data available.
          </p>
        ),
    },
    {
      id: 'callers',
      label: 'Callers',
      render: () => <ArtefactCallers callers={callers} />,
    },
    {
      id: 'versioning',
      label: 'Versioning',
      render: () => <ArtefactVersioning versions={versions} />,
    },
  ];

  return (
    <ExpandableDetailPane
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      headerActions={headerActions}
      tabs={tabs}
    />
  );
}
