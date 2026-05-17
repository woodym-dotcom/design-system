/**
 * TasksTray + NotificationsTray stories.
 */
import * as React from 'react';
import { TasksTray, NotificationsTray, type TrayTask, type TrayNotification } from '../react/Trays';

export default {
  title: 'Foundation/Trays',
  parameters: { layout: 'fullscreen' },
};

const TASKS: TrayTask[] = [
  { id: '1', title: 'Approve Acme vendor onboarding', description: 'Risk score: medium', at: '2026-05-17T10:00:00Z', severity: 'warning', action: { label: 'Review', onClick: () => {} } },
  { id: '2', title: 'Investigate drift on payment-model-v3', at: '2026-05-17T09:30:00Z', severity: 'critical', action: { label: 'Open', onClick: () => {} } },
  { id: '3', title: 'Sign Q2 risk attestation', at: '2026-05-16T16:00:00Z' },
  { id: '4', title: 'Closed: Reviewed model card', at: '2026-05-15T11:00:00Z', done: true },
];

const NOTIFS: TrayNotification[] = [
  { id: 'a', title: 'Connector "Bank Postgres" back online', body: 'Recovered after 4m outage.', at: '2026-05-17T10:14:00Z', source: 'Integration Gateway' },
  { id: 'b', title: 'Promotion gate passed', body: 'risk-engine-v4 promoted to canary.', at: '2026-05-17T09:55:00Z', source: 'Feature Store' },
  { id: 'c', title: 'Old: rotation reminder', at: '2026-05-15T08:00:00Z', read: true, source: 'Identity' },
];

export function Tasks() {
  return <TasksTray open onClose={() => {}} tasks={TASKS} onMarkDone={() => {}} onClearCompleted={() => {}} />;
}

export function Notifications() {
  return <NotificationsTray open onClose={() => {}} notifications={NOTIFS} onMarkAllRead={() => {}} onMarkRead={() => {}} />;
}
