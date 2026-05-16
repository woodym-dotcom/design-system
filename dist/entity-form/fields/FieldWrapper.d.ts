/**
 * Shared field wrapper — renders label, input slot, and always-mounted error/hint slot.
 * G4 invariant: error slot is ALWAYS in the DOM; text is swapped in-place.
 */
import * as React from 'react';
interface FieldWrapperProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}
export declare function FieldWrapper({ id, label, hint, error, required, children, className, }: FieldWrapperProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FieldWrapper.d.ts.map