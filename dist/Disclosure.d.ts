/**
 * Disclosure — collapsible summary/content panel.
 * Accordion — composes Disclosures with single or multiple open semantics.
 *
 * Uses native <details>/<summary> for uncontrolled mode.
 * Controlled mode manages open state externally.
 */
import * as React from 'react';
export type DisclosureIcon = 'chevron' | 'plus-minus' | 'none';
export interface DisclosureProps {
    summary: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    icon?: DisclosureIcon;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}
export interface AccordionItem {
    id: string;
    summary: React.ReactNode;
    content: React.ReactNode;
}
export interface AccordionProps {
    type?: 'single' | 'multiple';
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (v: string | string[]) => void;
    items: AccordionItem[];
    icon?: DisclosureIcon;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Disclosure({ summary, defaultOpen, open: controlledOpen, onOpenChange, icon, className, style, children, }: DisclosureProps): React.ReactElement;
export declare function Accordion({ type, defaultValue, value: controlledValue, onValueChange, items, icon, className, style, }: AccordionProps): React.ReactElement;
//# sourceMappingURL=Disclosure.d.ts.map