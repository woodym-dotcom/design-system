/**
 * CommandPalette stories — open, with shortcuts, grouped,
 * filter chips, and custom renderItem.
 */
import * as React from 'react';
import { CommandPalette, type CommandItem } from '../react/CommandPalette';

export default {
  title: 'Foundation/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen' },
};

const ITEMS: CommandItem[] = [
  { id: 'home',    label: 'Go home',          group: 'Navigate', shortcut: ['g', 'h'], onSelect: () => {} },
  { id: 'vendors', label: 'Open Vendors',     group: 'Navigate', shortcut: ['g', 'v'], onSelect: () => {} },
  { id: 'models',  label: 'Open Models',      group: 'Navigate', shortcut: ['g', 'm'], onSelect: () => {} },
  { id: 'newv',    label: 'New vendor',       group: 'Actions',  shortcut: ['mod', 'N'], onSelect: () => {} },
  { id: 'newm',    label: 'New model card',   group: 'Actions',  onSelect: () => {} },
  { id: 'invite',  label: 'Invite teammate',  group: 'Actions',  hint: '→ Identity', onSelect: () => {} },
];

const FILTER_TYPES: { key: 'Navigate' | 'Actions'; label: string }[] = [
  { key: 'Navigate', label: 'Navigate' },
  { key: 'Actions',  label: 'Actions' },
];

export function Default() {
  return (
    <div style={{ minHeight: 480 }}>
      <CommandPalette open onClose={() => {}} items={ITEMS} />
    </div>
  );
}

/** Filter chips above the input let users narrow results by type. */
export function WithFilterChips() {
  const [activeFilter, setActiveFilter] = React.useState<'Navigate' | 'Actions' | 'all'>('all');
  return (
    <div style={{ minHeight: 480 }}>
      <p style={{ padding: '8px 16px', fontSize: '12px', color: '#888' }}>
        Active filter: <strong>{activeFilter}</strong>
      </p>
      <CommandPalette
        open
        onClose={() => {}}
        items={ITEMS}
        filterTypes={FILTER_TYPES}
        defaultFilterType="all"
        onFilterTypeChange={setActiveFilter}
      />
    </div>
  );
}

/** Custom renderItem swaps out the default row for a bespoke layout. */
export function WithCustomRenderItem() {
  return (
    <div style={{ minHeight: 480 }}>
      <CommandPalette
        open
        onClose={() => {}}
        items={ITEMS}
        renderItem={(item) => (
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.group === 'Navigate' ? '#6366f1' : '#f59e0b',
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, fontWeight: 500 }}>{item.label}</span>
            {item.hint && (
              <span style={{ fontSize: '11px', color: '#888' }}>{item.hint}</span>
            )}
            {item.group && (
              <span
                style={{
                  fontSize: '10px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  color: '#555',
                }}
              >
                {item.group}
              </span>
            )}
          </span>
        )}
      />
    </div>
  );
}
