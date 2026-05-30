/**
 * EntityForm — edit mode, wizard mode (step navigation, validation, advance
 * blocking), AI-review step, and submit wiring.
 *
 * The OrchestratorBridge is always stubbed via setOrchestratorBridge() so no
 * real network calls are made.
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { EntityForm } from './EntityForm';
import { buildEntitySchema, setOrchestratorBridge } from './schema';

// ── Stub the orchestrator bridge so no bootstrap error is thrown ─────────────

const mockStartReview = vi.fn();

beforeEach(() => {
  mockStartReview.mockReset();
  setOrchestratorBridge({ startReview: mockStartReview });
});

// ── Shared schema ─────────────────────────────────────────────────────────────

const personSchema = buildEntitySchema(
  {
    name:  z.string().min(1, 'Name is required'),
    email: z.string().email('Must be a valid email'),
  },
  {
    fieldMeta: {
      name:  { label: 'Name',  required: true },
      email: { label: 'Email', required: true },
    },
  },
);

type PersonValues = z.infer<typeof personSchema['_zodSchema']>;

const defaultValues: PersonValues = { name: '', email: '' };

// ── Edit mode — rendering ────────────────────────────────────────────────────

describe('EntityForm — edit mode: rendering', () => {
  it('renders the Save button with the default submitLabel', () => {
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={defaultValues}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('uses a custom submitLabel when provided', () => {
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={defaultValues}
        onSubmit={vi.fn()}
        submitLabel="Update profile"
      />,
    );
    expect(screen.getByRole('button', { name: 'Update profile' })).toBeTruthy();
  });

  it('renders children with the form handle', () => {
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={{ name: 'Alice', email: 'alice@example.com' }}
        onSubmit={vi.fn()}
      >
        {(form) => (
          <input
            aria-label="Name"
            value={form.values.name}
            onChange={(e) => form.setField('name', e.target.value)}
          />
        )}
      </EntityForm>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    expect(input.value).toBe('Alice');
  });

  it('renders fallback hint when no children are passed', () => {
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={defaultValues}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText(/No fields rendered/)).toBeTruthy();
  });
});

// ── Edit mode — field onChange wiring ────────────────────────────────────────

describe('EntityForm — edit mode: field onChange', () => {
  it('updates the form value when setField is called', async () => {
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={defaultValues}
        onSubmit={vi.fn()}
      >
        {(form) => (
          <input
            aria-label="Name"
            value={form.values.name}
            onChange={(e) => form.setField('name', e.target.value)}
          />
        )}
      </EntityForm>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Bob' } });
    await waitFor(() => expect(input.value).toBe('Bob'));
  });
});

// ── Edit mode — validation + submit ──────────────────────────────────────────

describe('EntityForm — edit mode: validation and submit', () => {
  it('calls onSubmit with valid form values on submit', async () => {
    const onSubmit = vi.fn();
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={{ name: 'Alice', email: 'alice@example.com' }}
        onSubmit={onSubmit}
      >
        {() => null}
      </EntityForm>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(
      { name: 'Alice', email: 'alice@example.com' },
      expect.any(Object),
    ));
  });

  it('does NOT call onSubmit when required fields are blank', async () => {
    const onSubmit = vi.fn();
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={defaultValues}
        onSubmit={onSubmit}
      >
        {() => null}
      </EntityForm>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows "Saving…" on the submit button while submitting', async () => {
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((res) => { resolveSubmit = res; }),
    );
    render(
      <EntityForm
        mode="edit"
        schema={personSchema}
        initialValues={{ name: 'Alice', email: 'alice@example.com' }}
        onSubmit={onSubmit}
      >
        {() => null}
      </EntityForm>,
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Saving…' })).toBeTruthy(),
    );
    // Clean up
    await act(async () => { resolveSubmit(); });
  });
});

// ── Wizard mode — rendering ────────────────────────────────────────────────────

describe('EntityForm — wizard mode: rendering', () => {
  const steps = [
    {
      id: 'step1',
      label: 'Identity',
      fields: ['name'],
      render: ({ form }: any) => (
        <input
          aria-label="Name"
          value={form.values.name}
          onChange={(e: any) => form.setField('name', e.target.value)}
        />
      ),
    },
    {
      id: 'step2',
      label: 'Contact',
      fields: ['email'],
      render: ({ form }: any) => (
        <input
          aria-label="Email"
          value={form.values.email}
          onChange={(e: any) => form.setField('email', e.target.value)}
        />
      ),
    },
  ];

  it('renders the step navigation with all step labels', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Wizard steps' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Identity/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Contact/ })).toBeTruthy();
  });

  it('marks the first step as current with aria-current="step"', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    const firstStepBtn = screen.getByRole('button', { name: /Identity/ });
    expect(firstStepBtn.getAttribute('aria-current')).toBe('step');
  });

  it('renders the first step body by default', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy();
  });

  it('shows a "Continue" button on non-final steps', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('disables the Back button on the first step', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    const backBtn = screen.getByRole('button', { name: 'Back' }) as HTMLButtonElement;
    expect(backBtn.disabled).toBe(true);
  });
});

// ── Wizard mode — step navigation ─────────────────────────────────────────────

describe('EntityForm — wizard mode: step navigation', () => {
  const steps = [
    {
      id: 'step1',
      label: 'Identity',
      fields: ['name'],
      render: ({ form }: any) => (
        <input
          aria-label="Name"
          value={form.values.name}
          onChange={(e: any) => form.setField('name', e.target.value)}
        />
      ),
    },
    {
      id: 'step2',
      label: 'Contact',
      fields: ['email'],
      render: () => <p data-testid="step2-body">Step 2 body</p>,
    },
  ];

  it('advances to the next step when Continue is clicked and the step fields are valid', async () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    // Fill in the required name field first
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });
    await waitFor(() =>
      expect(screen.getByTestId('step2-body')).toBeTruthy(),
    );
  });

  it('stays on the current step when Continue is clicked with invalid fields', async () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}  // name is blank → invalid
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });
    // Should still be on step 1
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy();
    expect(screen.queryByTestId('step2-body')).toBeNull();
  });

  it('goes back to the previous step when Back is clicked', async () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );
    // Advance (fill name first)
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });
    await waitFor(() => expect(screen.getByTestId('step2-body')).toBeTruthy());

    // Go back
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy(),
    );
  });

  it('shows a Submit button (not Continue) on the last step', async () => {
    const steps2 = [
      {
        id: 's1',
        label: 'One',
        fields: ['name'],
        render: ({ form }: any) => (
          <input
            aria-label="Name"
            value={form.values.name}
            onChange={(e: any) => form.setField('name', e.target.value)}
          />
        ),
      },
    ];
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={steps2}
        onSubmit={vi.fn()}
        submitLabel="Create"
      />,
    );
    // Single step → already the last step
    expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
  });
});

// ── Wizard mode — onBeforeAdvance blocking ────────────────────────────────────

describe('EntityForm — wizard mode: onBeforeAdvance blocking', () => {
  it('shows the block reason and does not advance when onBeforeAdvance returns a string', async () => {
    const steps = [
      {
        id: 's1',
        label: 'Step 1',
        fields: ['name'],
        onBeforeAdvance: vi.fn(async () => 'Company name already taken'),
        render: ({ form }: any) => (
          <input
            aria-label="Name"
            value={form.values.name}
            onChange={(e: any) => form.setField('name', e.target.value)}
          />
        ),
      },
      {
        id: 's2',
        label: 'Step 2',
        fields: [],
        render: () => <p data-testid="s2">Step 2</p>,
      },
    ];

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={{ name: 'Klarna', email: '' }}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Company name already taken');
    });
    expect(screen.queryByTestId('s2')).toBeNull();
  });

  it('does not advance when onBeforeAdvance returns false', async () => {
    const steps = [
      {
        id: 's1',
        label: 'Step 1',
        fields: ['name'],
        onBeforeAdvance: vi.fn(async () => false as const),
        render: ({ form }: any) => (
          <input
            aria-label="Name"
            value={form.values.name}
            onChange={(e: any) => form.setField('name', e.target.value)}
          />
        ),
      },
      {
        id: 's2',
        label: 'Step 2',
        fields: [],
        render: () => <p data-testid="s2">Step 2</p>,
      },
    ];

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={{ name: 'Alice', email: '' }}
        steps={steps}
        onSubmit={vi.fn()}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Could not save');
    });
    expect(screen.queryByTestId('s2')).toBeNull();
  });
});

// ── Wizard mode — AI-review step ──────────────────────────────────────────────

describe('EntityForm — wizard mode: AI-review step', () => {
  const reviewSteps = [
    {
      id: 's1',
      label: 'Details',
      fields: ['name'],
      render: ({ form }: any) => (
        <input
          aria-label="Name"
          value={form.values.name}
          onChange={(e: any) => form.setField('name', e.target.value)}
        />
      ),
    },
  ];

  const aiReview = {
    agentName: 'creation-wizard-review.v1',
    buildInput: (values: PersonValues) => ({
      entityType: 'Person',
      entityDraft: values as Record<string, unknown>,
    }),
    label: 'AI review',
  };

  it('appends an "AI review" step to the wizard nav', () => {
    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={reviewSteps}
        aiReview={aiReview}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /AI review/ })).toBeTruthy();
  });

  it('shows "Reviewing your inputs with AI…" while the review is loading', async () => {
    // Keep the promise pending
    mockStartReview.mockReturnValue(new Promise(() => {}));

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={reviewSteps}
        aiReview={aiReview}
        onSubmit={vi.fn()}
      />,
    );

    // Advance to the AI review step
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() =>
      expect(screen.getByText(/Reviewing your inputs with AI/)).toBeTruthy(),
    );
  });

  it('shows review summary and suggestions when the review resolves', async () => {
    const reviewOutput = {
      summary: 'Looks good overall.',
      suggestions: [{ field: 'name', suggested: 'Alice Smith', rationale: 'Full name preferred' }],
      questions: [],
      blockers: [],
      finalDraft: {},
    };
    mockStartReview.mockResolvedValue(reviewOutput);

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={reviewSteps}
        aiReview={aiReview}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() => screen.getByText('Looks good overall.'));
    expect(screen.getByText('Full name preferred')).toBeTruthy();
    // "Apply" button for the suggestion
    expect(screen.getByRole('button', { name: 'Apply' })).toBeTruthy();
  });

  it('shows blockers in an alert region when the review has blockers', async () => {
    const reviewOutput = {
      summary: 'Issues found.',
      suggestions: [],
      questions: [],
      blockers: [{ field: 'name', reason: 'Name contains prohibited words' }],
      finalDraft: {},
    };
    mockStartReview.mockResolvedValue(reviewOutput);

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={reviewSteps}
        aiReview={aiReview}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() => screen.getByRole('alert'));
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Name contains prohibited words');
  });

  it('shows an error message when the review call rejects', async () => {
    mockStartReview.mockRejectedValue(new Error('Network error'));

    render(
      <EntityForm
        mode="wizard"
        schema={personSchema}
        initialValues={defaultValues}
        steps={reviewSteps}
        aiReview={aiReview}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Alice' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    });

    await waitFor(() =>
      expect(screen.getByText(/Review failed: Network error/)).toBeTruthy(),
    );
  });
});
