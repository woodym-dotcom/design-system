/**
 * Stack stories — gap × align × divider matrix.
 */
import * as React from 'react';
import { Stack } from '../react/Stack';

export default {
  title: 'Layout/Stack',
  component: Stack,
};

const Box = ({ label }: { label: string }) => (
  <div
    style={{
      padding: '8px 12px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-1)',
      borderRadius: '4px',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-2)',
    }}
  >
    {label}
  </div>
);

export function GapVariants() {
  const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
  return (
    <div style={{ display: 'flex', gap: 32, padding: 24, flexWrap: 'wrap' }}>
      {gaps.map((gap) => (
        <div key={gap}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 8 }}>
            gap={gap}
          </div>
          <Stack gap={gap}>
            <Box label="Item 1" />
            <Box label="Item 2" />
            <Box label="Item 3" />
          </Stack>
        </div>
      ))}
    </div>
  );
}

export function AlignVariants() {
  const aligns = ['start', 'center', 'end', 'stretch'] as const;
  return (
    <div style={{ display: 'flex', gap: 32, padding: 24 }}>
      {aligns.map((align) => (
        <div key={align} style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 8 }}>
            align={align}
          </div>
          <Stack align={align} gap="sm" style={{ background: 'var(--surface-1)', padding: 8, borderRadius: 4 }}>
            <Box label="Short" />
            <Box label="A longer item" />
            <Box label="X" />
          </Stack>
        </div>
      ))}
    </div>
  );
}

export function WithDividers() {
  return (
    <div style={{ padding: 24, maxWidth: 300 }}>
      <Stack divider gap="none">
        <Box label="First section" />
        <Box label="Second section" />
        <Box label="Third section" />
      </Stack>
    </div>
  );
}

export function AsSection() {
  return (
    <div style={{ padding: 24, maxWidth: 300 }}>
      <Stack as="section" gap="sm">
        <Box label="Section item A" />
        <Box label="Section item B" />
      </Stack>
    </div>
  );
}
