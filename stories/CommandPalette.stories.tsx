/**
 * CommandPalette stories — open, with shortcuts, grouped.
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

export function Default() {
  return (
    <div style={{ minHeight: 480 }}>
      <CommandPalette open onClose={() => {}} items={ITEMS} />
    </div>
  );
}
