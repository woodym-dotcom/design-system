/**
 * CompanyGroupSwitcher tests.
 *
 * Contract:
 *  (a) Renders current group initials + name in trigger.
 *  (b) Opens dropdown on click / Enter / Space.
 *  (c) Lists all memberships as role=option items.
 *  (d) Calls onChange with the selected UUID.
 *  (e) Closes on Escape.
 *  (f) Shows search input only when memberships.length > 5.
 *  (g) Filters options as user types in search.
 *  (h) Keyboard navigation: ArrowDown/ArrowUp moves focus, Enter selects.
 *  (i) a11y: no axe violations.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { CompanyGroupSwitcher } from '../react/CompanyGroupSwitcher';

const FEW = [
  { companyGroupUuid: 'uuid-acme', name: 'Acme Corp' },
  { companyGroupUuid: 'uuid-globex', name: 'Globex Industries' },
  { companyGroupUuid: 'uuid-initech', name: 'Initech' },
];

const MANY = [
  { companyGroupUuid: 'uuid-acme', name: 'Acme Corp' },
  { companyGroupUuid: 'uuid-globex', name: 'Globex Industries' },
  { companyGroupUuid: 'uuid-initech', name: 'Initech' },
  { companyGroupUuid: 'uuid-umbrella', name: 'Umbrella Ltd' },
  { companyGroupUuid: 'uuid-stark', name: 'Stark Enterprises' },
  { companyGroupUuid: 'uuid-wayne', name: 'Wayne Industries' },
];

// ---------------------------------------------------------------------------
// (a) Trigger rendering
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher trigger', () => {
  it('shows initials of current group', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
  });

  it('shows group name in trigger', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('shows ? when currentGroupUuid is null', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid={null}
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('shows … when loading', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid={null}
        memberships={[]}
        onChange={() => undefined}
        loading
      />,
    );
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  it('trigger has combobox role with aria-haspopup=listbox', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------------------------
// (b) Opens on click
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher open/close', () => {
  it('opens dropdown on click', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes dropdown on second click', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// (c) Lists all memberships
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher options', () => {
  it('renders all memberships as role=option', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(FEW.length);
  });

  it('active option has aria-selected=true', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const selected = screen.getAllByRole('option').filter(
      (el) => el.getAttribute('aria-selected') === 'true',
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Acme Corp');
  });
});

// ---------------------------------------------------------------------------
// (d) onChange called on selection
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher onChange', () => {
  it('calls onChange with UUID when option clicked', () => {
    const onChange = vi.fn();
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getAllByRole('option')[1]);
    expect(onChange).toHaveBeenCalledWith('uuid-globex');
  });

  it('closes dropdown after selection', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getAllByRole('option')[1]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// (f) Search threshold
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher search', () => {
  it('does NOT show search when memberships.length <= 5', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('shows search input when memberships.length > 5', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={MANY}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('filters options when user types in search', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={MANY}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Globex' } });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Globex Industries');
  });

  it('shows "No groups match" when filter yields empty', () => {
    render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={MANY}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'zzznomatch' },
    });
    expect(screen.getByText('No groups match')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// (i) a11y — axe
// ---------------------------------------------------------------------------
describe('CompanyGroupSwitcher a11y', () => {
  it('trigger has no axe violations (closed)', async () => {
    const { container } = render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('has no axe violations when open', async () => {
    const { container } = render(
      <CompanyGroupSwitcher
        currentGroupUuid="uuid-acme"
        memberships={FEW}
        onChange={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
