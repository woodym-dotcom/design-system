/**
 * CompanyGroupSwitcher stories — Storybook CSF v3 format.
 *
 * This is the only sanctioned tenancy-context selector in @ds/core.
 * Consumers must not roll their own group pickers — the
 * @ds/core/no-adhoc-tenancy-selector ESLint rule enforces this.
 */
import * as React from 'react';
import { CompanyGroupSwitcher } from '../react/CompanyGroupSwitcher';

export default {
  title: 'Shell Primitives/CompanyGroupSwitcher',
  component: CompanyGroupSwitcher,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Controlled company-group selector. Reads memberships from props (consumer fetches /api/session). ' +
          'Combobox role, keyboard nav, search-on-type when memberships > 5.',
      },
    },
  },
};

const FEW_MEMBERSHIPS = [
  { companyGroupUuid: 'uuid-acme', name: 'Acme Corp' },
  { companyGroupUuid: 'uuid-globex', name: 'Globex Industries' },
  { companyGroupUuid: 'uuid-initech', name: 'Initech' },
];

const MANY_MEMBERSHIPS = [
  { companyGroupUuid: 'uuid-acme', name: 'Acme Corp' },
  { companyGroupUuid: 'uuid-globex', name: 'Globex Industries' },
  { companyGroupUuid: 'uuid-initech', name: 'Initech' },
  { companyGroupUuid: 'uuid-umbrella', name: 'Umbrella Ltd' },
  { companyGroupUuid: 'uuid-stark', name: 'Stark Enterprises' },
  { companyGroupUuid: 'uuid-wayne', name: 'Wayne Industries' },
  { companyGroupUuid: 'uuid-oscorp', name: 'Oscorp Holdings' },
];

/** Golden path: few groups, no search. */
export function Default() {
  const [current, setCurrent] = React.useState('uuid-acme');
  return (
    <div style={{ width: '220px', padding: '8px', background: 'var(--surface-1, #f4f4f4)', borderRadius: '8px' }}>
      <CompanyGroupSwitcher
        currentGroupUuid={current}
        memberships={FEW_MEMBERSHIPS}
        onChange={setCurrent}
      />
      <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
        Active: {current}
      </p>
    </div>
  );
}

/** Search-on-type activates when memberships &gt; 5. */
export function WithSearch() {
  const [current, setCurrent] = React.useState('uuid-acme');
  return (
    <div style={{ width: '220px', padding: '8px', background: 'var(--surface-1, #f4f4f4)', borderRadius: '8px' }}>
      <CompanyGroupSwitcher
        currentGroupUuid={current}
        memberships={MANY_MEMBERSHIPS}
        onChange={setCurrent}
      />
    </div>
  );
}

/** Loading state. */
export function Loading() {
  return (
    <div style={{ width: '220px', padding: '8px', background: 'var(--surface-1, #f4f4f4)', borderRadius: '8px' }}>
      <CompanyGroupSwitcher
        currentGroupUuid={null}
        memberships={[]}
        onChange={() => undefined}
        loading
      />
    </div>
  );
}

/** No current group (null). */
export function NoCurrentGroup() {
  const [current, setCurrent] = React.useState<string | null>(null);
  return (
    <div style={{ width: '220px', padding: '8px', background: 'var(--surface-1, #f4f4f4)', borderRadius: '8px' }}>
      <CompanyGroupSwitcher
        currentGroupUuid={current}
        memberships={FEW_MEMBERSHIPS}
        onChange={setCurrent}
      />
    </div>
  );
}

/** Single group — no selection needed but renders correctly. */
export function SingleGroup() {
  const [current, setCurrent] = React.useState('uuid-acme');
  return (
    <div style={{ width: '220px', padding: '8px', background: 'var(--surface-1, #f4f4f4)', borderRadius: '8px' }}>
      <CompanyGroupSwitcher
        currentGroupUuid={current}
        memberships={[{ companyGroupUuid: 'uuid-acme', name: 'Acme Corp' }]}
        onChange={setCurrent}
      />
    </div>
  );
}
