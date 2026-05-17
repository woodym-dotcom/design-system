/**
 * FirstRunGuide — open step auto-selection, mark-done flow, onComplete,
 *                progress counter, controlled `done`, skip.
 */
import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FirstRunGuide, type FirstRunStep } from '../react/FirstRunGuide';

function baseSteps(handlers?: { onStep1?: () => void; onStep2?: () => void }): FirstRunStep[] {
  return [
    {
      id: 's1',
      title: 'Connect a data source',
      description: 'Hook up your warehouse to start.',
      action: { label: 'Connect', onClick: handlers?.onStep1 ?? (() => {}) },
    },
    {
      id: 's2',
      title: 'Invite your team',
      action: { label: 'Invite', onClick: handlers?.onStep2 ?? (() => {}) },
      skippable: true,
    },
  ];
}

describe('FirstRunGuide', () => {
  it('renders title, progress, and first step expanded', () => {
    render(<FirstRunGuide title="Welcome" steps={baseSteps()} />);
    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('0 of 2 complete')).toBeTruthy();
    // First step is the expanded one — aria-current="step"
    const items = screen.getAllByRole('listitem');
    expect(items[0].getAttribute('aria-current')).toBe('step');
    expect(items[1].getAttribute('aria-current')).toBeNull();
    // Body is only rendered for the expanded step
    expect(screen.getByText('Hook up your warehouse to start.')).toBeTruthy();
  });

  it('clicking primary action marks the step done and advances', async () => {
    const onStep1 = vi.fn();
    render(<FirstRunGuide title="t" steps={baseSteps({ onStep1 })} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    });
    expect(onStep1).toHaveBeenCalled();
    expect(screen.getByText('1 of 2 complete')).toBeTruthy();
    // Second step is now expanded
    const items = screen.getAllByRole('listitem');
    expect(items[1].getAttribute('aria-current')).toBe('step');
  });

  it('onComplete fires once when every step is done', async () => {
    const onComplete = vi.fn();
    render(<FirstRunGuide title="t" steps={baseSteps()} onComplete={onComplete} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Connect' })); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Invite' })); });
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  });

  it('skip action marks the step done without invoking primary', async () => {
    const onStep2 = vi.fn();
    render(<FirstRunGuide title="t" steps={baseSteps({ onStep2 })} />);
    // Complete step 1 first so step 2 is expanded.
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Connect' })); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Skip' })); });
    expect(onStep2).not.toHaveBeenCalled();
    expect(screen.getByText('2 of 2 complete')).toBeTruthy();
  });

  it('controlled `done` overrides internal state', () => {
    const steps: FirstRunStep[] = [
      { id: 'a', title: 'A', done: true, action: { label: 'A', onClick: () => {} } },
      { id: 'b', title: 'B', done: false, action: { label: 'B', onClick: () => {} } },
    ];
    render(<FirstRunGuide title="t" steps={steps} />);
    expect(screen.getByText('1 of 2 complete')).toBeTruthy();
    const items = screen.getAllByRole('listitem');
    expect(items[0].className).toContain('is-done');
    expect(items[1].getAttribute('aria-current')).toBe('step');
  });

  it('href action does not throw and marks done on click', () => {
    const steps: FirstRunStep[] = [
      { id: 'a', title: 'Read docs', action: { label: 'Open', href: '#x' } },
    ];
    render(<FirstRunGuide title="t" steps={steps} />);
    fireEvent.click(screen.getByRole('link', { name: 'Open' }));
    expect(screen.getByText('1 of 1 complete')).toBeTruthy();
  });
});
