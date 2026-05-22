/**
 * PlatformAppShell tests — DS-SIMPLIFY 05.
 *
 * Contract:
 *  (a) Renders brand, modules, user initials, children, landmark roles.
 *  (b) Module click fires onNavigate; disabled module renders disabled control
 *      with tooltip-reason; badge renders.
 *  (c) App switcher menu opens and fires onSwitchApp with key + url.
 *  (d) User menu opens and Sign out fires onSignOut.
 *  (e) CompanyGroupSwitcher shows when companyGroups.length > 1; hidden when
 *      length ≤ 1.
 *  (f) Cmd+K (and Ctrl+K) opens the CommandPalette when provided.
 *  (g) a11y landmarks: banner header, nav, main; menus expose ARIA menu.
 */
import * as React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  PlatformAppShell,
  type ModuleDef,
  type AppDef,
  type UserDef,
  type CompanyGroup,
} from '../react/PlatformAppShell';

const USER: UserDef = { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com' };

const MODULES: ModuleDef[] = [
  { id: 'home', label: 'Home', href: '/home' },
  { id: 'risks', label: 'Risks', href: '/risks', badge: 3 },
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
];

const GROUPS_MULTI: CompanyGroup[] = [
  { id: 'g-acme', name: 'Acme' },
  { id: 'g-globex', name: 'Globex' },
];

function renderShell(overrides: Partial<React.ComponentProps<typeof PlatformAppShell>> = {}) {
  const props: React.ComponentProps<typeof PlatformAppShell> = {
    brand: 'companyco',
    modules: MODULES,
    appKey: 'cc',
    user: USER,
    apps: APPS,
    onSignOut: vi.fn(),
    onSwitchApp: vi.fn(),
    children: <p>page body</p>,
    ...overrides,
  };
  const utils = render(<PlatformAppShell {...props} />);
  return { ...utils, props };
}

describe('PlatformAppShell — landmarks + slots', () => {
  it('renders brand, children, and a11y landmarks', () => {
    renderShell();
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /modules/i })).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByText('page body')).toBeTruthy();
    expect(screen.getByText('CompanyCo')).toBeTruthy(); // brand label
  });

  it('renders topBarSlot content in the top bar', () => {
    renderShell({ topBarSlot: <button data-testid="extra-action">Create</button> });
    expect(screen.getByTestId('extra-action')).toBeTruthy();
  });

  it('renders navFooterSlot inside the nav', () => {
    renderShell({ navFooterSlot: <button data-testid="nav-foot">Settings</button> });
    const nav = screen.getByRole('navigation', { name: /modules/i });
    expect(within(nav).getByTestId('nav-foot')).toBeTruthy();
  });
});

describe('PlatformAppShell — modules', () => {
  it('fires onNavigate when an enabled module is clicked', () => {
    const onNavigate = vi.fn();
    renderShell({ onNavigate });
    fireEvent.click(screen.getByRole('link', { name: /home/i }));
    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('renders badge for modules that supply one', () => {
    renderShell();
    expect(screen.getByLabelText('3 new')).toBeTruthy();
  });

  it('renders disabled module as a disabled control with tooltip reason', () => {
    renderShell();
    const adminButton = screen.getByRole('button', { name: /admin/i });
    expect(adminButton).toBeDisabled();
    expect(adminButton.getAttribute('aria-disabled')).toBe('true');
    // Tooltip element carries the disabled reason text (closed by default —
    // aria-describedby is attached when it opens; we assert the role+text
    // exist so consumers wiring focus/hover get the reason).
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.textContent).toContain('You lack admin permissions');
  });

  it('marks the active module with aria-current=page', () => {
    renderShell({ activeModuleId: 'risks' });
    const link = screen.getByRole('link', { name: /risks/i });
    expect(link.getAttribute('aria-current')).toBe('page');
  });
});

describe('PlatformAppShell — app switcher', () => {
  it('opens the app menu and fires onSwitchApp with key+url', () => {
    const onSwitchApp = vi.fn();
    renderShell({ onSwitchApp });
    fireEvent.click(screen.getByRole('button', { name: /switch app/i }));
    const menu = screen.getByRole('menu', { name: /switch app/i });
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Automation' }));
    expect(onSwitchApp).toHaveBeenCalledWith('aa', 'https://aa.example');
  });
});

describe('PlatformAppShell — user menu', () => {
  it('opens the user menu and fires onSignOut', () => {
    const onSignOut = vi.fn();
    renderShell({ onSignOut });
    fireEvent.click(screen.getByRole('button', { name: /open account menu/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});

describe('PlatformAppShell — company-group switcher', () => {
  it('renders CompanyGroupSwitcher when memberships > 1', () => {
    renderShell({ companyGroups: GROUPS_MULTI });
    expect(screen.getByRole('combobox', { name: /switch company group/i })).toBeTruthy();
  });

  it('hides CompanyGroupSwitcher when single tenant (length ≤ 1)', () => {
    renderShell({ companyGroups: [{ id: 'g-acme', name: 'Acme' }] });
    expect(screen.queryByRole('combobox', { name: /switch company group/i })).toBeNull();
  });
});

describe('PlatformAppShell — Cmd+K command palette', () => {
  it('opens the palette when Cmd+K is pressed and commandPalette is provided', () => {
    renderShell({
      commandPalette: {
        items: [{ id: 'go-home', label: 'Go Home', onSelect: () => undefined }],
      },
    });
    expect(screen.queryByPlaceholderText(/search commands/i)).toBeNull();
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
      );
    });
    expect(screen.getByPlaceholderText(/search commands/i)).toBeTruthy();
  });

  it('also opens via Ctrl+K (non-mac)', () => {
    renderShell({
      commandPalette: {
        items: [{ id: 'go-home', label: 'Go Home', onSelect: () => undefined }],
      },
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
      );
    });
    expect(screen.getByPlaceholderText(/search commands/i)).toBeTruthy();
  });

  it('does NOT bind Cmd+K when commandPalette prop is omitted', () => {
    renderShell();
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
      );
    });
    expect(screen.queryByPlaceholderText(/search commands/i)).toBeNull();
  });
});
