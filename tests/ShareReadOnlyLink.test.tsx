/**
 * ShareReadOnlyLink — copy button calls clipboard, inline shows URL.
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShareReadOnlyLink } from '../react/ShareReadOnlyLink';
import { ToastProvider } from '../react/Toast';

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

describe('ShareReadOnlyLink', () => {
  it('renders a button by default', () => {
    render(
      <ToastProvider>
        <ShareReadOnlyLink url="https://x.test/view?id=1" />
      </ToastProvider>,
    );
    expect(screen.getByRole('button', { name: /Copy shareable link/ })).toBeTruthy();
  });

  it('inline variant renders the URL', () => {
    render(
      <ToastProvider>
        <ShareReadOnlyLink url="https://x.test/v" variant="inline" />
      </ToastProvider>,
    );
    const input = screen.getByDisplayValue('https://x.test/v') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('copy writes to navigator.clipboard', async () => {
    const onCopied = vi.fn();
    render(
      <ToastProvider>
        <ShareReadOnlyLink url="https://x.test/v" onCopied={onCopied} />
      </ToastProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Copy shareable link/ }));
    });
    expect((navigator.clipboard.writeText as any)).toHaveBeenCalledWith('https://x.test/v');
    expect(onCopied).toHaveBeenCalled();
  });
});
