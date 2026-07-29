import { describe, expect, it } from 'vitest'
import type { PlayerProfile } from '../types'
import { getReviewVoiceCue, getStoryVoiceCue, normalizeSpeechText } from './voice'

const profile = (totalReviews: number) => ({ totalReviews } as PlayerProfile)

describe('角色语音导演', () => {
  it('只从当前进度已经解锁的人物中选择说话者', () => {
    const cue = getReviewVoiceCue({
      profile: profile(0), rating: 'again', advanced: false, realmBreakthrough: false, seed: 2
    })
    expect(['he-yaokun', 'he-xinping', 'zhong-shanyan']).toContain(cue.characterId)
    expect(cue.text.length).toBeGreaterThan(8)
  })

  it('多解结算优先由当前已解锁情缘路线回应', () => {
    const cue = getReviewVoiceCue({
      profile: profile(80), rating: 'multiple', advanced: false, realmBreakthrough: false,
      activeRouteId: 'chen-yanjun', seed: 5
    })
    expect(cue.characterId).toBe('chen-yanjun')
    expect(cue.toneLabel).toBe('同行羁绊')
  })

  it('破境时使用当前情缘角色的专属破境台词', () => {
    const cue = getReviewVoiceCue({
      profile: profile(200), rating: 'independent', advanced: true, realmBreakthrough: true,
      activeRouteId: 'medusa', seed: 9
    })
    expect(cue.characterId).toBe('medusa')
    expect(cue.text).toContain('境界')
  })

  it('剧情朗读会清理公式标记并限制过长文本', () => {
    expect(normalizeSpeechText('用 $f(x)$ 完成 **证明**')).toBe('用 一道公式 完成 证明')
    expect(normalizeSpeechText('甲'.repeat(240))).toHaveLength(180)
    expect(getStoryVoiceCue('he-xinping', '先把自己的路走稳。').speaker).toBe('何新平')
  })
})
