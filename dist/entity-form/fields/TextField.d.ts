import * as React from 'react';
import type { FieldPrimitiveProps } from './types.js';
export interface TextFieldProps extends FieldPrimitiveProps<string> {
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    maxLength?: number;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
}
export declare function TextField({ name, form, label, hint, required, disabled, readOnly, inputMode, maxLength, placeholder, type, }: TextFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TextField.d.ts.map