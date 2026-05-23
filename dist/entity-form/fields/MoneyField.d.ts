import type { FieldPrimitiveProps } from './types.js';
export interface MoneyValue {
    /** `null` represents an empty input (distinct from a real `0`). */
    amount: number | null;
    currency: string;
}
export interface MoneyFieldProps extends FieldPrimitiveProps<MoneyValue> {
    currencies: string[];
    defaultCurrency?: string;
}
export declare function MoneyField({ name, form, label, hint, required, disabled, currencies, defaultCurrency }: MoneyFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MoneyField.d.ts.map