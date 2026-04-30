/**
 * G4 regression: form-input stability invariants.
 *
 * Each test targets one named invariant from the G4 spec:
 *  1. No conditional unmount of input based on own value/error
 *  2. Stable React key (no remount on value/error change)
 *  3. Reserved error-slot height (slot always in DOM)
 *  4. Stable onChange handle identity
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormField } from '../react/FormField';

// ---------------------------------------------------------------------------
// Helper: controlled wrapper
// ---------------------------------------------------------------------------
function Controlled({
  onChange,
  initialError,
}: {
  onChange?: (v: string) => void;
  initialError?: string;
}) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(initialError ?? '');

  const handleChange = (v: string) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <>
      <FormField id="name" label="Name" value={value} onChange={handleChange} error={error} />
      <button onClick={() => setError('Required')}>set-error</button>
      <button onClick={() => setError('')}>clear-error</button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Invariant 1: input is never conditionally unmounted
// ---------------------------------------------------------------------------
describe('G4 invariant 1 — input never conditionally unmounted', () => {
  it('input stays mounted after typing', () => {
    render(<Controlled />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('input stays mounted when error appears', () => {
    render(<Controlled />);
    const input = screen.getByRole('textbox');
    act(() => screen.getByText('set-error').click());
    expect(input).toBeInTheDocument();
  });

  it('input stays mounted when error clears', () => {
    render(<Controlled initialError="Required" />);
    const input = screen.getByRole('textbox');
    act(() => screen.getByText('clear-error').click());
    expect(input).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Invariant 2: stable React key — no remount on value or error change
// ---------------------------------------------------------------------------
describe('G4 invariant 2 — stable React key, no remount', () => {
  it('same input DOM node survives value change', () => {
    render(<Controlled />);
    const before = screen.getByRole('textbox');
    fireEvent.change(before, { target: { value: 'abc' } });
    const after = screen.getByRole('textbox');
    expect(before).toBe(after);
  });

  it('same input DOM node survives error state toggle', () => {
    render(<Controlled />);
    const before = screen.getByRole('textbox');
    act(() => screen.getByText('set-error').click());
    act(() => screen.getByText('clear-error').click());
    const after = screen.getByRole('textbox');
    expect(before).toBe(after);
  });
});

// ---------------------------------------------------------------------------
// Invariant 3: error slot is always in the DOM (reserved height)
// ---------------------------------------------------------------------------
describe('G4 invariant 3 — error slot always in DOM', () => {
  it('slot element present before any error', () => {
    render(<Controlled />);
    // aria-describedby wires input to slot; slot must already exist
    const input = screen.getByRole('textbox');
    const slotId = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(slotId)).toBeInTheDocument();
  });

  it('slot element present when error is set', () => {
    render(<Controlled />);
    act(() => screen.getByText('set-error').click());
    const input = screen.getByRole('textbox');
    const slotId = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(slotId)).toBeInTheDocument();
  });

  it('slot contains error text when error is set', () => {
    render(<Controlled />);
    act(() => screen.getByText('set-error').click());
    const input = screen.getByRole('textbox');
    const slotId = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(slotId)?.textContent).toBe('Required');
  });

  it('slot is empty (not removed) when error is cleared', () => {
    render(<Controlled initialError="Required" />);
    act(() => screen.getByText('clear-error').click());
    const input = screen.getByRole('textbox');
    const slotId = input.getAttribute('aria-describedby')!;
    const slot = document.getElementById(slotId);
    expect(slot).toBeInTheDocument();
    expect(slot?.textContent).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Invariant 4: stable onChange handle — new function literals don't remount
// ---------------------------------------------------------------------------
describe('G4 invariant 4 — stable onChange handle identity', () => {
  it('calls the latest onChange even when parent re-renders with new function', () => {
    const calls: string[] = [];

    function Parent() {
      const [count, setCount] = React.useState(0);
      const [value, setValue] = React.useState('');
      // New function literal on every render — intentional stress test
      const onChange = (v: string) => {
        calls.push(`render-${count}:${v}`);
        setValue(v);
      };
      return (
        <>
          <FormField id="name" label="Name" value={value} onChange={onChange} />
          <button onClick={() => setCount((c) => c + 1)}>re-render</button>
        </>
      );
    }

    render(<Parent />);
    // Cause parent re-render (new onChange function literal)
    act(() => screen.getByText('re-render').click());
    // Now type — must call latest onChange
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
    // The call must have the latest render index (1), not the stale one (0)
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBe('render-1:x');
  });
});

// ---------------------------------------------------------------------------
// Accessibility invariants
// ---------------------------------------------------------------------------
describe('G4 accessibility', () => {
  it('aria-invalid is set when error present', () => {
    render(<FormField id="f" label="L" value="" onChange={() => {}} error="Oops" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('aria-invalid absent when no error', () => {
    render(<FormField id="f" label="L" value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('required marker rendered', () => {
    render(<FormField id="f" label="Name" value="" onChange={() => {}} required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('required');
  });
});
