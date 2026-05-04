/**
 * TopRightCreateWizard — unit + interaction tests, plus a11y audit via axe-core.
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { TopRightCreateWizard } from '../react/TopRightCreateWizard';
import type { CreationWizardStep } from '../react/CreationWizard';

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
    // The wizard nav renders at least one "Basics" step element
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

// ── AI variant ────────────────────────────────────────────────────────────────

describe('TopRightCreateWizard AI variant', () => {
  it('renders AI placeholder when variant="ai"', () => {
    renderWizard({ variant: 'ai' });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText(/phase 6\.1/i)).toBeInTheDocument();
  });

  it('does not render wizard steps in AI variant', () => {
    renderWizard({ variant: 'ai' });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.queryByText('Basics')).not.toBeInTheDocument();
  });
});

// ── Submit + onComplete ───────────────────────────────────────────────────────

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
    // Navigate wizard to submit button (single step → Submit visible)
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

  it('has no axe violations when open (ai variant)', async () => {
    const { container } = renderWizard({ variant: 'ai' });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
