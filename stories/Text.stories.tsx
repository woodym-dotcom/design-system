/**
 * Text stories — size × weight × tone × truncate matrix.
 */
import * as React from 'react';
import { Text } from '../react/Text';

export default {
  title: 'Layout/Text',
  component: Text,
};

export function SizeVariants() {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}>
      {sizes.map((size) => (
        <Text key={size} as="p" size={size}>
          size={size} — The quick brown fox jumps over the lazy dog
        </Text>
      ))}
    </div>
  );
}

export function WeightVariants() {
  const weights = ['normal', 'medium', 'semibold', 'bold'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}>
      {weights.map((weight) => (
        <Text key={weight} as="p" weight={weight}>
          weight={weight} — The quick brown fox jumps over the lazy dog
        </Text>
      ))}
    </div>
  );
}

export function ToneVariants() {
  const tones = ['default', 'muted', 'subtle', 'success', 'warning', 'danger'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}>
      {tones.map((tone) => (
        <Text key={tone} as="p" tone={tone}>
          tone={tone} — The quick brown fox jumps over the lazy dog
        </Text>
      ))}
    </div>
  );
}

export function TruncateSingleLine() {
  return (
    <div style={{ padding: 24, maxWidth: 300 }}>
      <Text as="p" truncate>
        This is a very long text that should be truncated to a single line with an ellipsis at the end
      </Text>
    </div>
  );
}

export function TruncateMultiLine() {
  return (
    <div style={{ padding: 24, maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[2, 3, 4].map((lines) => (
        <div key={lines}>
          <Text size="xs" tone="muted" as="p">truncate={lines}</Text>
          <Text as="p" truncate={lines}>
            This is a long text that should be clamped to {lines} lines. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </Text>
        </div>
      ))}
    </div>
  );
}

export function AsVariants() {
  const elements = ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'label'] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24 }}>
      {elements.map((el) => (
        <Text key={el} as={el} size="sm">
          as={el} — rendered as &lt;{el}&gt;
        </Text>
      ))}
    </div>
  );
}
