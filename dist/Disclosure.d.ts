/**
 * Disclosure — collapsible summary/content panel.
 *
 * Uses native <details>/<summary> for uncontrolled mode. Controlled mode
 * manages open state externally.
 *
 * Accordion pattern: compose multiple `<Disclosure>` instances directly. For
 * single-open semantics, lift `open` to a parent and pass `open` / `onOpenChange`
 * to each child; for multi-open, give each Disclosure independent state.
 * Example:
 *
 *   const [openId, setOpenId] = useState<string | null>(null);
 *   <>
 *     <Disclosure summary="A" open={openId === 'a'} onOpenChange={(o) => setOpenId(o ? 'a' : null)}>…</Disclosure>
 *     <Disclosure summary="B" open={openId === 'b'} onOpenChange={(o) => setOpenId(o ? 'b' : null)}>…</Disclosure>
 *   </>
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
export declare function Disclosure({ summary, defaultOpen, open: controlledOpen, onOpenChange, icon, className, style, children, }: DisclosureProps): React.ReactElement;
//# sourceMappingURL=Disclosure.d.ts.map