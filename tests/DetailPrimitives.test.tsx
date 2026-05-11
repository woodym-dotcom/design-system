/**
 * DetailRow / DetailSection / DetailMetric — drill-down detail primitives.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  DetailRow,
  DetailSection,
  DetailMetric,
} from '../react/DetailPrimitives';

describe('DetailRow', () => {
  it('renders label and value', () => {
    render(<DetailRow label="Registered office">42 King St</DetailRow>);
    expect(screen.getByText('Registered office')).toBeInTheDocument();
    expect(screen.getByText('42 King St')).toBeInTheDocument();
  });

  it('hides empty values by default', () => {
    const { container } = render(
      <DetailRow label="VAT number">{null}</DetailRow>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders empty value when showEmpty=true', () => {
    render(
      <DetailRow label="VAT number" showEmpty>
        {null}
      </DetailRow>,
    );
    expect(screen.getByText('VAT number')).toBeInTheDocument();
  });
});

describe('DetailSection', () => {
  it('returns nothing when empty=true', () => {
    const { container } = render(
      <DetailSection title="Branches" empty>
        <div>hidden</div>
      </DetailSection>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('inline section renders body without chevron when no summary', () => {
    render(
      <DetailSection title="Branches">
        <div>row 1</div>
      </DetailSection>,
    );
    expect(screen.getByText('row 1')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('collapsible section toggles body on click', () => {
    render(
      <DetailSection title="Branches" summary="3 branches">
        <div>row 1</div>
      </DetailSection>,
    );
    expect(screen.queryByText('row 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('row 1')).toBeInTheDocument();
  });
});

describe('DetailMetric', () => {
  it('renders label and value', () => {
    render(<DetailMetric label="Open obligations" value={42} />);
    expect(screen.getByText('Open obligations')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('drill-down expands detail content on click', () => {
    render(
      <DetailMetric
        label="Open obligations"
        value={42}
        detail={<div>obligation breakdown</div>}
      />,
    );
    expect(screen.queryByText('obligation breakdown')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('obligation breakdown')).toBeInTheDocument();
  });

  it('header is disabled when no detail provided', () => {
    render(<DetailMetric label="Open obligations" value={42} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
