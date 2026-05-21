/**
 * CommandPalette — opens, filters, arrow-navigates, enters selection,
 * filter chips, and custom renderItem.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CommandPalette, type CommandItem } from '../react/CommandPalette';

afterEach(() => { document.body.style.overflow = ''; });

const items = (run: () => void): CommandItem[] => [
  { id: 'home', label: 'Go home', group: 'Navigate', onSelect: run, keywords: ['root', 'dashboard'] },
  { id: 'newv', label: 'New vendor', group: 'Actions', onSelect: run },
  { id: 'newm', label: 'New model', group: 'Actions', onSelect: run, shortcut: ['mod', 'm'] },
];

const FILTER_TYPES = [
  { key: 'Navigate' as const, label: 'Navigate' },
  { key: 'Actions' as const, label: 'Actions' },
];

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onClose={() => {}} items={[]} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders items grouped by group label', () => {
    render(<CommandPalette open onClose={() => {}} items={items(() => {})} />);
    expect(screen.getByText('Navigate')).toBeTruthy();
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(screen.getByRole('option', { name: /Go home/ })).toBeTruthy();
  });

  it('filters items by label substring', () => {
    render(<CommandPalette open onClose={() => {}} items={items(() => {})} />);
    const input = screen.getByLabelText('Search commands…') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'vendor' } });
    expect(screen.queryByRole('option', { name: /Go home/ })).toBeNull();
    expect(screen.getByRole('option', { name: /New vendor/ })).toBeTruthy();
  });

  it('filters by keyword', () => {
    render(<CommandPalette open onClose={() => {}} items={items(() => {})} />);
    const input = screen.getByLabelText('Search commands…') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'dashboard' } });
    expect(screen.getByRole('option', { name: /Go home/ })).toBeTruthy();
  });

  it('Enter selects the active item and closes', () => {
    const run = vi.fn();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items(run)} />);
    const input = screen.getByLabelText('Search commands…') as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: 'home' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });

  it('ArrowDown moves the active option', () => {
    const run = vi.fn();
    render(<CommandPalette open onClose={() => {}} items={items(run)} />);
    const input = screen.getByLabelText('Search commands…') as HTMLInputElement;
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(run).toHaveBeenCalled();
  });

  it('shows empty message when nothing matches', () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        emptyMessage="Nada"
      />,
    );
    const input = screen.getByLabelText('Search commands…') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'xyzzy' } });
    expect(screen.getByText('Nada')).toBeTruthy();
  });
});

describe('CommandPalette — filter chips', () => {
  it('renders filter chips when filterTypes is provided', () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        filterTypes={FILTER_TYPES}
      />,
    );
    expect(screen.getByRole('button', { name: 'All' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Navigate' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Actions' })).toBeTruthy();
  });

  it('clicking a chip scopes results to that group', () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        filterTypes={FILTER_TYPES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Navigate' }));
    expect(screen.getByRole('option', { name: /Go home/ })).toBeTruthy();
    expect(screen.queryByRole('option', { name: /New vendor/ })).toBeNull();
    expect(screen.queryByRole('option', { name: /New model/ })).toBeNull();
  });

  it('clicking All chip restores all results', () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        filterTypes={FILTER_TYPES}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByRole('option', { name: /Go home/ })).toBeTruthy();
    expect(screen.getByRole('option', { name: /New vendor/ })).toBeTruthy();
  });

  it('fires onFilterTypeChange when a chip is clicked', () => {
    const onChange = vi.fn();
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        filterTypes={FILTER_TYPES}
        onFilterTypeChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onChange).toHaveBeenCalledWith('Actions');
  });

  it('fires onFilterTypeChange with "all" when All chip clicked', () => {
    const onChange = vi.fn();
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        filterTypes={FILTER_TYPES}
        onFilterTypeChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(onChange).toHaveBeenLastCalledWith('all');
  });

  it('does not render filter chips when filterTypes is not provided', () => {
    render(
      <CommandPalette open onClose={() => {}} items={items(() => {})} />,
    );
    expect(screen.queryByRole('button', { name: 'All' })).toBeNull();
  });
});

describe('CommandPalette — renderItem', () => {
  it('uses renderItem callback when provided', () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={items(() => {})}
        renderItem={(item) => <span data-testid="custom">{item.label} (custom)</span>}
      />,
    );
    const customs = screen.getAllByTestId('custom');
    expect(customs.length).toBe(3);
    expect(customs[0].textContent).toContain('(custom)');
  });

  it('falls back to default rendering when renderItem is not provided', () => {
    render(
      <CommandPalette open onClose={() => {}} items={items(() => {})} />,
    );
    expect(screen.queryAllByTestId('custom')).toHaveLength(0);
    expect(screen.getByRole('option', { name: /Go home/ })).toBeTruthy();
  });
});
