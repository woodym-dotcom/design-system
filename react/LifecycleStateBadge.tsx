/**
 * LifecycleStateBadge — maps governance lifecycle status strings to colour-coded badges.
 *
 * @deprecated Use `Tag` from `@ds/core/react` with an explicit `tone` prop instead.
 * Map the status → TagTone at the call site and pass `variant="badge"`.
 * Note: the legacy `'danger'` tone is accepted by Tag as a back-compat alias for `'error'`.
 * Cutover: DS-SIMPLIFY 14.
 */
import type { ReactNode } from 'react'
import type { ChipTone } from './Chip'

// Re-export ChipTone from unified source for backward-compat consumers.
export type { ChipTone } from './Chip'

function lifecycleTone(status: string): ChipTone {
  switch (status) {
    case 'active':
    case 'approved':
    case 'auto_approved':
    case 'break_glass_post_hoc_approved':
    case 'ratification':
      return 'success'

    case 'proposed':
    case 'queued':
    case 'break_glass_queued':
    case 'draining-version':
      return 'warning'

    case 'draft':
      return 'accent'

    case 'rejected':
    case 'break_glass_post_hoc_rejected':
      return 'danger'

    case 'superseded':
    case 'break_glass_post_hoc_pending_closure':
      return 'neutral'

    default:
      return 'neutral'
  }
}

export type LifecycleStateBadgeProps = {
  status: string
  children?: ReactNode
}

/**
 * Renders a lifecycle state label as a colour-coded badge.
 *
 * Maps governance case state machine and policy lifecycle states
 * (draft / proposed / active / superseded / rejected) to semantic color tones.
 * Uses the underlying design system tone CSS classes for consistent styling.
 */
export function LifecycleStateBadge({ status, children }: LifecycleStateBadgeProps) {
  const tone = lifecycleTone(status)
  const displayText = children ?? status
  // Normalise 'danger' → 'error' for CSS class names (unified tone mapping).
  const cssTone = tone === 'danger' ? 'error' : tone
  const className = cssTone !== 'neutral' ? `cc-chip cc-chip--${cssTone}` : 'cc-chip'
  return <span className={className}>{displayText}</span>
}
