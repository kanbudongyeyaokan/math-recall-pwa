import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { getBondStatus, getPendingEncounter, STORY_ENCOUNTERS } from './encounters'
import { STORY_CHARACTERS } from './story'

describe('剧情抉择与人物羁绊', () => {
  it('按真实掌握力只返回尚未完成的最早事件', () => {
    const profile = { ...defaultProfile, masteredProblemIds: Array.from({ length: 40 }, (_, index) => `q${index}`) }
    expect(getPendingEncounter(profile)?.id).toBe('family-call')
    expect(getPendingEncounter({ ...profile, storyChoices: { 'family-call': 'honest' } })?.id).toBe('rival-dare')
  })

  it('二十五个事件奖励对等且羁绊有阶段反馈', () => {
    expect(STORY_ENCOUNTERS).toHaveLength(25)
    expect(STORY_ENCOUNTERS.every((event) => event.choices[0].coinReward === event.choices[1].coinReward)).toBe(true)
    expect(STORY_ENCOUNTERS.filter((event) => event.characterId === 'chen-yanjun').length).toBeGreaterThanOrEqual(7)
    expect([0, 8, 16, 32, 48].map(getBondStatus)).toEqual(['初次相遇', '留下印象', '彼此信任', '并肩知己', '生死相托'])
  })

  it('事件门槛严格递增、ID 唯一且所有角色引用有效', () => {
    const thresholds = STORY_ENCOUNTERS.map((event) => event.threshold)
    const characterIds = new Set(STORY_CHARACTERS.map((character) => character.id))
    expect(thresholds.every((threshold, index) => index === 0 || threshold > thresholds[index - 1])).toBe(true)
    expect(new Set(STORY_ENCOUNTERS.map((event) => event.id)).size).toBe(STORY_ENCOUNTERS.length)
    expect(STORY_ENCOUNTERS.every((event) => characterIds.has(event.characterId))).toBe(true)
    expect(STORY_ENCOUNTERS.every((event) => event.choices.every((choice) => characterIds.has(choice.bondTargetId)))).toBe(true)
  })
})
