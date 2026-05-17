/**
 * Tooltip — opens on hover/focus, closes on blur/leave/ESC, wires aria-describedby.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Tooltip } from '../react/Tooltip';

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the trigger child', () => {
    render(
      <Tooltip label="help">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeTruthy();
  });

  it('opens after delay on hover and exposes role=tooltip', () => {
    render(<Tooltip label="help" delayMs={100}><button>T</button></Tooltip>);
    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);
    act(() => { vi.advanceTimersByTime(120); });
    expect(screen.getByRole('tooltip').className).toContain('is-open');
  });

  it('wires aria-describedby when open', () => {
    render(<Tooltip label="info" delayMs={0}><button>X</button></Tooltip>);
    const trigger = screen.getByRole('button');
    fireEvent.focus(trigger);
    act(() => { vi.advanceTimersByTime(5); });
    const id = trigger.getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe('info');
  });

  it('closes on Escape', () => {
    render(<Tooltip label="?" delayMs={0}><button>e</button></Tooltip>);
    fireEvent.focus(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime(5); });
    expect(screen.getByRole('tooltip').className).toContain('is-open');
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    // After close, aria-hidden flips to true so query with { hidden: true }.
    expect(screen.getByRole('tooltip', { hidden: true }).className).not.toContain('is-open');
  });
});
