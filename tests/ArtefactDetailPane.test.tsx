/**
 * ArtefactDetailPane family — unit + a11y tests.
 *
 * §14 L3: follows ExpandableDetailPane.test.tsx pattern.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import {
  ArtefactDetailPane,
  ArtefactDefinition,
  ArtefactIOContractView,
  ArtefactMetricsView,
  ArtefactHistory,
  ArtefactCallers,
  ArtefactVersioning,
  type ArtefactDefinitionDoc,
  type ArtefactIOContract,
  type ArtefactMetrics,
  type ArtefactHistoryEntry,
  type ArtefactCaller,
  type ArtefactVersion,
} from '../react/ArtefactDetailPane';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAMPLE_DEFINITION: ArtefactDefinitionDoc = {
  artefactName: 'Incident Investigation Process',
  namespace: 'fincrime',
  executionModel: 'AGENT_LOOP',
  preRules: ['Require subject identity resolved', 'Validate alert score > 0.5'],
  orchestrationSteps: [
    'Gather transaction context',
    'Run LLM reasoning step',
    'Produce investigation report',
  ],
  postRules: ['Emit AuditLogEntry', 'Notify assigned analyst'],
  generatedProcedureText:
    'Given an alert for a subject, the process gathers transaction context, runs the ' +
    'LLM reasoning step to produce a hypothesis, then emits the investigation report.',
};

const SAMPLE_IO: ArtefactIOContract = {
  inputSchema: [
    { name: 'alertId', type: 'string', required: true, description: 'Source alert identifier' },
    { name: 'subjectId', type: 'string', required: true },
  ],
  outputSchema: [
    { name: 'reportId', type: 'string', required: true },
    { name: 'verdict', type: 'string', required: true },
  ],
  contextSchema: [
    { name: 'tenantId', type: 'string', required: true },
  ],
};

const SAMPLE_METRICS: ArtefactMetrics = {
  totalExecutions: 1234,
  successRate: 0.97,
  p50LatencyMs: 320,
  p99LatencyMs: 4200,
  lastExecutedAt: '2026-05-04T12:00:00Z',
};

const SAMPLE_HISTORY: ArtefactHistoryEntry[] = [
  {
    id: 'h1',
    executedAt: '2026-05-04T11:00:00Z',
    state: 'COMPLETED',
    targetLabel: 'Company: sub-001',
    durationMs: 340,
  },
  {
    id: 'h2',
    executedAt: '2026-05-04T10:00:00Z',
    state: 'FAILED',
    targetLabel: 'sub-002',
    durationMs: 120,
  },
];

const SAMPLE_CALLERS: ArtefactCaller[] = [
  { id: 'c1', name: 'Risk Monitoring Process', callerType: 'Process', boundVersion: 2, domain: 'risk' },
  { id: 'c2', name: 'Compliance Trigger', callerType: 'Handler', boundVersion: null, domain: 'compliance' },
];

const SAMPLE_VERSIONS: ArtefactVersion[] = [
  { version: 2, state: 'ACTIVE', createdAt: '2026-04-01T00:00:00Z', notes: 'Add LLM step', isActive: true },
  { version: 1, state: 'ARCHIVED', createdAt: '2026-03-01T00:00:00Z', isActive: false },
];

function renderPane(overrides: Partial<React.ComponentProps<typeof ArtefactDetailPane>> = {}) {
  return render(
    <ArtefactDetailPane
      open
      onClose={vi.fn()}
      title="Incident Investigation Process"
      subtitle="fincrime · v2"
      definition={SAMPLE_DEFINITION}
      ioContract={SAMPLE_IO}
      metrics={SAMPLE_METRICS}
      history={{ entries: SAMPLE_HISTORY, totalItems: 2 }}
      callers={SAMPLE_CALLERS}
      versions={SAMPLE_VERSIONS}
      {...overrides}
    />,
  );
}

// ── ArtefactDetailPane shell ───────────────────────────────────────────────────

describe('ArtefactDetailPane shell', () => {
  it('renders title and subtitle', () => {
    renderPane();
    expect(screen.getByRole('heading', { name: 'Incident Investigation Process' })).toBeInTheDocument();
    expect(screen.getByText('fincrime · v2')).toBeInTheDocument();
  });

  it('renders all six tabs', () => {
    renderPane();
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    for (const label of ['Definition', 'IO Contract', 'Metrics', 'History', 'Callers', 'Versioning']) {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    }
  });

  it('shows Definition tab content by default', () => {
    renderPane();
    expect(screen.getByRole('heading', { name: 'Orchestration model', level: 3 })).toBeInTheDocument();
  });

  it('switches to IO Contract tab', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'IO Contract' }));
    expect(screen.getByRole('table', { name: 'Input schema' })).toBeInTheDocument();
  });

  it('switches to Metrics tab', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'Metrics' }));
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('switches to History tab', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'History' }));
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('switches to Callers tab', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'Callers' }));
    expect(screen.getByText('Risk Monitoring Process')).toBeInTheDocument();
  });

  it('switches to Versioning tab', () => {
    renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'Versioning' }));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderPane({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ── ArtefactDefinition ────────────────────────────────────────────────────────

describe('ArtefactDefinition', () => {
  it('renders execution model chip', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByText('AGENT_LOOP')).toBeInTheDocument();
  });

  it('renders namespace', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByText('fincrime')).toBeInTheDocument();
  });

  it('renders pre-rules section', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByRole('heading', { name: 'Pre-rules', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Require subject identity resolved')).toBeInTheDocument();
  });

  it('renders orchestration steps numbered', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Gather transaction context')).toBeInTheDocument();
  });

  it('renders post-rules section', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByRole('heading', { name: 'Post-rules', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Emit AuditLogEntry')).toBeInTheDocument();
  });

  it('renders generated procedure text when present', () => {
    render(<ArtefactDefinition definition={SAMPLE_DEFINITION} />);
    expect(screen.getByText(/gathers transaction context/i)).toBeInTheDocument();
  });

  it('omits pre-rules section when empty', () => {
    render(
      <ArtefactDefinition definition={{ ...SAMPLE_DEFINITION, preRules: [] }} />,
    );
    expect(screen.queryByRole('heading', { name: 'Pre-rules', level: 3 })).not.toBeInTheDocument();
  });

  it('omits generated procedure when absent', () => {
    render(
      <ArtefactDefinition
        definition={{ ...SAMPLE_DEFINITION, generatedProcedureText: undefined }}
      />,
    );
    expect(screen.queryByRole('heading', { name: 'Generated procedure', level: 3 })).not.toBeInTheDocument();
  });
});

// ── ArtefactIOContractView ────────────────────────────────────────────────────

describe('ArtefactIOContractView', () => {
  it('renders input, output, and context tables', () => {
    render(<ArtefactIOContractView contract={SAMPLE_IO} />);
    expect(screen.getByRole('table', { name: 'Input schema' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Output schema' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Context schema' })).toBeInTheDocument();
  });

  it('renders field names and types', () => {
    render(<ArtefactIOContractView contract={SAMPLE_IO} />);
    expect(screen.getByText('alertId')).toBeInTheDocument();
    // Multiple 'string' cells are expected (several fields share the same type)
    expect(screen.getAllByText('string').length).toBeGreaterThan(0);
  });

  it('shows empty state when schema has no fields', () => {
    render(
      <ArtefactIOContractView
        contract={{ ...SAMPLE_IO, contextSchema: [] }}
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

// ── ArtefactMetricsView ───────────────────────────────────────────────────────

describe('ArtefactMetricsView', () => {
  it('renders metrics values', () => {
    render(<ArtefactMetricsView metrics={SAMPLE_METRICS} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('97%')).toBeInTheDocument();
    expect(screen.getByText('320ms')).toBeInTheDocument();
  });

  it('renders placeholder when no metrics data', () => {
    render(<ArtefactMetricsView metrics={null} />);
    expect(screen.getByRole('status')).toHaveTextContent(/no metrics data available/i);
  });

  it('renders placeholder when metrics undefined', () => {
    render(<ArtefactMetricsView metrics={undefined} />);
    expect(screen.getByRole('status')).toHaveTextContent(/no metrics data available/i);
  });
});

// ── ArtefactHistory ───────────────────────────────────────────────────────────

describe('ArtefactHistory', () => {
  it('renders history entries', () => {
    render(<ArtefactHistory entries={SAMPLE_HISTORY} totalItems={2} />);
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });
});

// ── ArtefactCallers ───────────────────────────────────────────────────────────

describe('ArtefactCallers', () => {
  it('renders caller names', () => {
    render(<ArtefactCallers callers={SAMPLE_CALLERS} />);
    expect(screen.getByText('Risk Monitoring Process')).toBeInTheDocument();
    expect(screen.getByText('Compliance Trigger')).toBeInTheDocument();
  });

  it('renders bound version or latest', () => {
    render(<ArtefactCallers callers={SAMPLE_CALLERS} />);
    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.getByText('latest')).toBeInTheDocument();
  });
});

// ── ArtefactVersioning ────────────────────────────────────────────────────────

describe('ArtefactVersioning', () => {
  it('renders version rows', () => {
    render(<ArtefactVersioning versions={SAMPLE_VERSIONS} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('ARCHIVED')).toBeInTheDocument();
  });
});

// ── a11y ──────────────────────────────────────────────────────────────────────

describe('ArtefactDetailPane a11y (axe)', () => {
  it('has no axe violations when open on Definition tab', async () => {
    const { container } = renderPane();
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations on IO Contract tab', async () => {
    const { container } = renderPane();
    fireEvent.click(screen.getByRole('tab', { name: 'IO Contract' }));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations on Metrics tab with no data', async () => {
    const { container } = renderPane({ metrics: null });
    fireEvent.click(screen.getByRole('tab', { name: 'Metrics' }));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
