import * as React from 'react';

export interface KbdProps {
  /** Key or keys to render. Strings are joined with " + ". */
  keys: string | string[];
  /** Visual size. */
  size?: 'sm' | 'md';
  /** Optional aria-label override. Defaults to "Keyboard shortcut: …". */
  label?: string;
  className?: string;
}

const ALIASES: Record<string, string> = {
  mod: navigatorMetaKey(),
  cmd: '⌘',
  command: '⌘',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  option: '⌥',
  enter: '↵',
  return: '↵',
  esc: 'Esc',
  escape: 'Esc',
  tab: 'Tab',
  space: 'Space',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

function navigatorMetaKey(): string {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
}

function render(key: string): string {
  const k = key.toLowerCase();
  return ALIASES[k] ?? key;
}

/**
 * Renders one or more keyboard keys as compact rounded tokens. Use for
 * shortcut hints in menus, tooltips, and command palettes.
 */
export function Kbd({ keys, size = 'md', label, className }: KbdProps) {
  const list = Array.isArray(keys) ? keys : [keys];
  const ariaLabel = label ?? `Keyboard shortcut: ${list.join(' + ')}`;
  return (
    <span
      className={['cc-kbd-group', `cc-kbd-group--${size}`, className].filter(Boolean).join(' ')}
      role="group"
      aria-label={ariaLabel}
    >
      {list.map((k, i) => (
        <React.Fragment key={`${k}-${i}`}>
          <kbd className="cc-kbd">{render(k)}</kbd>
          {i < list.length - 1 && <span aria-hidden="true" className="cc-kbd-sep">+</span>}
        </React.Fragment>
      ))}
    </span>
  );
}
