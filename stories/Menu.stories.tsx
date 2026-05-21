/**
 * Menu stories — placement × disabled items × separators.
 */
import * as React from 'react';
import { Menu, MenuItem, MenuSeparator, MenuLabel } from '../react/Menu';

export default {
  title: 'Layout/Menu',
  component: Menu,
};

function Trigger({ label }: { label: string }) {
  return (
    <button
      style={{
        padding: '6px 12px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-1)',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-1)',
      }}
    >
      {label}
    </button>
  );
}

export function Default() {
  return (
    <div style={{ padding: 80, display: 'flex', gap: 16 }}>
      <Menu trigger={<Trigger label="Open menu" />}>
        <MenuItem onSelect={() => alert('Edit')}>Edit</MenuItem>
        <MenuItem onSelect={() => alert('Duplicate')}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => alert('Delete')} destructive>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export function WithLabelsAndSeparators() {
  return (
    <div style={{ padding: 80 }}>
      <Menu trigger={<Trigger label="Actions" />}>
        <MenuLabel>File</MenuLabel>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuSeparator />
        <MenuLabel>Edit</MenuLabel>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuSeparator />
        <MenuItem destructive>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export function WithDisabledItems() {
  return (
    <div style={{ padding: 80 }}>
      <Menu trigger={<Trigger label="Options" />}>
        <MenuItem onSelect={() => alert('Active')}>Active item</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
        <MenuItem disabled destructive>Disabled destructive</MenuItem>
        <MenuItem onSelect={() => alert('Another active')}>Another active</MenuItem>
      </Menu>
    </div>
  );
}

export function PlacementVariants() {
  const placements = ['bottom-end', 'bottom-start', 'top-end', 'top-start'] as const;
  return (
    <div style={{ padding: 120, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
      {placements.map((placement) => (
        <Menu key={placement} trigger={<Trigger label={placement} />} placement={placement}>
          <MenuItem>Option A</MenuItem>
          <MenuItem>Option B</MenuItem>
          <MenuItem>Option C</MenuItem>
        </Menu>
      ))}
    </div>
  );
}

export function WithLinks() {
  return (
    <div style={{ padding: 80 }}>
      <Menu trigger={<Trigger label="Navigate" />}>
        <MenuItem href="/dashboard">Dashboard</MenuItem>
        <MenuItem href="/settings">Settings</MenuItem>
        <MenuSeparator />
        <MenuItem href="/logout">Sign out</MenuItem>
      </Menu>
    </div>
  );
}

export function ControlledMode() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ padding: 80 }}>
      <p style={{ marginBottom: 16, fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>
        Menu is {open ? 'open' : 'closed'}
      </p>
      <Menu trigger={<Trigger label="Controlled" />} open={open} onOpenChange={setOpen}>
        <MenuItem onSelect={() => setOpen(false)}>Close me</MenuItem>
        <MenuItem>Stay open item</MenuItem>
      </Menu>
    </div>
  );
}
