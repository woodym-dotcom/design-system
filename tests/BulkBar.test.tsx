/**
 * BulkBar — hidden when count=0, renders actions, danger tone applied.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulkBar } from '../react/BulkBar';

describe('BulkBar', () => {
  it('renders nothing when count is 0', () => {
    const { container } = render(<BulkBar count={0} onClear={() => {}} actions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders count and actions when count > 0', () => {
    const archive = vi.fn();
    render(
      <BulkBar
        count={3}
        onClear={() => {}}
        actions={[{ id: 'a', label: 'Archive', onClick: archive }]}
      />,
    );
    expect(screen.getByText('3 selected')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(archive).toHaveBeenCalled();
  });

  it('clear button calls onClear', () => {
    const onClear = vi.fn();
    render(<BulkBar count={1} onClear={onClear} actions={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('danger tone applied to action button', () => {
    render(
      <BulkBar
        count={1}
        onClear={() => {}}
        actions={[{ id: 'd', label: 'Delete', onClick: () => {}, tone: 'danger' }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('cc-bulkbar__action--danger');
  });

  it('disabled action is not clickable', () => {
    const onClick = vi.fn();
    render(
      <BulkBar
        count={1}
        onClear={() => {}}
        actions={[{ id: 'x', label: 'Nope', onClick, disabled: true }]}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Nope' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
