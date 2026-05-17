import * as React from 'react';
export type DrawerSide = 'right' | 'left' | 'bottom' | 'top';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    /** Accessible name + visible title. */
    title: React.ReactNode;
    /** Optional subtitle row. */
    subtitle?: React.ReactNode;
    /** Optional footer (e.g. action buttons). */
    footer?: React.ReactNode;
    /** Body content. */
    children: React.ReactNode;
    /** Edge the drawer enters from. Default 'right'. */
    side?: DrawerSide;
    /** Visual size (max width for left/right, max height for top/bottom). */
    size?: DrawerSize;
    /** Close when the backdrop is clicked. Default true. */
    closeOnBackdropClick?: boolean;
    /** Close on Escape. Default true. */
    closeOnEscape?: boolean;
    className?: string;
}
/**
 * Generic slide-in drawer. Distinct from `DetailPane` (which is a record
 * detail surface with a fixed section list) — use Drawer when you need
 * a side panel that hosts arbitrary content (filters, settings, wizards).
 */
export declare function Drawer({ open, onClose, title, subtitle, footer, children, side, size, closeOnBackdropClick, closeOnEscape, className, }: DrawerProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=Drawer.d.ts.map