/**
 * Menu — anchored popover dropdown.
 *
 * ARIA menu pattern: role="menu" / role="menuitem".
 * Click-outside closes, ESC closes, focus trap on open,
 * returns focus to trigger on close.
 *
 * Positioning uses CSS absolute/fixed positioning relative to trigger.
 * No external dependency required.
 */
import * as React from 'react';
export type MenuPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';
export interface MenuProps {
    trigger: React.ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placement?: MenuPlacement;
    children: React.ReactNode;
    closeOnSelect?: boolean;
    ariaLabel?: string;
}
export interface MenuItemProps {
    children: React.ReactNode;
    onSelect?: () => void;
    href?: string;
    disabled?: boolean;
    destructive?: boolean;
    icon?: React.ReactNode;
}
export interface MenuSeparatorProps {
}
export interface MenuLabelProps {
    children: React.ReactNode;
}
export declare function Menu({ trigger, open: controlledOpen, defaultOpen, onOpenChange, placement, children, closeOnSelect, ariaLabel, }: MenuProps): React.ReactElement;
export declare function MenuItem({ children, onSelect, href, disabled, destructive, icon, }: MenuItemProps): React.ReactElement;
export declare function MenuSeparator(_props: MenuSeparatorProps): React.ReactElement;
export declare function MenuLabel({ children }: MenuLabelProps): React.ReactElement;
//# sourceMappingURL=Menu.d.ts.map