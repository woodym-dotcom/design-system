/**
 * TopRightCreateWizard stories — Storybook CSF v3 format.
 *
 * Phase 6.1: AI variant wired against a mock runProcess (simulates echo-v1 process).
 * In production, wire aiConfig.runProcess to aaApiClient.aiWizard.run.
 */
import * as React from 'react';
import { TopRightCreateWizard } from '../react/TopRightCreateWizard';
import type { AiCreateConfig } from '../react/TopRightCreateWizard';
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
          'Two variants: manual (full wizard) and ai (AI-assisted, Phase 6.1). ' +
          'AI variant: user enters a prompt → processKey is fired against AA Orchestrator ' +
          'via aiConfig.runProcess → result projected into form → human reviews before save. ' +
          'No provider SDK is imported — all LLM dispatch goes through @aa/api-client.aiWizard.run.',
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

/**
 * Simulated echo process — stands in for aaApiClient.aiWizard.run({ processKey: 'echo-v1', inputs }).
 * Parses the user's prompt to pre-fill vendor fields.
 * In production replace with: (key, inputs) => aaApiClient.aiWizard.run({ processKey: key, inputs })
 */
async function mockEchoProcess(
  processKey: string,
  inputs: Record<string, unknown>,
): Promise<{ output: Record<string, unknown>; parsedOk: boolean }> {
  const prompt = String(inputs.prompt ?? '');
  await new Promise((r) => setTimeout(r, 800)); // simulate latency

  // Very naive extraction for demo purposes — real process would call regulation-decomposition-v1 etc.
  const nameMatch = prompt.match(/called?\s+([A-Za-z][A-Za-z0-9 ]+?)(?:\s+in|\s*$)/i);
  const catMatch = prompt.match(/software|services|infrastructure/i);
  const ownerMatch = prompt.match(/owned? by\s+([A-Za-z][A-Za-z ]*)(?:\s*$)/i);

  return {
    output: {
      name: nameMatch ? nameMatch[1].trim() : prompt.slice(0, 40),
      category: catMatch ? catMatch[0].toLowerCase() : '',
      owner: ownerMatch ? ownerMatch[1].trim() : '',
      _processKey: processKey,
      _echo: true,
    },
    parsedOk: true,
  };
}

const vendorAiConfig: AiCreateConfig<VendorValues> = {
  processKey: 'echo-v1',
  runProcess: mockEchoProcess,
  projectResult: (output) => ({
    name: String(output.name ?? ''),
    category: String(output.category ?? ''),
    owner: String(output.owner ?? ''),
  }),
  promptLabel: 'Describe the vendor to create',
  promptPlaceholder: 'e.g. Create a vendor called Acme Corp in the software category owned by Sarah Connor',
};

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

/**
 * AI variant — wired against mock echo-v1 process.
 *
 * Flow: enter a prompt → Generate with AI → result projected into form → review → save.
 * The manual review step is always preserved. processKey is 'echo-v1' (registered in AA).
 *
 * Try: "Create a vendor called Acme Corp in the software category owned by Sarah Connor"
 */
export function AiVariant() {
  const [lastSubmit, setLastSubmit] = React.useState<VendorValues | null>(null);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px', position: 'relative' }}>
      {lastSubmit ? (
        <p style={{ position: 'absolute', top: '80px', right: '24px', color: 'var(--success)' }}>
          Saved (AI-assisted): {lastSubmit.name} / {lastSubmit.category}
        </p>
      ) : null}
      <TopRightCreateWizard<VendorValues>
        variant="ai"
        triggerLabel="+ AI-assisted"
        modalTitle="Generate vendor with AI"
        wizard={{
          steps: VENDOR_STEPS,
          initialValues: { name: '', category: '', owner: '' },
          onSubmit: async (values) => {
            await new Promise((r) => setTimeout(r, 400));
            setLastSubmit(values);
          },
        }}
        aiConfig={vendorAiConfig}
        onComplete={() => setLastSubmit((v) => v)}
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

/**
 * AI variant — error state demo. runProcess rejects to show error handling.
 */
export function AiVariantError() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px' }}>
      <TopRightCreateWizard<VendorValues>
        variant="ai"
        triggerLabel="+ AI (error demo)"
        modalTitle="Generate vendor with AI"
        wizard={{
          steps: VENDOR_STEPS,
          initialValues: { name: '', category: '', owner: '' },
          onSubmit: async () => {},
        }}
        aiConfig={{
          processKey: 'echo-v1',
          runProcess: async () => {
            await new Promise((r) => setTimeout(r, 600));
            throw new Error('POST /v1/orchestrator/ai-wizard/run failed: 503');
          },
          projectResult: () => ({}),
          promptLabel: 'Describe the vendor to create',
        }}
      />
    </div>
  );
}
