/**
 * EntityPicker — DS-SIMPLIFY 07
 *
 * Test coverage:
 *  1. Typeahead debounces and calls search
 *  2. Inline-create opens Overlay with EntityForm; submission fires onCreate + auto-selects
 *  3. Multi-select: chips render; X removes chip
 *  4. Clearing fires onChange(null) / empty array
 *  5. a11y: ARIA combobox pattern
 */
import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
import { EntityPicker } from '../react/EntityPicker';
import { buildEntitySchema } from '../react/entity-form/index';

// ── Fixture types ─────────────────────────────────────────────────────────────

interface Party {
  id: string;
  name: string;
}

const partyA: Party = { id: 'a', name: 'Alpha Corp' };
const partyB: Party = { id: 'b', name: 'Beta Ltd' };

const renderOption = (e: Party) => e.name;

/** A search fn that resolves after one microtask tick (Promise.resolve). */
const makeSearch = (results: Party[]) =>
  vi.fn().mockResolvedValue(results);

/** Flush all microtask-queue promises. */
const flushPromises = () => act(async () => { await Promise.resolve(); });

// ── 1. Typeahead — debounce + search call ─────────────────────────────────────

describe('typeahead', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('does NOT call search immediately on first keystroke (debounce guard)', () => {
    const search = makeSearch([partyA]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'al' } });
    expect(search).not.toHaveBeenCalled();
  });

  it('calls search after debounce delay and shows result', async () => {
    const search = makeSearch([partyA]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Alpha' } });
    // Advance past the 250ms debounce
    act(() => { vi.advanceTimersByTime(300); });
    // Drain the search promise
    await flushPromises();
    expect(search).toHaveBeenCalledWith('Alpha');
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByText('Alpha Corp')).toBeTruthy();
  });

  it('shows emptyText when search returns empty array', async () => {
    const search = makeSearch([]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
        emptyText="Nothing found"
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'xyz' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByText('Nothing found')).toBeTruthy();
  });

  it('fires onChange with selected entity on option mousedown', async () => {
    const search = makeSearch([partyA, partyB]);
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.mouseDown(screen.getByText('Alpha Corp'));
    expect(onChange).toHaveBeenCalledWith(partyA);
  });
});

// ── 2. Inline-create flow ─────────────────────────────────────────────────────

const createSchema = buildEntitySchema(
  { name: z.string().min(1) },
  { fieldMeta: { name: { label: 'Name', fieldType: 'text', required: true } } },
);

describe('inline-create', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows Create option when allowCreate=true and query is non-empty', async () => {
    const search = makeSearch([]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
        allowCreate
        createSchema={createSchema}
        onCreate={async () => partyA}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByText(/Create "new"/)).toBeTruthy();
  });

  it('opens create modal on Create option click', async () => {
    const search = makeSearch([]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
        allowCreate
        createSchema={createSchema}
        onCreate={async () => partyA}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'NewCo' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    fireEvent.mouseDown(screen.getByText(/Create "NewCo"/));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('calls onCreate and auto-selects result on form submit', async () => {
    // Use real timers for this test since waitFor polls with setTimeout
    vi.useRealTimers();
    const search = makeSearch([]);
    const onCreate = vi.fn().mockResolvedValue(partyA);
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={onChange}
        allowCreate
        createSchema={createSchema}
        onCreate={onCreate}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'NewCo' } });
    // With real timers wait for debounce + search promise
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeTruthy(), { timeout: 2000 });
    fireEvent.mouseDown(screen.getByText(/Create "NewCo"/));
    expect(screen.getByRole('dialog')).toBeTruthy();

    // Fill out the form inside the modal
    const nameInput = screen.getByRole('dialog').querySelector('input')!;
    fireEvent.change(nameInput, { target: { value: 'Alpha Corp' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      // Drain promise queue
      await new Promise((res) => setTimeout(res, 50));
    });
    expect(onCreate).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(partyA);
  });
});

// ── 3. Multi-select chips ─────────────────────────────────────────────────────

describe('multi-select', () => {
  it('renders chips for each selected item', () => {
    render(
      <EntityPicker
        search={async () => []}
        renderOption={renderOption}
        value={[partyA, partyB]}
        onChange={() => {}}
        multi
      />,
    );
    expect(screen.getByText('Alpha Corp')).toBeTruthy();
    expect(screen.getByText('Beta Ltd')).toBeTruthy();
  });

  it('removes a chip via X button', () => {
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={async () => []}
        renderOption={renderOption}
        value={[partyA, partyB]}
        onChange={onChange}
        multi
      />,
    );
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([partyB]);
  });

  it('onChange called with empty array when last chip removed', () => {
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={async () => []}
        renderOption={renderOption}
        value={[partyA]}
        onChange={onChange}
        multi
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

// ── 4. Clearing ───────────────────────────────────────────────────────────────

describe('clearing', () => {
  it('fires onChange(null) when clear button clicked in single mode', () => {
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={async () => []}
        renderOption={renderOption}
        value={partyA}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

// ── 5. a11y — ARIA combobox pattern ──────────────────────────────────────────

describe('a11y', () => {
  it('input wrapper has role=combobox with aria-expanded=false initially', () => {
    render(
      <EntityPicker
        search={async () => []}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
      />,
    );
    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(combobox.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('listbox is labelled and options have role=option', async () => {
    vi.useFakeTimers();
    const search = makeSearch([partyA]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'al' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Alpha Corp' })).toBeTruthy();
    vi.useRealTimers();
  });

  it('keyboard ArrowDown/Enter selects option', async () => {
    vi.useFakeTimers();
    const search = makeSearch([partyA]);
    const onChange = vi.fn();
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'al' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(partyA);
    vi.useRealTimers();
  });

  it('Escape closes the listbox', async () => {
    vi.useFakeTimers();
    const search = makeSearch([partyA]);
    render(
      <EntityPicker
        search={search}
        renderOption={renderOption}
        value={null}
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input')!;
    fireEvent.change(input, { target: { value: 'al' } });
    act(() => { vi.advanceTimersByTime(300); });
    await flushPromises();
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    vi.useRealTimers();
  });
});
