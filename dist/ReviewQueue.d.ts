/**
 * ReviewQueue — renders a queue of items pending human review.
 * Each item has approve / reject / escalate actions + optional custom actions.
 */
import * as React from 'react';
export interface ReviewQueueItem {
    id: string;
    title: string;
    meta?: string;
    /** Arbitrary extra data consumers can use in customActions */
    data?: Record<string, unknown>;
}
export interface ReviewQueueCustomAction<T extends ReviewQueueItem = ReviewQueueItem> {
    label: string;
    onAction: (item: T) => void;
    /** Disable for a given item */
    isDisabled?: (item: T) => boolean;
}
export interface ReviewQueueProps<T extends ReviewQueueItem = ReviewQueueItem> {
    items: T[];
    onApprove: (item: T) => void;
    onReject: (item: T) => void;
    onEscalate?: (item: T) => void;
    customActions?: ReviewQueueCustomAction<T>[];
    isLoading?: boolean;
    emptyState?: React.ReactNode;
    className?: string;
}
export declare function ReviewQueue<T extends ReviewQueueItem = ReviewQueueItem>({ items, onApprove, onReject, onEscalate, customActions, isLoading, emptyState, className, }: ReviewQueueProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ReviewQueue.d.ts.map