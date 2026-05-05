/**
 * TopRightCreateWizard — unit + interaction tests, plus a11y audit via axe-core.
 *
 * Phase 6.1: AI variant tests added — covers the AI panel, projectResult projection,
 * the "review before save" gate, and the §18 type-level guardrail (compile-time test
 * via tsc — see type-guardrail.test-types.ts alongside this file).
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { TopRightCreateWizard } from '../react/TopRightCreateWizard';
import type { CreationWizardStep } from '../react/CreationWizard';
import type { AiCreateConfig } from '../react/TopRightCreateWizard';

interface FormValues {
  name: string;
}

const STEPS: CreationWizardStep<FormValues>[] = [
  {
    id: 'basics',
    label: 'Basics',
    render: ({ values, setValues }) => (
      <label>
        Name
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </label>
    ),
  },
];

function renderWizard(
  props: Partial<React.ComponentProps<typeof TopRightCreateWizard<FormValues>>> = {},
) {
  const defaults = {
    modalTitle: 'New Vendor',
    wizard: {
      steps: STEPS,
      initialValues: { name: '' } as FormValues,
      onSubmit: vi.fn(),
    },
  };
  return render(<TopRightCreateWizard<FormValues> {...defaults} {...props} />);
}

function makeAiConfig(
  overrides: Partial<AiCreateConfig<FormValues>> = {},
): AiCreateConfig<FormValues> {
  return {
    processKey: 'echo-v1',
    runProcess: vi.fn().mockResolvedValue({ output: { name: 'AI Vendor' }, parsedOk: true }),
    projectResult: (output) => ({ name: String(output.name ?? '') }),
    ...overrides,
  };
}

// ── Trigger ───────────────────────────────────────────────────────────────────

describe('TopRightCreateWizard trigger', () => {
  it('renders trigger button with default label', () => {
    renderWizard();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders trigger with custom label', () => {
    renderWizard({ triggerLabel: 'New Vendor' });
    expect(screen.getByRole('button', { name: 'New Vendor' })).toBeInTheDocument();
  });

  it('trigger has aria-haspopup="dialog"', () => {
    renderWizard();
    expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });

  it('trigger has aria-expanded=false initially', () => {
    renderWizard();
    expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('modal is not in DOM before trigger is clicked', () => {
    renderWizard();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

// ── Open modal ────────────────────────────────────────────────────────────────

describe('TopRightCreateWizard modal open', () => {
  it('opens modal on trigger click', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('modal has aria-modal=true', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('modal title is shown', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('heading', { name: 'New Vendor' })).toBeInTheDocument();
  });

  it('renders wizard steps inside modal (manual variant)', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const basicsElements = screen.getAllByText('Basics');
    expect(basicsElements.length).toBeGreaterThan(0);
  });
});

// ── Close modal ───────────────────────────────────────────────────────────────

describe('TopRightCreateWizard modal close', () => {
  it('closes on Escape key', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on backdrop click', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const scrim = document.querySelector('.cc-scrim')!;
    fireEvent.click(scrim);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on close button click', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

// ── AI variant — panel ────────────────────────────────────────────────────────

describe('TopRightCreateWizard AI variant — panel', () => {
  it('renders AI panel (prompt textarea) when variant="ai"', () => {
    renderWizard({ variant: 'ai', aiConfig: makeAiConfig() });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('textbox', { name: /describe/i })).toBeInTheDocument();
  });

  it('does not render wizard steps in AI panel before generation', () => {
    renderWizard({ variant: 'ai', aiConfig: makeAiConfig() });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.queryByText('Basics')).not.toBeInTheDocument();
  });

  it('Generate button is disabled when prompt is empty', () => {
    renderWizard({ variant: 'ai', aiConfig: makeAiConfig() });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
  });

  it('Generate button is enabled once prompt has text', () => {
    renderWizard({ variant: 'ai', aiConfig: makeAiConfig() });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'Acme Corp vendor' },
    });
    expect(screen.getByRole('button', { name: /generate/i })).not.toBeDisabled();
  });
});

// ── AI variant — generation + projection ─────────────────────────────────────

describe('TopRightCreateWizard AI variant — generation and projection', () => {
  it('calls runProcess with processKey and prompt as inputs', async () => {
    const runProcess = vi.fn().mockResolvedValue({ output: { name: 'AI Vendor' }, parsedOk: true });
    const aiConfig = makeAiConfig({ runProcess });
    renderWizard({ variant: 'ai', aiConfig });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'Acme Corp' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    await waitFor(() =>
      expect(runProcess).toHaveBeenCalledWith('echo-v1', { prompt: 'Acme Corp' }),
    );
  });

  it('shows wizard form for review after successful AI generation', async () => {
    const aiConfig = makeAiConfig();
    renderWizard({ variant: 'ai', aiConfig });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'Acme Corp' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    await waitFor(() => expect(screen.queryAllByText('Basics').length).toBeGreaterThan(0));
  });

  it('projects AI output into wizard form values', async () => {
    const aiConfig = makeAiConfig({
      runProcess: vi.fn().mockResolvedValue({ output: { name: 'ProjectedName' }, parsedOk: true }),
      projectResult: (output) => ({ name: String(output.name ?? '') }),
    });
    renderWizard({ variant: 'ai', aiConfig });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'some prompt' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    await waitFor(() => {
      const input = screen.getByRole('textbox', { name: /name/i }) as HTMLInputElement;
      expect(input.value).toBe('ProjectedName');
    });
  });

  it('shows error message when runProcess rejects', async () => {
    const aiConfig = makeAiConfig({
      runProcess: vi.fn().mockRejectedValue(new Error('Network error')),
    });
    renderWizard({ variant: 'ai', aiConfig });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'prompt' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network error'));
  });
});

// ── AI variant — manual review gate ──────────────────────────────────────────

describe('TopRightCreateWizard AI variant — manual review gate', () => {
  it('AI-projected form can be submitted via onSubmit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onComplete = vi.fn();
    const aiConfig = makeAiConfig({
      runProcess: vi.fn().mockResolvedValue({ output: { name: 'AI Vendor' }, parsedOk: true }),
      projectResult: () => ({ name: 'AI Vendor' }),
    });
    render(
      <TopRightCreateWizard<FormValues>
        modalTitle="New Vendor"
        wizard={{ steps: STEPS, initialValues: { name: '' }, onSubmit }}
        variant="ai"
        aiConfig={aiConfig}
        onComplete={onComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'some prompt' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    // Wait for wizard to appear
    await waitFor(() => screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'AI Vendor' }));
      expect(onComplete).toHaveBeenCalledOnce();
    });
  });

  it('modal resets AI state on re-open', async () => {
    const aiConfig = makeAiConfig();
    renderWizard({ variant: 'ai', aiConfig });
    // Open and generate
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.change(screen.getByRole('textbox', { name: /describe/i }), {
      target: { value: 'prompt' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    await waitFor(() => expect(screen.queryAllByText('Basics').length).toBeGreaterThan(0));
    // Close and re-open
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    // Should show AI panel again, not the wizard
    expect(screen.getByRole('textbox', { name: /describe/i })).toBeInTheDocument();
    expect(screen.queryAllByText('Basics')).toHaveLength(0);
  });
});

// ── Submit + onComplete (manual variant) ─────────────────────────────────────

describe('TopRightCreateWizard submit', () => {
  it('calls onComplete after wizard submits', async () => {
    const onComplete = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <TopRightCreateWizard<FormValues>
        modalTitle="New Vendor"
        wizard={{ steps: STEPS, initialValues: { name: '' }, onSubmit }}
        onComplete={onComplete}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
  });
});

// ── a11y ──────────────────────────────────────────────────────────────────────

describe('TopRightCreateWizard a11y (axe)', () => {
  it('has no axe violations when closed', async () => {
    const { container } = renderWizard();
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations when open (manual)', async () => {
    const { container } = renderWizard();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations when open (ai panel)', async () => {
    const { container } = renderWizard({ variant: 'ai', aiConfig: makeAiConfig() });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
