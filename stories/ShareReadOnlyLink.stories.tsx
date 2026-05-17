/**
 * ShareReadOnlyLink stories — button + inline.
 */
import * as React from 'react';
import { ShareReadOnlyLink } from '../react/ShareReadOnlyLink';
import { ToastProvider } from '../react/Toast';

export default {
  title: 'Foundation/ShareReadOnlyLink',
  component: ShareReadOnlyLink,
};

export function Button() {
  return (
    <ToastProvider>
      <div style={{ padding: 24 }}>
        <ShareReadOnlyLink url="https://app.example/vendors?status=open&owner=me" />
      </div>
    </ToastProvider>
  );
}

export function Inline() {
  return (
    <ToastProvider>
      <div style={{ padding: 24, maxWidth: 560 }}>
        <ShareReadOnlyLink
          url="https://app.example/vendors?status=open&owner=me"
          variant="inline"
          helpText="Read-only — anyone with the link can open this view (subject to access policies)."
        />
      </div>
    </ToastProvider>
  );
}
