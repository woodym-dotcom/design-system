/// <reference types="@testing-library/jest-dom" />
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Menu, MenuItem, MenuSeparator, MenuLabel } from './Menu';

function BasicMenu(props: { closeOnSelect?: boolean; onOpenChange?: (o: boolean) => void }) {
  return (
    <Menu trigger={<button>Open</button>} {...props}>
      <MenuItem onSelect={vi.fn()}>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
    </Menu>
  );
}

describe('Menu', () => {
  it('renders the trigger', () => {
    render(<BasicMenu />);
    expect(screen.getByRole('button', { name: 'Open' })).toBeTruthy();
  });

  it('is closed by default', () => {
    render(<BasicMenu />);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens on trigger click', () => {
    render(<BasicMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('closes on second trigger click', () => {
    render(<BasicMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on ESC', () => {
    render(<BasicMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('calls onOpenChange on open', () => {
    const onOpenChange = vi.fn();
    render(<BasicMenu onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders menuitems inside the menu', () => {
    render(<BasicMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('trigger has aria-haspopup=menu', () => {
    render(<BasicMenu />);
    expect(screen.getByRole('button', { name: 'Open' }).getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger has aria-expanded=false when closed', () => {
    render(<BasicMenu />);
    expect(screen.getByRole('button', { name: 'Open' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger has aria-expanded=true when open', () => {
    render(<BasicMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Open' }).getAttribute('aria-expanded')).toBe('true');
  });

  it('calls onSelect when item is clicked', () => {
    const onSelect = vi.fn();
    render(
      <Menu trigger={<button>Open</button>}>
        <MenuItem onSelect={onSelect}>Action</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(onSelect).toHaveBeenCalled();
  });

  it('closes after item select when closeOnSelect=true', () => {
    render(
      <Menu trigger={<button>Open</button>} closeOnSelect>
        <MenuItem onSelect={vi.fn()}>Action</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('stays open after item select when closeOnSelect=false', () => {
    render(
      <Menu trigger={<button>Open</button>} closeOnSelect={false}>
        <MenuItem>Persist</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Persist' }));
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('disabled item cannot be activated', () => {
    const onSelect = vi.fn();
    render(
      <Menu trigger={<button>Open</button>}>
        <MenuItem disabled onSelect={onSelect}>Disabled</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const item = screen.getByRole('menuitem', { name: 'Disabled' });
    expect(item).toBeDisabled();
  });

  it('renders MenuSeparator with role=separator', () => {
    render(
      <Menu trigger={<button>Open</button>}>
        <MenuItem>A</MenuItem>
        <MenuSeparator />
        <MenuItem>B</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  it('renders MenuLabel', () => {
    render(
      <Menu trigger={<button>Open</button>}>
        <MenuLabel>Section</MenuLabel>
        <MenuItem>A</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Section')).toBeTruthy();
  });

  it('renders MenuItem as anchor when href is provided', () => {
    render(
      <Menu trigger={<button>Open</button>}>
        <MenuItem href="/path">Link Item</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const link = screen.getByRole('menuitem', { name: 'Link Item' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/path');
  });
});
