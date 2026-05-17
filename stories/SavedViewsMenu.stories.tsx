/**
 * SavedViewsMenu stories — open with pinned + regular views, empty, with actions.
 */
import * as React from 'react';
import { SavedViewsMenu } from '../react/SavedViewsMenu';
import type { SavedView } from '../react/hooks/useSavedViews';

export default {
  title: 'Foundation/SavedViewsMenu',
  component: SavedViewsMenu,
};

const VIEWS: SavedView<string>[] = [
  { id: 'mine',  name: 'My open vendors',   state: '?owner=me&status=open', pinned: true, updatedAt: '2026-05-17T09:00:00Z' },
  { id: 'risky', name: 'High-risk vendors',  state: '?risk=high',           pinned: true, updatedAt: '2026-05-16T15:00:00Z' },
  { id: 'open',  name: 'All open',           state: '?status=open',                       updatedAt: '2026-05-15T10:00:00Z' },
  { id: 'arch',  name: 'Archived',           state: '?status=archived',                   updatedAt: '2026-05-10T08:00:00Z' },
];

export function Default() {
  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <SavedViewsMenu
        views={VIEWS}
        activeId="mine"
        onSelect={() => {}}
        onSaveCurrent={() => {}}
        onTogglePin={() => {}}
        onRename={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
}

/** Force the menu open for snapshot capture. */
export function Open() {
  const ref = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const btn = node.querySelector('button.cc-saved-views__trigger') as HTMLButtonElement | null;
      btn?.click();
    }
  }, []);
  return (
    <div ref={ref} style={{ padding: 24, minHeight: 360 }}>
      <SavedViewsMenu
        views={VIEWS}
        activeId="mine"
        onSelect={() => {}}
        onSaveCurrent={() => {}}
        onTogglePin={() => {}}
        onRename={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
}

export function Empty() {
  return (
    <div style={{ padding: 24, minHeight: 200 }}>
      <SavedViewsMenu views={[]} onSelect={() => {}} onSaveCurrent={() => {}} />
    </div>
  );
}
