/**
 * Skeleton stories — text, circle, rect, multi-line.
 */
import * as React from 'react';
import { Skeleton } from '../react/Skeleton';

export default {
  title: 'Foundation/Skeleton',
  component: Skeleton,
};

export function Default() {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 360 }}>
      <Skeleton shape="text" />
      <Skeleton shape="text" lines={3} />
      <Skeleton shape="rect" width={240} height={48} />
      <Skeleton shape="circle" width={40} height={40} />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 8 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" width={32} height={32} />
          <div style={{ flex: 1 }}>
            <Skeleton shape="text" lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}
