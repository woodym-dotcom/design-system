/**
 * @deprecated Internal as of DS-SIMPLIFY 05. Use `PlatformAppShell` from
 * `@ds/core/react` instead — top-level "+" menus belong in the shell's
 * `topBarSlot`. CreateMenu is no longer publicly exported.
 *
 * <CreateMenu> — single create entry-point primitive (G8 / "+" menu pattern).
 *
 * A "+" button that opens a dropdown menu with CreateMenuItem[] sub-actions.
 * Built-in sub-action kinds: manual | ai-generated | from-template | import | custom.
 * Consumers extend with `kind: 'custom'` and a `label`.
 *
 * Accessibility:
 *  - Trigger: role="button", aria-haspopup="menu", aria-expanded.
 *  - Menu: role="menu", aria-label.
 *  - Items: role="menuitem", aria-disabled.
 *  - Keyboard: Escape closes; ArrowDown/ArrowUp navigate items; Enter/Space activate.
 *  - Outside-click closes.
 *  - Focus returns to trigger on close.
 *
 * Composes cc-menu-anchor / cc-menu / cc-menu__item CSS primitives.
 * Does NOT import a DropdownMenu component — one doesn't exist in DS yet;
 * uses the existing cc-menu CSS classes directly (search-before-build §14).
 */
import * as React from 'react';
export type CreateMenuKind = 'manual' | 'ai-generated' | 'from-template' | 'import' | 'custom';
export interface CreateMenuItem {
    /** One of the built-in kinds or 'custom'. */
    kind: CreateMenuKind;
    /** Display label. Required for kind='custom'; optional for built-ins (falls back to default label). */
    label?: string;
    /** Called when the item is activated. */
    onSelect: () => void;
    /** When true, item is shown but not interactive. */
    disabled?: boolean;
}
export interface CreateMenuProps {
    /** Sub-actions to show in the dropdown. */
    items: CreateMenuItem[];
    /** Accessible label for the menu. Default: "Create options". */
    menuLabel?: string;
    /** Label / content inside the trigger button. Default: "+". */
    triggerLabel?: React.ReactNode;
    /** Additional class on the root anchor element. */
    className?: string;
}
export declare function CreateMenu({ items, menuLabel, triggerLabel, className, }: CreateMenuProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CreateMenu.d.ts.map