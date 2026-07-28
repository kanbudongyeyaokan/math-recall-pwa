import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { getBondStatus, getPendingEncounter, STORY_ENCOUNTERS } from './encounters'

describe('剧情抉择与人物羁绊', () => {
  it('按做题数只返回尚未完成的最早事件', () => {
    const profile = { ...defaultProfile, totalReviews: 40 }
    expect(getPendingEncounter(profile)?.id).toBe('family-call')
    expect(getPendingEncounter({ ...profile, storyChoices: { 'family-call': 'honest' } })?.id).toBe('rival-dare')
  })

  it('十二个事件奖励对等且羁绊有阶段反馈', () => {
    expect(STORY_ENCOUNTERS).toHaveLength(12)
    expect(STORY_ENCOUNTERS.every((event) => event.choices[0].coinReward === event.choices[1].coinReward)).toBe(true)
    expect(STORY_ENCOUNTERS.filter((event) => event.characterId === 'chen-yanjun')).toHaveLength(3)
    expect([0, 8, 16, 32, 48].map(getBondStatus)).toEqual(['初次相遇', '留下印象', '彼此信任', '并肩知己', '生死相托'])
  })
})
