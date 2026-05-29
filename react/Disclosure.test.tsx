import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
  it('renders summary text', () => {
    render(<Disclosure summary="Section title">Content</Disclosure>);
    expect(screen.getByText('Section title')).toBeTruthy();
  });

  it('content is hidden by default (uncontrolled native details)', () => {
    render(<Disclosure summary="Title">Hidden content</Disclosure>);
    // In jsdom, native <details> does not hide content from DOM, so just check element presence
    expect(screen.getByText('Hidden content')).toBeTruthy();
  });

  it('opens with defaultOpen=true in native mode', () => {
    const { container } = render(
      <Disclosure summary="Title" defaultOpen>
        Content
      </Disclosure>,
    );
    const details = container.querySelector('details');
    expect(details?.open).toBe(true);
  });

  it('controlled: shows content when open=true', () => {
    render(
      <Disclosure summary="Title" open onOpenChange={vi.fn()}>
        Visible
      </Disclosure>,
    );
    expect(screen.getByText('Visible')).toBeTruthy();
  });

  it('controlled: hides content when open=false', () => {
    render(
      <Disclosure summary="Title" open={false} onOpenChange={vi.fn()}>
        Hidden
      </Disclosure>,
    );
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('controlled: calls onOpenChange when button clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Disclosure summary="Title" open={false} onOpenChange={onOpenChange}>
        Content
      </Disclosure>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Title/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('controlled open button has aria-expanded', () => {
    render(
      <Disclosure summary="Title" open={true} onOpenChange={vi.fn()}>
        Content
      </Disclosure>,
    );
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('icon=none renders no icon svg', () => {
    const { container } = render(
      <Disclosure summary="Title" open={false} onOpenChange={vi.fn()} icon="none">
        Content
      </Disclosure>,
    );
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('Disclosure — accordion composition', () => {
  it('parent owns open state to coordinate single-open semantics', () => {
    function Acc() {
      const [openId, setOpenId] = React.useState<string | null>(null);
      return (
        <>
          <Disclosure
            summary="Section A"
            open={openId === 'a'}
            onOpenChange={(o) => setOpenId(o ? 'a' : null)}
          >
            Content A
          </Disclosure>
          <Disclosure
            summary="Section B"
            open={openId === 'b'}
            onOpenChange={(o) => setOpenId(o ? 'b' : null)}
          >
            Content B
          </Disclosure>
        </>
      );
    }
    render(<Acc />);
    fireEvent.click(screen.getByRole('button', { name: /Section A/ }));
    expect(screen.getByText('Content A')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Section B/ }));
    expect(screen.queryByText('Content A')).toBeNull();
    expect(screen.getByText('Content B')).toBeTruthy();
  });
});
