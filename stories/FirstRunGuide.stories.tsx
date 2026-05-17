/**
 * FirstRunGuide stories — fresh tenant, mid-progress, complete.
 */
import * as React from 'react';
import { FirstRunGuide, type FirstRunStep } from '../react/FirstRunGuide';

export default {
  title: 'Foundation/FirstRunGuide',
  component: FirstRunGuide,
};

const STEPS: FirstRunStep[] = [
  {
    id: 'connect',
    title: 'Connect a data source',
    description: 'Hook up your warehouse or upload a CSV so we have something to model.',
    action: { label: 'Connect', onClick: () => {} },
  },
  {
    id: 'invite',
    title: 'Invite your team',
    description: 'Bring at least one analyst so the next steps have an audience.',
    action: { label: 'Invite teammates', onClick: () => {} },
    secondary: { label: 'Learn more', href: '#docs' },
  },
  {
    id: 'first-model',
    title: 'Promote your first model',
    description: 'Train, evaluate, and promote — we’ll guide you through each gate.',
    action: { label: 'Open Models', href: '/models' },
    skippable: true,
  },
];

export function Default() {
  return (
    <div style={{ padding: 24 }}>
      <FirstRunGuide
        title="Welcome to AutomationArmoury"
        description="Three small steps and your tenant is ready."
        steps={STEPS}
      />
    </div>
  );
}

export function MidProgress() {
  const steps: FirstRunStep[] = [
    { ...STEPS[0], done: true },
    STEPS[1],
    STEPS[2],
  ];
  return (
    <div style={{ padding: 24 }}>
      <FirstRunGuide title="Almost there" steps={steps} />
    </div>
  );
}

export function Complete() {
  return (
    <div style={{ padding: 24 }}>
      <FirstRunGuide
        title="You're all set"
        description="Onboarding complete — feel free to revisit any step."
        steps={STEPS.map((s) => ({ ...s, done: true }))}
        footer={<a href="#reset">Reset onboarding</a>}
      />
    </div>
  );
}
