import * as React from 'react';

export interface KbdProps {
  /** Key or keys to render. Strings are joined with " + ". */
  keys?: string | string[];
  /** Alternative to keys — stringified and used when keys is not provided. */
  children?: React.ReactNode;
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
function stringify(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(stringify).join('');
  return '';
}

export function Kbd({ keys, children, size = 'md', label, className }: KbdProps) {
  const effectiveKeys = keys ?? stringify(children);
  const list = Array.isArray(effectiveKeys) ? effectiveKeys : [effectiveKeys];
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
