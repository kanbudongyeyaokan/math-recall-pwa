import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import type { PlayerProfile } from '../types'
import { getNewUnlockEvents } from './unlocks'

const atReviews = (totalReviews: number): PlayerProfile => ({ ...defaultProfile, totalReviews })

describe('首次解锁事件', () => {
  it('跨过阈值时返回成就、人物和任务，未跨过时不重复返回', () => {
    const events = getNewUnlockEvents(atReviews(0), atReviews(1))
    expect(events.map((event) => event.kind)).toEqual(expect.arrayContaining(['achievement', 'character', 'quest']))
    expect(getNewUnlockEvents(atReviews(1), atReviews(2)).some((event) => event.id === 'achievement:焜火初燃')).toBe(false)
  })

  it('到达命运抉择阈值时只触发一次挑战提醒', () => {
    expect(getNewUnlockEvents(atReviews(5), atReviews(6)).some((event) => event.id === 'challenge:family-call')).toBe(true)
    expect(getNewUnlockEvents(atReviews(6), atReviews(7)).some((event) => event.id === 'challenge:family-call')).toBe(false)
  })
})
