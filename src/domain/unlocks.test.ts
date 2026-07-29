import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import type { PlayerProfile } from '../types'
import { getNewUnlockEvents } from './unlocks'

const atPower = (power: number): PlayerProfile => ({
  ...defaultProfile,
  totalReviews: power,
  masteredProblemIds: Array.from({ length: power }, (_, index) => `q${index}`)
})

describe('首次解锁事件', () => {
  it('跨过阈值时返回成就、人物和任务，未跨过时不重复返回', () => {
    const events = getNewUnlockEvents(atPower(0), atPower(1))
    expect(events.map((event) => event.kind)).toEqual(expect.arrayContaining(['achievement', 'character', 'quest']))
    expect(getNewUnlockEvents(atPower(1), atPower(2)).some((event) => event.id === 'achievement:焜火初燃')).toBe(false)
  })

  it('到达命运抉择阈值时只触发一次挑战提醒', () => {
    expect(getNewUnlockEvents(atPower(5), atPower(6)).some((event) => event.id === 'challenge:family-call')).toBe(true)
    expect(getNewUnlockEvents(atPower(6), atPower(7)).some((event) => event.id === 'challenge:family-call')).toBe(false)
  })
})
