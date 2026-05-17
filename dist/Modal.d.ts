import * as React from 'react';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'auto';
export interface ModalProps {
    open: boolean;
    onClose: () => void;
    /** Accessible name for the dialog (also rendered as the visual title). */
    title: React.ReactNode;
    /** Optional supporting text below the title. */
    description?: React.ReactNode;
    /** Footer slot — typically primary + secondary buttons. */
    footer?: React.ReactNode;
    /** Body content. */
    children: React.ReactNode;
    /** Visual size, mapped to max-width. Default 'md'. */
    size?: ModalSize;
    /** Close when the backdrop is clicked. Default true. */
    closeOnBackdropClick?: boolean;
    /** Close on Escape. Default true. */
    closeOnEscape?: boolean;
    className?: string;
    /**
     * Optional override of the element to focus on open. Defaults to the
     * first focusable child in the dialog.
     */
    initialFocusRef?: React.RefObject<HTMLElement | null>;
}
/**
 * Generic centred modal dialog. Owns focus trap, ESC, backdrop click,
 * ARIA dialog semantics, and portal mounting. Compose primary content
 * freely as children — Modal does not impose a section layout.
 */
export declare function Modal({ open, onClose, title, description, footer, children, size, closeOnBackdropClick, closeOnEscape, className, initialFocusRef, }: ModalProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=Modal.d.ts.map