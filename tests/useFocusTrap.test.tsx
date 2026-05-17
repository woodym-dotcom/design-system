/**
 * useFocusTrap — Tab wraps; Shift+Tab wraps; restores focus on deactivate.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFocusTrap } from '../react/a11y/useFocusTrap';

function Trap({ active }: { active: boolean }) {
  const ref = useFocusTrap<HTMLDivElement>({ active });
  return (
    <div ref={ref} tabIndex={-1} data-testid="trap">
      <button>one</button>
      <button>two</button>
      <button>three</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the first focusable child on activation', () => {
    render(<Trap active />);
    expect(document.activeElement?.textContent).toBe('one');
  });

  it('Tab from the last focusable wraps back to the first', () => {
    render(<Trap active />);
    const three = screen.getByText('three');
    (three as HTMLButtonElement).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement?.textContent).toBe('one');
  });

  it('Shift+Tab from the first wraps to the last', () => {
    render(<Trap active />);
    const one = screen.getByText('one');
    (one as HTMLButtonElement).focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement?.textContent).toBe('three');
  });

  it('does not trap when inactive', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);
    render(<Trap active={false} />);
    outside.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    // The outside button stays focused — no trap engaged.
    expect(document.activeElement).toBe(outside);
    document.body.removeChild(outside);
  });

  it('restores focus to the previously-focused element on deactivation', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'opener';
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(<Trap active />);
    expect(document.activeElement?.textContent).toBe('one');
    rerender(<Trap active={false} />);
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });
});
