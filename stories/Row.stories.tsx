/**
 * Row stories — gap × align × justify × wrap matrix.
 */
import * as React from 'react';
import { Row } from '../react/Row';

export default {
  title: 'Layout/Row',
  component: Row,
};

const Box = ({ label, wide }: { label: string; wide?: boolean }) => (
  <div
    style={{
      padding: '8px 12px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-1)',
      borderRadius: '4px',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-2)',
      width: wide ? 120 : undefined,
    }}
  >
    {label}
  </div>
);

export function GapVariants() {
  const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      {gaps.map((gap) => (
        <div key={gap}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4 }}>
            gap={gap}
          </div>
          <Row gap={gap}>
            <Box label="Item 1" />
            <Box label="Item 2" />
            <Box label="Item 3" />
          </Row>
        </div>
      ))}
    </div>
  );
}

export function AlignVariants() {
  const aligns = ['start', 'center', 'end', 'baseline'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      {aligns.map((align) => (
        <div key={align}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4 }}>
            align={align}
          </div>
          <Row align={align} gap="sm" style={{ background: 'var(--surface-1)', padding: 8, borderRadius: 4 }}>
            <div style={{ height: 32, width: 60, background: 'var(--surface-3)', borderRadius: 4 }} />
            <div style={{ height: 48, width: 60, background: 'var(--surface-3)', borderRadius: 4 }} />
            <div style={{ height: 24, width: 60, background: 'var(--surface-3)', borderRadius: 4 }} />
          </Row>
        </div>
      ))}
    </div>
  );
}

export function JustifyVariants() {
  const justifies = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      {justifies.map((justify) => (
        <div key={justify}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4 }}>
            justify={justify}
          </div>
          <Row justify={justify} gap="none" style={{ background: 'var(--surface-1)', padding: 8, borderRadius: 4, width: '100%' }}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Row>
        </div>
      ))}
    </div>
  );
}

export function WrapVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 400 }}>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4 }}>wrap=false (default)</div>
        <Row wrap={false} gap="sm" style={{ background: 'var(--surface-1)', padding: 8, borderRadius: 4, overflow: 'hidden' }}>
          {Array.from({ length: 8 }).map((_, i) => <Box key={i} label={`Item ${i + 1}`} wide />)}
        </Row>
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4 }}>wrap=true</div>
        <Row wrap gap="sm" style={{ background: 'var(--surface-1)', padding: 8, borderRadius: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => <Box key={i} label={`Item ${i + 1}`} wide />)}
        </Row>
      </div>
    </div>
  );
}
