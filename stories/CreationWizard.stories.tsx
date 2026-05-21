/**
 * CreationWizard stories — demonstrates next/back/submit callbacks
 * available on the step context (DS-SIMPLIFY 11).
 */
import * as React from 'react';
import { CreationWizard, type CreationWizardStep } from '../react/CreationWizard';

export default {
  title: 'Foundation/CreationWizard',
  component: CreationWizard,
  parameters: { layout: 'padded' },
};

interface ProjectValues {
  name: string;
  type: string;
  description: string;
}

/**
 * Steps use next/back/submit from context rather than relying solely on the
 * wizard footer — demonstrating that any element in a step can drive navigation.
 */
const STEPS: CreationWizardStep<ProjectValues>[] = [
  {
    id: 'name',
    label: 'Name',
    render: ({ values, setValues, next, activeIndex, totalSteps }) => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Step {activeIndex + 1} of {totalSteps}
        </p>
        <label>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Project name *
          </span>
          <input
            type="text"
            value={values.name}
            placeholder="e.g. Market Expansion"
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </label>
        <button
          type="button"
          onClick={next}
          disabled={!values.name.trim()}
          style={{
            padding: '8px 16px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: values.name.trim() ? 1 : 0.4,
          }}
        >
          Continue (via ctx.next)
        </button>
      </div>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    render: ({ values, setValues, next, back, activeIndex, totalSteps }) => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Step {activeIndex + 1} of {totalSteps}
        </p>
        <label>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Project type
          </span>
          <select
            value={values.type}
            onChange={(e) => setValues((v) => ({ ...v, type: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="">Select…</option>
            <option value="internal">Internal</option>
            <option value="client">Client</option>
            <option value="research">Research</option>
          </select>
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={back}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
          >
            Back (ctx.back)
          </button>
          <button
            type="button"
            onClick={next}
            style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Next (ctx.next)
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 'description',
    label: 'Description',
    render: ({ values, setValues, submit, back, activeIndex, totalSteps }) => (
      <div style={{ display: 'grid', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Step {activeIndex + 1} of {totalSteps} (last step)
        </p>
        <label>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Description
          </span>
          <textarea
            value={values.description}
            placeholder="Brief description…"
            rows={3}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={back}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
          >
            Back (ctx.back)
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Save now (ctx.submit)
          </button>
        </div>
      </div>
    ),
  },
];

/** Steps drive navigation via ctx.next/back/submit — footer is supplemental. */
export function Default() {
  const [saved, setSaved] = React.useState<ProjectValues | null>(null);
  return (
    <div style={{ maxWidth: 720 }}>
      {saved && (
        <p style={{ padding: '8px', background: '#d1fae5', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
          Saved: {saved.name} / {saved.type} / {saved.description || '—'}
        </p>
      )}
      <CreationWizard<ProjectValues>
        steps={STEPS}
        initialValues={{ name: '', type: '', description: '' }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 400));
          setSaved(values);
        }}
      />
    </div>
  );
}

/** Three steps with an AI review appended — totalSteps reflects the extra step. */
export function WithAiReview() {
  const [saved, setSaved] = React.useState<ProjectValues | null>(null);
  return (
    <div style={{ maxWidth: 720 }}>
      {saved && (
        <p style={{ padding: '8px', background: '#d1fae5', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
          Saved: {saved.name}
        </p>
      )}
      <CreationWizard<ProjectValues>
        steps={STEPS}
        initialValues={{ name: '', type: '', description: '' }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 400));
          setSaved(values);
        }}
        aiReview={{
          label: 'AI Review',
          reviewer: async (values) => {
            await new Promise((r) => setTimeout(r, 800));
            return {
              ok: Boolean(values.name && values.type),
              summary: values.name
                ? `Project "${values.name}" looks ready.`
                : 'Please provide a project name.',
              suggestions: values.type ? [] : ['Select a project type before submitting.'],
            };
          },
        }}
      />
    </div>
  );
}
