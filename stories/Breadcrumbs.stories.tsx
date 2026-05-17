/**
 * Breadcrumbs stories — short trail, long with collapse, current marker.
 */
import * as React from 'react';
import { Breadcrumbs } from '../react/Breadcrumbs';

export default {
  title: 'Foundation/Breadcrumbs',
  component: Breadcrumbs,
};

export function Default() {
  return (
    <div style={{ padding: 24 }}>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Vendors', href: '/vendors' },
          { label: 'Acme Corp' },
        ]}
      />
    </div>
  );
}

export function LongTrail() {
  return (
    <div style={{ padding: 24 }}>
      <Breadcrumbs
        collapseAfter={4}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Models', href: '/m' },
          { label: 'Catalogue', href: '/m/cat' },
          { label: 'Vision', href: '/m/cat/vision' },
          { label: 'OCR', href: '/m/cat/vision/ocr' },
          { label: 'v2.4' },
        ]}
      />
    </div>
  );
}
