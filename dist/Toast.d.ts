import * as React from 'react';
export type ToastTone = 'info' | 'success' | 'warning' | 'error';
export interface ToastAction {
    label: string;
    onClick: () => void;
}
export interface Toast {
    id: string;
    title?: string;
    message: string;
    tone?: ToastTone;
    /** Auto-dismiss after this many ms. 0 = sticky. Default 5000. */
    durationMs?: number;
    /** Single action (often "Undo"). Renders as a button on the toast. */
    action?: ToastAction;
}
export type ToastInput = Omit<Toast, 'id'> & {
    id?: string;
};
export interface ToastContextValue {
    toast: (input: ToastInput) => string;
    dismiss: (id: string) => void;
    clear: () => void;
    /** Subscribers can read the live list (e.g. for tests/devtools). */
    toasts: ReadonlyArray<Toast>;
}
export interface ToastProviderProps {
    children: React.ReactNode;
    /** Maximum visible toasts; older ones drop off the top. Default 5. */
    max?: number;
    /** Render position. Default 'bottom-right'. */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
}
export declare function ToastProvider({ children, max, position, }: ToastProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): ToastContextValue;
//# sourceMappingURL=Toast.d.ts.map