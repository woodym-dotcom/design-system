/**
 * ArtefactDetailPane stories — Storybook CSF v3.
 *
 * Shows the full six-tab artefact detail pane with sample data,
 * plus isolated sub-component stories.
 */
import * as React from 'react';
import {
  ArtefactDetailPane,
  ArtefactDefinition,
  ArtefactIOContractView,
  ArtefactMetricsView,
  ArtefactCallers,
  ArtefactVersioning,
  type ArtefactDefinitionDoc,
  type ArtefactIOContract,
  type ArtefactMetrics,
  type ArtefactHistoryEntry,
  type ArtefactCaller,
  type ArtefactVersion,
} from '../react/ArtefactDetailPane';

// ── Sample data ───────────────────────────────────────────────────────────────

const DEFINITION: ArtefactDefinitionDoc = {
  artefactName: 'Incident Investigation Process',
  namespace: 'fincrime',
  executionModel: 'AGENT_LOOP',
  preRules: [
    'Require subject identity resolved',
    'Validate alert confidence score > 0.5',
    'Check tenant data-access permission',
  ],
  orchestrationSteps: [
    'Gather transaction context for last 90 days',
    'Run LLM reasoning step (GPT-4o)',
    'Evaluate guardrails: PEP/sanctions, threshold check',
    'Produce structured investigation report',
  ],
  postRules: [
    'Emit AuditLogEntry with verdict and model hash',
    'Notify assigned analyst via Inbox',
  ],
  generatedProcedureText:
    'Given an alert for a subject, the process gathers transaction context for the ' +
    'trailing 90 days, runs an LLM reasoning step to produce an investigation hypothesis, ' +
    'evaluates the result against configured guardrails, and emits a structured report. ' +
    'On completion the analyst is notified via the platform inbox.',
};

const IO_CONTRACT: ArtefactIOContract = {
  inputSchema: [
    { name: 'alertId', type: 'string', required: true, description: 'Source alert identifier' },
    { name: 'subjectId', type: 'string', required: true, description: 'Entity under review' },
    { name: 'lookbackDays', type: 'integer', required: false, description: 'Defaults to 90' },
  ],
  outputSchema: [
    { name: 'reportId', type: 'string', required: true },
    { name: 'verdict', type: 'string', required: true, description: 'ESCALATE | CLOSE | DEFER' },
    { name: 'confidenceScore', type: 'number', required: true },
    { name: 'summaryText', type: 'string', required: false },
  ],
  contextSchema: [
    { name: 'tenantId', type: 'string', required: true },
    { name: 'companyGroupId', type: 'string', required: true },
    { name: 'initiatedBy', type: 'string', required: false },
  ],
};

const METRICS: ArtefactMetrics = {
  totalExecutions: 8_432,
  successRate: 0.974,
  p50LatencyMs: 2_100,
  p99LatencyMs: 14_500,
  lastExecutedAt: '2026-05-04T11:47:00Z',
};

const HISTORY: ArtefactHistoryEntry[] = [
  { id: 'h1', executedAt: '2026-05-04T11:47:00Z', state: 'COMPLETED', subjectId: 'sub-001', subjectType: 'Company', durationMs: 2_340 },
  { id: 'h2', executedAt: '2026-05-04T10:22:00Z', state: 'COMPLETED', subjectId: 'sub-002', subjectType: 'Company', durationMs: 1_890 },
  { id: 'h3', executedAt: '2026-05-04T09:05:00Z', state: 'FAILED', subjectId: 'sub-003', durationMs: 450 },
  { id: 'h4', executedAt: '2026-05-03T16:00:00Z', state: 'COMPLETED', subjectId: 'sub-004', subjectType: 'Individual', durationMs: 3_100 },
];

const CALLERS: ArtefactCaller[] = [
  { id: 'c1', name: 'Risk Monitoring Process', callerType: 'Process', boundVersion: 2, domain: 'risk' },
  { id: 'c2', name: 'Compliance Trigger Handler', callerType: 'Handler', boundVersion: null, domain: 'compliance' },
  { id: 'c3', name: 'FinCrime Batch Review', callerType: 'Process', boundVersion: 1, domain: 'fincrime' },
];

const VERSIONS: ArtefactVersion[] = [
  { version: 2, state: 'ACTIVE', createdAt: '2026-04-15T00:00:00Z', notes: 'Add LLM reasoning + guardrails', isActive: true },
  { version: 1, state: 'ARCHIVED', createdAt: '2026-02-01T00:00:00Z', notes: 'Initial release', isActive: false },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

export default {
  title: 'Artefact/ArtefactDetailPane',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Canonical six-tab detail pane for any AA artefact. ' +
          'Composes ExpandableDetailPane + ListView. ' +
          'Per-artefact phases (3.2–3.11) supply real data; this component is data-agnostic.',
      },
    },
  },
};

// ── Full pane ─────────────────────────────────────────────────────────────────

export function FullPane() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100vh', background: 'var(--surface-1)' }}>
      {!open && (
        <button
          type="button"
          className="cc-btn cc-btn--primary"
          style={{ margin: 24 }}
          onClick={() => setOpen(true)}
        >
          Open detail pane
        </button>
      )}
      <ArtefactDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Incident Investigation Process"
        subtitle="fincrime · AGENT_LOOP · v2"
        definition={DEFINITION}
        ioContract={IO_CONTRACT}
        metrics={METRICS}
        history={{ entries: HISTORY, totalItems: 4 }}
        callers={CALLERS}
        versions={VERSIONS}
      />
    </div>
  );
}
FullPane.storyName = 'Full pane (all data)';

export function NoMetrics() {
  return (
    <div style={{ position: 'relative', height: '100vh', background: 'var(--surface-1)' }}>
      <ArtefactDetailPane
        open
        onClose={() => undefined}
        title="Stub Artefact"
        definition={{ ...DEFINITION, preRules: [], postRules: [], generatedProcedureText: undefined }}
        ioContract={IO_CONTRACT}
        metrics={null}
        history={{ entries: [], totalItems: 0 }}
        callers={[]}
        versions={VERSIONS}
      />
    </div>
  );
}
NoMetrics.storyName = 'Metrics placeholder (no data)';

// ── Sub-component stories ─────────────────────────────────────────────────────

export function DefinitionSubcomponent() {
  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <ArtefactDefinition definition={DEFINITION} />
    </div>
  );
}
DefinitionSubcomponent.storyName = 'ArtefactDefinition (isolated)';

export function IOContractSubcomponent() {
  return (
    <div style={{ padding: 24 }}>
      <ArtefactIOContractView contract={IO_CONTRACT} />
    </div>
  );
}
IOContractSubcomponent.storyName = 'ArtefactIOContract (isolated)';

export function MetricsSubcomponent() {
  return (
    <div style={{ padding: 24 }}>
      <ArtefactMetricsView metrics={METRICS} />
    </div>
  );
}
MetricsSubcomponent.storyName = 'ArtefactMetrics (isolated)';

export function MetricsEmptySubcomponent() {
  return (
    <div style={{ padding: 24 }}>
      <ArtefactMetricsView metrics={null} />
    </div>
  );
}
MetricsEmptySubcomponent.storyName = 'ArtefactMetrics placeholder (no data)';

export function CallersSubcomponent() {
  return (
    <div style={{ padding: 24 }}>
      <ArtefactCallers callers={CALLERS} />
    </div>
  );
}
CallersSubcomponent.storyName = 'ArtefactCallers (isolated)';

export function VersioningSubcomponent() {
  return (
    <div style={{ padding: 24 }}>
      <ArtefactVersioning versions={VERSIONS} />
    </div>
  );
}
VersioningSubcomponent.storyName = 'ArtefactVersioning (isolated)';
