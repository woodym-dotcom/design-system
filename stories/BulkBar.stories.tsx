/**
 * BulkBar stories — hidden / shown / danger action / disabled.
 */
import * as React from 'react';
import { BulkBar } from '../react/BulkBar';

export default {
  title: 'Foundation/BulkBar',
  component: BulkBar,
};

export function Default() {
  return (
    <div style={{ padding: 24 }}>
      <BulkBar
        count={3}
        onClear={() => {}}
        actions={[
          { id: 'archive', label: 'Archive', onClick: () => {} },
          { id: 'tag', label: 'Tag', onClick: () => {} },
          { id: 'delete', label: 'Delete', onClick: () => {}, tone: 'danger' },
        ]}
      />
    </div>
  );
}

export function WithMeta() {
  return (
    <div style={{ padding: 24 }}>
      <BulkBar
        count={42}
        onClear={() => {}}
        meta="across 3 pages"
        actions={[
          { id: 'export', label: 'Export CSV', onClick: () => {}, tone: 'primary' },
          { id: 'reassign', label: 'Reassign owner', onClick: () => {}, disabled: true },
        ]}
      />
    </div>
  );
}
