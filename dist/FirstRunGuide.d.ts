import * as React from 'react';
export interface FirstRunStep {
    id: string;
    /** Step label. */
    title: string;
    /** Optional supporting copy. */
    description?: string;
    /**
     * Action — primary "Do it" CTA OR a link. Step is auto-marked done
     * after onClick resolves (unless `done` is controlled).
     */
    action?: {
        label: string;
        onClick?: () => void | Promise<void>;
        href?: string;
    };
    /** Optional secondary action — "Skip", "Learn more", etc. */
    secondary?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    /** Optional icon. */
    icon?: React.ReactNode;
    /**
     * Controlled completion state. When omitted, the guide tracks
     * "done" internally based on which step's action has been invoked.
     */
    done?: boolean;
    /** Mark step as skippable. */
    skippable?: boolean;
}
export interface FirstRunGuideProps {
    /** Heading shown above the steps. */
    title: string;
    /** Optional supporting copy under the title. */
    description?: string;
    /** Steps, ordered. The first not-done step is auto-expanded. */
    steps: FirstRunStep[];
    /** Called when all steps are done. */
    onComplete?: () => void;
    /** Footer rendered after the steps (e.g. "Skip onboarding" link). */
    footer?: React.ReactNode;
    /** Optional rendered above the title (e.g. a hero illustration). */
    hero?: React.ReactNode;
    className?: string;
}
/**
 * First-run / empty-tenant onboarding pattern. Renders an accordion-style
 * ordered checklist: the first not-done step is expanded, others are
 * collapsed. When every step is `done`, the guide collapses and
 * `onComplete` fires.
 *
 * Composes on `EmptyState` semantics — pair with `<EmptyState>` for the
 * surface body, then drop this guide as the action.
 */
export declare function FirstRunGuide({ title, description, steps, onComplete, footer, hero, className, }: FirstRunGuideProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FirstRunGuide.d.ts.map