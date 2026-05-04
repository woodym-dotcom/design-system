/**
 * ModuleShell stories — Storybook CSF v3 format.
 *
 * Demonstrates both the legacy named-props API and the preferred tabs[] API.
 * Run with: npx storybook dev
 */
import * as React from 'react';
import { ModuleShell, type ModuleShellTabDef } from '../react/ModuleShell';

export default {
  title: 'Shell Primitives/ModuleShell',
  component: ModuleShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Top-level module container with a tab strip, header, and a single active panel. ' +
          'Prefer the `tabs[]` prop for new call sites — it gives full control over tab order ' +
          'and supports runtime visibility (`hidden`) without reordering the array. ' +
          'The legacy named props (`review`, `monitoring`, `list`, `configurations`) are preserved ' +
          'for backward compatibility and are ignored when `tabs[]` is present.',
      },
    },
  },
};

// ── Legacy named-props API (backward compat) ──────────────────────────────────

export function NamedProps() {
  return (
    <ModuleShell
      title="Vendors"
      list={{ label: 'List', render: () => <p style={{ padding: '1rem' }}>Vendor list content</p> }}
      configurations={{ label: 'Configurations', render: () => <p style={{ padding: '1rem' }}>Config content</p> }}
      review={{ label: 'Review queue', render: () => <p style={{ padding: '1rem' }}>Review content</p> }}
    />
  );
}
NamedProps.storyName = 'Legacy — named props (review · list · configurations)';

// ── Preferred tabs[] API — caller-controlled order ────────────────────────────

export function CallerControlledTabs() {
  const tabs: ModuleShellTabDef[] = [
    { id: 'list', label: 'List', render: () => <p style={{ padding: '1rem' }}>List content (shown first)</p> },
    { id: 'configurations', label: 'Configurations', render: () => <p style={{ padding: '1rem' }}>Config content</p> },
    { id: 'review-queue', label: 'Review queue', render: () => <p style={{ padding: '1rem' }}>Review queue content (last)</p> },
  ];
  return <ModuleShell title="Companies" tabs={tabs} defaultTab="list" />;
}
CallerControlledTabs.storyName = 'Preferred — tabs[] (list · configurations · review-queue)';

// ── Hidden tab ────────────────────────────────────────────────────────────────

export function WithHiddenTab() {
  const tabs: ModuleShellTabDef[] = [
    { id: 'list', label: 'List', render: () => <p style={{ padding: '1rem' }}>List content</p> },
    { id: 'review-queue', label: 'Review queue', hidden: true, render: () => <p style={{ padding: '1rem' }}>Review queue (hidden — no tab button shown)</p> },
    { id: 'configurations', label: 'Configurations', render: () => <p style={{ padding: '1rem' }}>Config content</p> },
  ];
  return <ModuleShell title="Services" tabs={tabs} />;
}
WithHiddenTab.storyName = 'tabs[] — hidden tab omitted from strip';

// ── Single tab (strip collapses) ──────────────────────────────────────────────

export function SingleTab() {
  const tabs: ModuleShellTabDef[] = [
    { id: 'list', label: 'List', render: () => <p style={{ padding: '1rem' }}>Only one tab — strip is hidden</p> },
  ];
  return <ModuleShell title="Risks" tabs={tabs} />;
}
SingleTab.storyName = 'tabs[] — single tab (strip hidden)';
