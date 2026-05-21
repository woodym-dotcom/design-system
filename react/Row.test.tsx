import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row } from './Row';

describe('Row', () => {
  it('renders children in a flex row', () => {
    render(
      <Row>
        <span>A</span>
        <span>B</span>
      </Row>,
    );
    const el = screen.getByText('A').parentElement!;
    expect(el.style.display).toBe('flex');
    expect(el.style.flexDirection).toBe('row');
  });

  it('applies gap token for md (default)', () => {
    render(
      <Row gap="md">
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.style.gap).toBe('var(--space-5)');
  });

  it('applies justify=between', () => {
    render(
      <Row justify="between">
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.style.justifyContent).toBe('space-between');
  });

  it('applies align=baseline', () => {
    render(
      <Row align="baseline">
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.style.alignItems).toBe('baseline');
  });

  it('sets flex-wrap when wrap=true', () => {
    render(
      <Row wrap>
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.style.flexWrap).toBe('wrap');
  });

  it('no flex-wrap by default', () => {
    render(
      <Row>
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.style.flexWrap).toBe('nowrap');
  });

  it('renders as a different element with as prop', () => {
    render(
      <Row as="nav">
        <span>N</span>
      </Row>,
    );
    expect(screen.getByText('N').parentElement!.tagName).toBe('NAV');
  });

  it('applies custom className', () => {
    render(
      <Row className="my-row">
        <span>A</span>
      </Row>,
    );
    expect(screen.getByText('A').parentElement!.className).toBe('my-row');
  });
});
