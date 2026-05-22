/**
 * PlatformAppShell stories — DS-SIMPLIFY 05.
 *
 * One canonical golden-path story per brand × tenant mode combination.
 * 4 brands × 2 tenant modes = 8 visual baselines.
 */
import * as React from 'react';
import {
  PlatformAppShell,
  type BrandKey,
  type ModuleDef,
  type AppDef,
  type UserDef,
  type CompanyGroup,
} from '../react/PlatformAppShell';

export default {
  title: 'Shell/PlatformAppShell',
  component: PlatformAppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pre-composed top-level application shell. Replaces direct use of ' +
          'AppShell, TopBar, NavRail, CompanyGroupSwitcher, AppSwitcher, ' +
          'UserMenu, and CreateMenu — those primitives are now internal.',
      },
    },
  },
};

const USER: UserDef = { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com' };

const MODULES: ModuleDef[] = [
  { id: 'home', label: 'Home', href: '/home' },
  { id: 'vendors', label: 'Vendors', href: '/vendors' },
  { id: 'risks', label: 'Risks', href: '/risks', badge: 3 },
  { id: 'controls', label: 'Controls', href: '/controls' },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    disabled: true,
    disabledReason: 'You lack admin permissions',
  },
];

const APPS: AppDef[] = [
  { key: 'cc', label: 'CompanyCo', url: 'https://cc.example' },
  { key: 'aa', label: 'Automation', url: 'https://aa.example' },
  { key: 'rw', label: 'Recruitment', url: 'https://rw.example' },
];

const MULTI_GROUPS: CompanyGroup[] = [
  { id: 'g-acme', name: 'Acme Corp' },
  { id: 'g-globex', name: 'Globex Industries' },
];

function PageBody({ title }: { title: string }) {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p style={{ maxWidth: 60 + 'ch', color: 'var(--text-muted, #666)' }}>
        Body content rendered inside `&lt;main&gt;`. The shell owns the chrome
        (brand, modules, app switcher, user menu, optional company-group
        switcher) and the Cmd+K binding when a `commandPalette` prop is set.
      </p>
    </div>
  );
}

function makeStory(
  brand: BrandKey,
  multiTenant: boolean,
  appKey: string = 'cc',
  activeModuleId = 'risks',
): React.ReactElement {
  return (
    <div style={{ minHeight: 480 }}>
      <PlatformAppShell
        brand={brand}
        modules={MODULES}
        appKey={appKey}
        user={USER}
        apps={APPS}
        companyGroups={multiTenant ? MULTI_GROUPS : [{ id: 'g-only', name: 'Solo' }]}
        activeModuleId={activeModuleId}
        onSignOut={() => undefined}
        onSwitchApp={() => undefined}
        onSwitchCompanyGroup={() => undefined}
        onNavigate={() => undefined}
        commandPalette={{
          items: [
            { id: 'go-home', label: 'Go to Home', onSelect: () => undefined },
            { id: 'go-vendors', label: 'Go to Vendors', onSelect: () => undefined },
          ],
        }}
      >
        <PageBody title={`${brand} • ${multiTenant ? 'multi-tenant' : 'single-tenant'}`} />
      </PlatformAppShell>
    </div>
  );
}

// ── 4 brands × 2 tenant modes = 8 baselines ─────────────────────────────────
export const CompanycoMulti = () => makeStory('companyco', true);
CompanycoMulti.storyName = 'Companyco — multi-tenant';

export const CompanycoSingle = () => makeStory('companyco', false);
CompanycoSingle.storyName = 'Companyco — single-tenant';

export const RecruitmentMulti = () => makeStory('recruitment', true, 'rw');
RecruitmentMulti.storyName = 'Recruitment — multi-tenant';

export const RecruitmentSingle = () => makeStory('recruitment', false, 'rw');
RecruitmentSingle.storyName = 'Recruitment — single-tenant';

export const CustomerLifecycleMulti = () => makeStory('customer-lifecycle', true);
CustomerLifecycleMulti.storyName = 'Customer-lifecycle — multi-tenant';

export const CustomerLifecycleSingle = () => makeStory('customer-lifecycle', false);
CustomerLifecycleSingle.storyName = 'Customer-lifecycle — single-tenant';

export const AutomationMulti = () => makeStory('automation', true, 'aa');
AutomationMulti.storyName = 'Automation — multi-tenant';

export const AutomationSingle = () => makeStory('automation', false, 'aa');
AutomationSingle.storyName = 'Automation — single-tenant';
