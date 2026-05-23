/**
 * Printable + PrintHeader + PrintFooter + ShareableSnapshotButton.
 *
 * Printable marks a region as the print target. PrintHeader / PrintFooter
 * render provenance trails (who-when-which-version) for the printed
 * document. ShareableSnapshotButton launches a modal that mints a signed
 * read-only URL via an injected `onMintToken` async callback (the DS
 * doesn't talk to the backend; the consumer wires the mint endpoint).
 */
import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Printable,
  PrintHeader,
  PrintFooter,
  ShareableSnapshotButton,
  type SnapshotMintRequest,
  type SnapshotMintResult,
} from '../react/Printable';

describe('Printable', () => {
  it('renders a wrapped region with the print marker class', () => {
    const { container } = render(
      <Printable>
        <p>Body content</p>
      </Printable>,
    );
    const region = container.querySelector('.cc-printable');
    expect(region).not.toBeNull();
    expect(region!.textContent).toContain('Body content');
  });

  it('renders the optional header and footer regions when provided', () => {
    render(
      <Printable
        header={<PrintHeader title="Decision Record" generatedAt={new Date('2026-05-23T15:00:00Z')} pageNumber={1} totalPages={3} />}
        footer={<PrintFooter generatedBy="Auditor #42" version="v3.7" />}
      >
        <p>Body</p>
      </Printable>,
    );
    expect(screen.getByText('Decision Record')).toBeTruthy();
    expect(screen.getByText(/Page 1 of 3/)).toBeTruthy();
    expect(screen.getByText(/Auditor #42/)).toBeTruthy();
    expect(screen.getByText(/v3\.7/)).toBeTruthy();
  });

  it('marks the region with data-print-target so the @media print stylesheet can target it', () => {
    const { container } = render(
      <Printable>
        <p>Body</p>
      </Printable>,
    );
    const region = container.querySelector('[data-print-target]');
    expect(region).not.toBeNull();
  });

  it('honours the exportFormat prop and surfaces it on the dataset', () => {
    const { container } = render(
      <Printable exportFormat="pdf">
        <p>Body</p>
      </Printable>,
    );
    const region = container.querySelector('.cc-printable');
    expect(region!.getAttribute('data-export-format')).toBe('pdf');
  });
});

describe('PrintHeader', () => {
  it('renders title + Page n of m', () => {
    render(<PrintHeader title="Evidence Bundle" pageNumber={2} totalPages={5} />);
    expect(screen.getByText('Evidence Bundle')).toBeTruthy();
    expect(screen.getByText(/Page 2 of 5/)).toBeTruthy();
  });

  it('renders the generatedAt timestamp as an ISO time element', () => {
    const at = new Date('2026-05-23T15:00:00Z');
    const { container } = render(<PrintHeader title="X" generatedAt={at} />);
    const t = container.querySelector('time');
    expect(t).not.toBeNull();
    expect(t!.getAttribute('dateTime')).toBe(at.toISOString());
  });
});

describe('PrintFooter', () => {
  it('renders provenance line with generatedBy + version', () => {
    render(<PrintFooter generatedBy="Auditor #42" version="v3.7" />);
    expect(screen.getByText(/Auditor #42/)).toBeTruthy();
    expect(screen.getByText(/v3\.7/)).toBeTruthy();
  });
});

describe('ShareableSnapshotButton', () => {
  function mintOk(): Promise<SnapshotMintResult> {
    return Promise.resolve({
      url: 'https://app.example/shared/abc.def',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  it('shows the trigger label and renders nothing else until clicked', () => {
    render(<ShareableSnapshotButton onMintToken={mintOk} resourceLabel="Decision Record" />);
    expect(screen.getByRole('button', { name: /share/i })).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens a modal when clicked', () => {
    render(<ShareableSnapshotButton onMintToken={mintOk} resourceLabel="Decision Record" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/Decision Record/i)).toBeTruthy();
  });

  it('calls onMintToken with the chosen expiry + scope when the user confirms', async () => {
    const mintSpy = vi.fn(mintOk);
    render(
      <ShareableSnapshotButton
        onMintToken={mintSpy}
        resourceLabel="Decision Record"
        defaultExpiryDays={14}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /generate link/i }));
    });
    expect(mintSpy).toHaveBeenCalledTimes(1);
    const req: SnapshotMintRequest = mintSpy.mock.calls[0][0];
    expect(req.expiryDays).toBe(14);
    expect(req.resourceLabel).toBe('Decision Record');
  });

  it('renders the minted URL inline for copy after a successful mint', async () => {
    render(<ShareableSnapshotButton onMintToken={mintOk} resourceLabel="X" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /generate link/i }));
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue(/https:\/\/app\.example\/shared/)).toBeTruthy();
    });
  });

  it('surfaces a failure message when onMintToken rejects', async () => {
    const failing = vi.fn(async () => {
      throw new Error('Forbidden');
    });
    render(<ShareableSnapshotButton onMintToken={failing} resourceLabel="X" />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /generate link/i }));
    });
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/Forbidden/);
    });
  });
});
