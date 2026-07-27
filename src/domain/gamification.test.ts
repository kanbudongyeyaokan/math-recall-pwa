import { describe, expect, it } from 'vitest'
import { applyStudyToProfile, getRealmAdvance, getRealmProgress, getUnlockedTitles } from './gamification'
import type { PlayerProfile } from '../types'

const profile: PlayerProfile = {
  id: 'player',
  xp: 70,
  streak: 2,
  lastStudyDate: '2026-07-26',
  totalReviews: 9,
  selectedTitle: '斗气化题',
  independentReviews: 9,
  multipleSolutionReviews: 4,
  correctChoiceReviews: 14,
  breakthroughCount: 0
}

describe('斗气境界与奖励进度', () => {
  it('累计经验、连续复习并解锁行为称号', () => {
    const next = applyStudyToProfile(profile, 14, new Date('2026-07-27T12:00:00+08:00'), {
      rating: 'independent',
      isCorrect: true
    })
    expect(next.xp).toBe(84)
    expect(next.streak).toBe(3)
    expect(next.totalReviews).toBe(10)
    expect(getRealmProgress(next.xp).label).toBe('斗者 · 2 星')
    expect(getUnlockedTitles(next)).toEqual(expect.arrayContaining(['错因猎手', '极限破壁者', '定理守门人', '三日凝火']))
  })

  it('中断后从第一天重新开始', () => {
    const next = applyStudyToProfile(profile, 4, new Date('2026-07-29T12:00:00+08:00'))
    expect(next.streak).toBe(1)
  })

  it('在 720 经验时从九星斗者突破为斗师', () => {
    expect(getRealmProgress(719).label).toBe('斗者 · 9 星')
    expect(getRealmProgress(720).label).toBe('斗师 · 1 星')
    const advance = getRealmAdvance(719, 723)
    expect(advance.advanced).toBe(true)
    expect(advance.realmBreakthrough).toBe(true)
  })

  it('斗帝是最终境界', () => {
    expect(getRealmProgress(17_280)).toMatchObject({ realm: '斗帝', isPeak: true })
  })
})
