/**
 * CreationWizard — step context next/back/submit callbacks,
 * boundary no-ops, and activeIndex/totalSteps values.
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { CreationWizard, type CreationWizardStep } from '../react/CreationWizard';

interface FormValues {
  name: string;
  note: string;
}

function makeSteps(
  onCapture?: (ctx: CreationWizardStepContext<FormValues>, stepId: string) => void,
): CreationWizardStep<FormValues>[] {
  return [
    {
      id: 'step1',
      label: 'Step One',
      render: (ctx) => {
        onCapture?.(ctx, 'step1');
        return (
          <div>
            <span data-testid="step1-content">Step 1</span>
            <span data-testid="step1-index">{ctx.activeIndex}</span>
            <span data-testid="step1-total">{ctx.totalSteps}</span>
            <button type="button" onClick={() => ctx.next()} data-testid="ctx-next">ctx-next</button>
            <button type="button" onClick={() => ctx.back()} data-testid="ctx-back">ctx-back</button>
          </div>
        );
      },
    },
    {
      id: 'step2',
      label: 'Step Two',
      render: (ctx) => {
        onCapture?.(ctx, 'step2');
        return (
          <div>
            <span data-testid="step2-content">Step 2</span>
            <span data-testid="step2-index">{ctx.activeIndex}</span>
            <button type="button" onClick={() => ctx.submit()} data-testid="ctx-submit">ctx-submit</button>
            <button type="button" onClick={() => ctx.next()} data-testid="ctx-next-last">ctx-next-last</button>
          </div>
        );
      },
    },
  ];
}

// ── activeIndex + totalSteps ──────────────────────────────────────────────────

describe('CreationWizard step context — activeIndex and totalSteps', () => {
  it('exposes activeIndex=0 on first step', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('step1-index').textContent).toBe('0');
  });

  it('exposes totalSteps equal to steps.length', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('step1-total').textContent).toBe('2');
  });

  it('exposes updated activeIndex after advancing', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('ctx-next'));
    expect(screen.getByTestId('step2-index').textContent).toBe('1');
  });
});

// ── next() ────────────────────────────────────────────────────────────────────

describe('CreationWizard step context — next()', () => {
  it('advances to the next step', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('step1-content')).toBeTruthy();
    fireEvent.click(screen.getByTestId('ctx-next'));
    expect(screen.getByTestId('step2-content')).toBeTruthy();
  });

  it('next() is a no-op on the last step', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    // Move to last step
    fireEvent.click(screen.getByTestId('ctx-next'));
    // Fire next on last step
    fireEvent.click(screen.getByTestId('ctx-next-last'));
    // Still on step 2
    expect(screen.getByTestId('step2-content')).toBeTruthy();
  });
});

// ── back() ────────────────────────────────────────────────────────────────────

describe('CreationWizard step context — back()', () => {
  it('goes back to the previous step', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('ctx-next'));
    expect(screen.getByTestId('step2-content')).toBeTruthy();
    // Use the footer Back button (step 2 doesn't expose ctx-back directly)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByTestId('step1-content')).toBeTruthy();
  });

  it('back() is a no-op on the first step', () => {
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('ctx-back'));
    // Still on step 1
    expect(screen.getByTestId('step1-content')).toBeTruthy();
  });
});

// ── submit() ──────────────────────────────────────────────────────────────────

describe('CreationWizard step context — submit()', () => {
  it('calls onSubmit when submit() is invoked from context', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={onSubmit}
      />,
    );
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('ctx-next'));
    // Trigger submit via context
    fireEvent.click(screen.getByTestId('ctx-submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it('submit() fires onSubmit only once (not double-triggered)', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.click(screen.getByTestId('ctx-next'));
    fireEvent.click(screen.getByTestId('ctx-submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });
});

// ── a11y ──────────────────────────────────────────────────────────────────────

describe('CreationWizard a11y (axe)', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <CreationWizard
        steps={makeSteps()}
        initialValues={{ name: '', note: '' }}
        onSubmit={vi.fn()}
      />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
