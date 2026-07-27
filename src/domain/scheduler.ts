import type { ReviewOutcome, ReviewRating } from '../types'

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const

const XP_BY_RATING: Record<ReviewRating, number> = {
  again: 4,
  hint: 8,
  independent: 14,
  multiple: 22
}

export function getReviewOutcome(
  currentIntervalIndex: number,
  rating: ReviewRating,
  now = Date.now()
): ReviewOutcome {
  let nextIndex: number

  switch (rating) {
    case 'again':
      nextIndex = 0
      break
    case 'hint':
      nextIndex = Math.max(0, currentIntervalIndex)
      break
    case 'independent':
      nextIndex = Math.min(REVIEW_INTERVALS.length - 1, currentIntervalIndex + 1)
      break
    case 'multiple':
      nextIndex = Math.min(REVIEW_INTERVALS.length - 1, currentIntervalIndex + 2)
      break
  }

  const intervalDays = REVIEW_INTERVALS[nextIndex]
  const nextReviewAt = now + intervalDays * 24 * 60 * 60 * 1000

  return {
    nextReviewAt,
    intervalIndex: nextIndex,
    intervalDays,
    xp: XP_BY_RATING[rating]
  }
}

export function isDue(nextReviewAt: number, now = Date.now()) {
  return nextReviewAt <= now
}
