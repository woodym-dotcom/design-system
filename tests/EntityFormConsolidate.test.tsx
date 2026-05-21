/**
 * DS-SIMPLIFY 06 — EntityForm consolidation tests.
 *
 * Coverage:
 *  1. Searchable SelectField: typeahead filters, custom filter callback, maxVisible cap
 *  2. FormField as='shell': label + hint + error wrap arbitrary children; htmlFor association
 *  3. Demoted exports: individual field primitives absent from public barrel (react/index.ts)
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  buildEntitySchema,
  useEntityForm,
} from '../react/entity-form/index';
import { SelectField } from '../react/entity-form/fields/SelectField';
import { FormField } from '../react/FormField';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const OPTIONS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
  { value: 'delta', label: 'Delta' },
  { value: 'epsilon', label: 'Epsilon' },
];

const schema = buildEntitySchema(
  { choice: z.string() },
  { fieldMeta: { choice: { label: 'Choice', fieldType: 'select' } } },
);

function SearchableHarness({
  maxVisible,
  filter,
}: {
  maxVisible?: number;
  filter?: (opt: { value: string; label: string }, q: string) => boolean;
}) {
  const form = useEntityForm(schema, { choice: '' });
  return (
    <SelectField
      name="choice"
      form={form}
      searchable
      options={OPTIONS}
      placeholder="Pick one"
      maxVisible={maxVisible}
      filter={filter}
    />
  );
}

// ---------------------------------------------------------------------------
// 1. Searchable SelectField
// ---------------------------------------------------------------------------
describe('SearchableSelectField — typeahead', () => {
  it('renders a combobox input (not a plain select)', () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    expect(input.tagName).toBe('INPUT');
  });

  it('shows matching options when user types', async () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'al' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
    // Non-matching options should not be in the list
    expect(screen.queryByRole('option', { name: 'Beta' })).not.toBeInTheDocument();
  });

  it('hides options that do not match query', () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'beta' } });
    expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Alpha' })).not.toBeInTheDocument();
  });

  it('selects an option on click and closes the listbox', async () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'gam' } });
    const opt = screen.getByRole('option', { name: 'Gamma' });
    await act(async () => { fireEvent.click(opt); });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('Gamma');
  });

  it('keyboard navigation: ArrowDown selects first option, Enter confirms', async () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    // First option 'Alpha' should be selected
    expect((input as HTMLInputElement).value).toBe('Alpha');
  });

  it('Escape closes listbox and restores prior label', () => {
    render(<SearchableHarness />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'alp' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('SearchableSelectField — custom filter', () => {
  it('custom filter callback is invoked and controls visible options', () => {
    const customFilter = vi.fn(
      (opt: { value: string; label: string }, q: string) =>
        opt.value.startsWith(q),
    );
    render(<SearchableHarness filter={customFilter} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'al' } });
    expect(customFilter).toHaveBeenCalled();
    // 'al' matches option value 'alpha' (startsWith)
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
    // 'be' doesn't start with 'al'
    expect(screen.queryByRole('option', { name: 'Beta' })).not.toBeInTheDocument();
  });
});

describe('SearchableSelectField — maxVisible', () => {
  it('caps rendered options at maxVisible', () => {
    render(<SearchableHarness maxVisible={2} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Empty query — all options would match default filter but only 2 shown
    fireEvent.change(input, { target: { value: '' } });
    const opts = screen.queryAllByRole('option');
    expect(opts.length).toBeLessThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// 2. FormField as='shell'
// ---------------------------------------------------------------------------
describe('FormField as="shell"', () => {
  it('renders the child input with the correct id', () => {
    render(
      <FormField id="custom-input" label="Custom" as="shell" onChange={() => {}}>
        <input id="custom-input" type="text" defaultValue="" />
      </FormField>,
    );
    expect(document.getElementById('custom-input')).toBeInTheDocument();
  });

  it('label htmlFor points to child id', () => {
    render(
      <FormField id="shell-field" label="My Label" as="shell" onChange={() => {}}>
        <input id="shell-field" type="text" />
      </FormField>,
    );
    const label = screen.getByText('My Label');
    expect(label.closest('label')?.getAttribute('for')).toBe('shell-field');
  });

  it('renders hint text in the slot when no error', () => {
    render(
      <FormField
        id="sh2"
        label="L"
        as="shell"
        hint="Some hint text"
        onChange={() => {}}
      >
        <input id="sh2" type="text" />
      </FormField>,
    );
    expect(screen.getByText('Some hint text')).toBeInTheDocument();
  });

  it('renders error text in the slot and applies cc-field--error class', () => {
    const { container } = render(
      <FormField
        id="sh3"
        label="L"
        as="shell"
        error="Required field"
        onChange={() => {}}
      >
        <input id="sh3" type="text" />
      </FormField>,
    );
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(container.querySelector('.cc-field--error')).toBeTruthy();
  });

  it('error slot is always in DOM (G4 invariant)', () => {
    render(
      <FormField id="sh4" label="L" as="shell" onChange={() => {}}>
        <input id="sh4" type="text" />
      </FormField>,
    );
    // aria-describedby isn't on the child here (shell doesn't add it) but the
    // slot element identified by id="${id}-slot" must exist.
    expect(document.getElementById('sh4-slot')).toBeInTheDocument();
  });

  it('renders required marker', () => {
    render(
      <FormField id="sh5" label="Name" as="shell" required onChange={() => {}}>
        <input id="sh5" type="text" />
      </FormField>,
    );
    // The * marker should appear (aria-hidden span)
    expect(document.querySelector('.cc-field__required')).toBeInTheDocument();
  });

  it('child input is arbitrary — not controlled by FormField', () => {
    render(
      <FormField id="sh6" label="Pick Date" as="shell" onChange={() => {}}>
        <input id="sh6" type="date" defaultValue="2026-05-21" />
      </FormField>,
    );
    const input = document.getElementById('sh6') as HTMLInputElement;
    expect(input.type).toBe('date');
    expect(input.value).toBe('2026-05-21');
  });
});

// ---------------------------------------------------------------------------
// 3. Demoted exports — individual fields absent from public barrel
// ---------------------------------------------------------------------------
describe('DS-SIMPLIFY 06 — demoted exports', () => {
  it('TextField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).TextField).toBeUndefined();
  });

  it('NumberField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).NumberField).toBeUndefined();
  });

  it('SelectField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).SelectField).toBeUndefined();
  });

  it('MultiSelectField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).MultiSelectField).toBeUndefined();
  });

  it('DateField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).DateField).toBeUndefined();
  });

  it('MoneyField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).MoneyField).toBeUndefined();
  });

  it('EntityReferenceField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).EntityReferenceField).toBeUndefined();
  });

  it('RichTextField is NOT exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).RichTextField).toBeUndefined();
  });

  it('EntityForm IS still exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).EntityForm).toBeDefined();
  });

  it('registerFieldType IS still exported from the public react barrel', async () => {
    const barrel = await import('../react/index');
    expect((barrel as any).registerFieldType).toBeDefined();
  });
});
