import * as React from 'react';
export interface DetailPaneSection {
    heading: string;
    content: React.ReactNode;
}
export interface DetailPaneProps {
    open: boolean;
    onClose: () => void;
    title: string;
    sections: DetailPaneSection[];
    className?: string;
    /** Optional subtitle rendered below the title in the header. */
    subtitle?: string;
    /**
     * When provided, enables drag-to-resize on the left edge and persists the
     * user-chosen width to `localStorage[ds-detailpane-width-${resizeKey}]`.
     */
    resizeKey?: string;
    /**
     * Controlled fullscreen state. When omitted, fullscreen is managed
     * internally. Use together with `onFullscreenChange` for controlled usage.
     */
    fullscreen?: boolean;
    /** Called when the fullscreen state toggles. */
    onFullscreenChange?: (fs: boolean) => void;
}
/**
 * @deprecated Since DS-SIMPLIFY 01. Use `<Overlay placement="detail-right">`
 *   instead. Removed at v1.0 (DS-SIMPLIFY 14).
 */
export declare function DetailPane({ open, onClose, title, sections, className, subtitle, resizeKey, fullscreen: fullscreenProp, onFullscreenChange, }: DetailPaneProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DetailPane.d.ts.map