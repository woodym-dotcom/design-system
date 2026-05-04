/**
 * TopRightCreateWizard stories — Storybook CSF v3 format.
 */
import * as React from 'react';
import { TopRightCreateWizard } from '../react/TopRightCreateWizard';
import type { CreationWizardStep } from '../react/CreationWizard';

export default {
  title: 'Shell Primitives/TopRightCreateWizard',
  component: TopRightCreateWizard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Top-right Create button that opens a wizard modal. ' +
          'Use this instead of ad-hoc Create buttons (see @ds/eslint-plugin no-adhoc-create-button). ' +
          'Two variants: manual (full wizard) and ai (Phase 6.1 placeholder).',
      },
    },
  },
};

interface VendorValues {
  name: string;
  category: string;
  owner: string;
}

const VENDOR_STEPS: CreationWizardStep<VendorValues>[] = [
  {
    id: 'basics',
    label: 'Basics',
    render: ({ values, setValues }) => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <label>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Vendor name *
          </span>
          <input
            type="text"
            className="cc-field__input"
            value={values.name}
            placeholder="e.g. Acme Corp"
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border-1)', borderRadius: '4px' }}
          />
        </label>
        <label>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Category
          </span>
          <select
            className="cc-field__input"
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border-1)', borderRadius: '4px' }}
          >
            <option value="">Select category…</option>
            <option value="software">Software</option>
            <option value="services">Services</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </label>
      </div>
    ),
  },
  {
    id: 'ownership',
    label: 'Ownership',
    render: ({ values, setValues }) => (
      <label>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
          Owner
        </span>
        <input
          type="text"
          value={values.owner}
          placeholder="e.g. Sarah Connor"
          onChange={(e) => setValues((v) => ({ ...v, owner: e.target.value }))}
          style={{ width: '100%', padding: '8px', border: '1px solid var(--border-1)', borderRadius: '4px' }}
        />
      </label>
    ),
  },
];

/** Golden path: manual variant with two steps */
export function Default() {
  const [lastSubmit, setLastSubmit] = React.useState<VendorValues | null>(null);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px', position: 'relative' }}>
      {lastSubmit ? (
        <p style={{ position: 'absolute', top: '80px', right: '24px', color: 'var(--success)' }}>
          Submitted: {lastSubmit.name} / {lastSubmit.category} / {lastSubmit.owner}
        </p>
      ) : null}
      <TopRightCreateWizard<VendorValues>
        modalTitle="New Vendor"
        triggerLabel="+ New vendor"
        wizard={{
          steps: VENDOR_STEPS,
          initialValues: { name: '', category: '', owner: '' },
          onSubmit: async (values) => {
            await new Promise((r) => setTimeout(r, 400));
            setLastSubmit(values);
          },
        }}
        onComplete={() => setLastSubmit((v) => v)}
      />
    </div>
  );
}

/** AI variant — shows Phase 6.1 placeholder */
export function AiVariant() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px' }}>
      <TopRightCreateWizard<VendorValues>
        variant="ai"
        triggerLabel="+ AI-assisted"
        modalTitle="Generate vendor with AI"
        wizard={{
          steps: VENDOR_STEPS,
          initialValues: { name: '', category: '', owner: '' },
          onSubmit: async () => {},
        }}
      />
    </div>
  );
}

/** Custom trigger label */
export function CustomLabel() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px' }}>
      <TopRightCreateWizard<VendorValues>
        triggerLabel="Add new vendor"
        modalTitle="Add Vendor"
        wizard={{
          steps: VENDOR_STEPS,
          initialValues: { name: '', category: '', owner: '' },
          onSubmit: async () => {},
        }}
      />
    </div>
  );
}
