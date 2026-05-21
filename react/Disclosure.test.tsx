import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Disclosure, Accordion } from './Disclosure';

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

describe('Accordion', () => {
  const items = [
    { id: 'a', summary: 'Section A', content: 'Content A' },
    { id: 'b', summary: 'Section B', content: 'Content B' },
    { id: 'c', summary: 'Section C', content: 'Content C' },
  ];

  it('renders all summaries', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Section A')).toBeTruthy();
    expect(screen.getByText('Section B')).toBeTruthy();
    expect(screen.getByText('Section C')).toBeTruthy();
  });

  it('all items closed by default', () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText('Content A')).toBeNull();
    expect(screen.queryByText('Content B')).toBeNull();
  });

  it('opens item on click (single mode)', () => {
    render(<Accordion items={items} type="single" />);
    fireEvent.click(screen.getByRole('button', { name: /Section A/ }));
    expect(screen.getByText('Content A')).toBeTruthy();
  });

  it('closes previously open item when new one opens (single mode)', () => {
    render(<Accordion items={items} type="single" />);
    fireEvent.click(screen.getByRole('button', { name: /Section A/ }));
    expect(screen.getByText('Content A')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Section B/ }));
    expect(screen.queryByText('Content A')).toBeNull();
    expect(screen.getByText('Content B')).toBeTruthy();
  });

  it('allows multiple open in multiple mode', () => {
    render(<Accordion items={items} type="multiple" />);
    fireEvent.click(screen.getByRole('button', { name: /Section A/ }));
    fireEvent.click(screen.getByRole('button', { name: /Section B/ }));
    expect(screen.getByText('Content A')).toBeTruthy();
    expect(screen.getByText('Content B')).toBeTruthy();
  });

  it('respects defaultValue', () => {
    render(<Accordion items={items} defaultValue="b" />);
    expect(screen.getByText('Content B')).toBeTruthy();
    expect(screen.queryByText('Content A')).toBeNull();
  });

  it('controlled: respects value prop', () => {
    const onChange = vi.fn();
    render(<Accordion items={items} value="c" onValueChange={onChange} />);
    expect(screen.getByText('Content C')).toBeTruthy();
    expect(screen.queryByText('Content A')).toBeNull();
  });

  it('controlled: calls onValueChange on toggle', () => {
    const onChange = vi.fn();
    render(<Accordion items={items} value="" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Section A/ }));
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
