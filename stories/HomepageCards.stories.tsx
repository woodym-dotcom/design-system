/**
 * HomepageCards stories — role variants, loading, empty.
 */
import * as React from 'react';
import { HomepageCards, type HomepageCard } from '../react/HomepageCards';

export default {
  title: 'Foundation/HomepageCards',
  component: HomepageCards,
};

function cards(): HomepageCard[] {
  return [
    {
      id: 'tasks',
      title: 'Your tasks',
      subtitle: '3 awaiting your review',
      icon: '✓',
      priority: 10,
      render: () => (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
          <li>Approve Acme onboarding</li>
          <li>Investigate drift on payment-model-v3</li>
          <li>Sign Q2 attestation</li>
        </ul>
      ),
    },
    {
      id: 'models',
      title: 'Models',
      subtitle: '12 in production',
      icon: '◇',
      roles: ['analyst', 'admin'],
      render: () => <p style={{ margin: 0 }}>2 awaiting promotion review.</p>,
    },
    {
      id: 'admin',
      title: 'Admin',
      subtitle: 'Tenant settings',
      icon: '⚙',
      roles: ['admin'],
      render: () => <p style={{ margin: 0 }}>2 connector outages overnight.</p>,
    },
    {
      id: 'docs',
      title: 'Docs',
      subtitle: 'How-to guides',
      icon: '📖',
      href: '#docs',
      render: () => <p style={{ margin: 0 }}>Start with the onboarding tour.</p>,
    },
  ];
}

export function AdminView() {
  return (
    <div style={{ padding: 24 }}>
      <HomepageCards
        viewerRoles={['admin']}
        cards={cards()}
        heading="Home"
        subtitle="What needs your attention today"
      />
    </div>
  );
}

export function ViewerOnly() {
  return (
    <div style={{ padding: 24 }}>
      <HomepageCards
        viewerRoles={['viewer']}
        cards={cards()}
        heading="Home"
      />
    </div>
  );
}

export function Loading() {
  return (
    <div style={{ padding: 24 }}>
      <HomepageCards viewerRoles={['admin']} cards={cards()} loading heading="Home" />
    </div>
  );
}

export function PermissionedOut() {
  return (
    <div style={{ padding: 24 }}>
      <HomepageCards
        viewerRoles={['guest']}
        cards={cards().filter((c) => c.roles && c.roles.length > 0)}
        heading="Home"
        emptyState={{
          title: 'Nothing for you yet',
          description: 'Ask an admin to grant you a role.',
        }}
      />
    </div>
  );
}
