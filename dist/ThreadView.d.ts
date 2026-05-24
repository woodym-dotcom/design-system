/**
 * ThreadView — messaging pane for outreach/chat surfaces.
 *
 * DS-MIG P1-05.
 *
 * Features:
 *  - chronological message list with inbound (left) / outbound (right) alignment
 *  - auto-scroll to bottom on new messages
 *  - composable input area with send button
 *  - typing indicator (isLoading)
 *  - custom empty state + header slots
 *  - message delivery status indicator
 */
import * as React from "react";
export interface ThreadMessage {
    id: string;
    content: string;
    sender: string;
    timestamp: string | Date;
    direction: "inbound" | "outbound";
    status?: "sent" | "delivered" | "read" | "failed";
}
export interface ThreadViewProps {
    /** Messages in chronological order. */
    messages: ThreadMessage[];
    /** Called when the user submits a message from the input area. */
    onSend?: (content: string) => void;
    /** When true, renders a typing indicator at the bottom of the message list. */
    isLoading?: boolean;
    /** Rendered when messages is empty. */
    emptyState?: React.ReactNode;
    /** Slot rendered above the message list (e.g. conversation subject, participant info). */
    headerSlot?: React.ReactNode;
    /** Placeholder text for the compose input. */
    inputPlaceholder?: string;
    /** Max height of the message list area — enables scrolling. */
    maxHeight?: string | number;
}
/**
 * ThreadView — a messaging pane for outreach and chat surfaces.
 *
 * Messages are rendered chronologically with inbound messages left-aligned
 * and outbound messages right-aligned. The component auto-scrolls to the
 * bottom when new messages arrive.
 */
export declare function ThreadView({ messages, onSend, isLoading, emptyState, headerSlot, inputPlaceholder, maxHeight, }: ThreadViewProps): React.ReactElement;
//# sourceMappingURL=ThreadView.d.ts.map