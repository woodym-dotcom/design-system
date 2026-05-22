/**
 * <ExpandableDetailPane> — right-side detail pane with full-screen toggle
 * and composable tab structure.
 *
 * §14 L2: extends DetailPane (which already exists). Rather than modifying
 * DetailPane (breaking change), this is a superset with tab + full-screen
 * features. Shares FOCUSABLE_SELECTOR logic and CSS primitives.
 *
 * Accessibility:
 *  - role="dialog" with aria-modal, aria-labelledby.
 *  - Focus trap: Tab / Shift+Tab cycle within pane.
 *  - Escape closes pane OR exits full-screen (first press exits full-screen
 *    when in full-screen mode; second press closes pane).
 *  - Tabs use role="tablist" / role="tab" / role="tabpanel" pattern.
 *  - Full-screen toggle button has a meaningful aria-label.
 */
import * as React from 'react';
export interface ExpandableDetailPaneTab {
    id: string;
    label: string;
    render: () => React.ReactNode;
}
export interface ExpandableDetailPaneProps {
    open: boolean;
    onClose: () => void;
    title: string;
    /**
     * Tabs to render inside the pane. At least one required when using tabs mode.
     * When only one tab is provided, the tab bar is hidden and content is shown directly.
     */
    tabs: ExpandableDetailPaneTab[];
    /** Initially active tab id. Defaults to the first tab. */
    defaultTabId?: string;
    /** Subtitle shown below the title. */
    subtitle?: string;
    /** Optional actions (e.g. Edit, Delete buttons) rendered in the header. */
    headerActions?: React.ReactNode;
    /** Whether to allow full-screen expansion. Default true. */
    allowFullScreen?: boolean;
    className?: string;
}
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="detail-right" expandable>`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export declare function ExpandableDetailPane({ open, onClose, title, tabs, defaultTabId, subtitle, headerActions, allowFullScreen, className, }: ExpandableDetailPaneProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ExpandableDetailPane.d.ts.map