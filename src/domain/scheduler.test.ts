import { describe, expect, it } from 'vitest'
import { getReviewOutcome, REVIEW_INTERVALS } from './scheduler'

describe('间隔复习算法', () => {
  const now = new Date('2026-07-27T08:00:00+08:00').getTime()

  it('不会时回到 1 天', () => {
    const outcome = getReviewOutcome(4, 'again', now)
    expect(outcome.intervalIndex).toBe(0)
    expect(outcome.intervalDays).toBe(1)
  })

  it('独立完成时前进一级且不超过 30 天', () => {
    expect(getReviewOutcome(1, 'independent', now).intervalDays).toBe(7)
    expect(getReviewOutcome(4, 'independent', now).intervalDays).toBe(30)
  })

  it('多解时前进两级', () => {
    const outcome = getReviewOutcome(0, 'multiple', now)
    expect(outcome.intervalDays).toBe(REVIEW_INTERVALS[2])
    expect(outcome.xp).toBeGreaterThan(getReviewOutcome(0, 'hint', now).xp)
  })
})
