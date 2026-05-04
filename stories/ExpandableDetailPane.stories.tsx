/**
 * ExpandableDetailPane stories — Storybook CSF v3 format.
 */
import * as React from 'react';
import { ExpandableDetailPane, type ExpandableDetailPaneTab } from '../react/ExpandableDetailPane';

export default {
  title: 'Shell Primitives/ExpandableDetailPane',
  component: ExpandableDetailPane,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Right-side detail pane with full-screen toggle and composable tab structure. ' +
          'Use for row-detail and edit surfaces instead of inline edit patterns.',
      },
    },
  },
};

const TABS: ExpandableDetailPaneTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    render: () => (
      <dl style={{ display: 'grid', gap: '12px' }}>
        <div>
          <dt style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-3)' }}>Risk level</dt>
          <dd style={{ margin: 0 }}>High</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-3)' }}>Owner</dt>
          <dd style={{ margin: 0 }}>Sarah Connor</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-3)' }}>Last reviewed</dt>
          <dd style={{ margin: 0 }}>01 May 2026</dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'controls',
    label: 'Controls',
    render: () => (
      <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
        <li>Access review quarterly</li>
        <li>MFA enforced</li>
        <li>Annual pen test</li>
      </ul>
    ),
  },
  {
    id: 'history',
    label: 'History',
    render: () => (
      <ol style={{ margin: 0, padding: '0 0 0 16px' }}>
        <li>Status changed to Active — 28 Apr 2026</li>
        <li>Risk level set to High — 15 Apr 2026</li>
        <li>Created — 01 Apr 2026</li>
      </ol>
    ),
  },
];

/** Golden path: open with three tabs */
export function Default() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ height: '100vh', background: 'var(--surface-0, #f9f9f9)' }}>
      <button
        type="button"
        className="cc-btn cc-btn--primary"
        style={{ margin: '24px' }}
        onClick={() => setOpen(true)}
      >
        Open pane
      </button>
      <ExpandableDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Acme Corp"
        subtitle="Vendor · High risk"
        tabs={TABS}
        headerActions={
          <button type="button" className="cc-btn cc-btn--secondary cc-btn--sm">Edit</button>
        }
      />
    </div>
  );
}

/** Single tab — no tab bar rendered */
export function SingleTab() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ height: '100vh' }}>
      <ExpandableDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Acme Corp"
        tabs={[TABS[0]]}
      />
    </div>
  );
}

/** Starts on the History tab */
export function DefaultTabHistory() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ height: '100vh' }}>
      <ExpandableDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Acme Corp"
        tabs={TABS}
        defaultTabId="history"
      />
    </div>
  );
}

/** Closed state */
export function Closed() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'flex-start', padding: '24px' }}>
      <button
        type="button"
        className="cc-btn cc-btn--primary"
        onClick={() => setOpen(true)}
      >
        Open detail pane
      </button>
      <ExpandableDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Acme Corp"
        tabs={TABS}
      />
    </div>
  );
}

/** No full-screen toggle */
export function NoFullScreen() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ height: '100vh' }}>
      <ExpandableDetailPane
        open={open}
        onClose={() => setOpen(false)}
        title="Acme Corp"
        tabs={TABS}
        allowFullScreen={false}
      />
    </div>
  );
}
