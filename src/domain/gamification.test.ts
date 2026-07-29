import { describe, expect, it } from 'vitest'
import { applyStudyToProfile, calculateCoinReward, getEncouragement, getRealmAdvance, getRealmProgress, getUnlockedTitles } from './gamification'
import type { PlayerProfile } from '../types'

const profile: PlayerProfile = {
  id: 'player',
  name: '何耀焜',
  xp: 70,
  coins: 12,
  lifetimeCoins: 12,
  streak: 2,
  lastStudyDate: '2026-07-26',
  totalReviews: 9,
  selectedTitle: '斗气化题',
  independentReviews: 9,
  multipleSolutionReviews: 4,
  correctChoiceReviews: 14,
  breakthroughCount: 0,
  ownedItemIds: ['outfit-apprentice', 'aura-none', 'weapon-scroll', 'accessory-none', 'companion-none'],
  equippedOutfitId: 'outfit-apprentice',
  equippedAuraId: 'aura-none',
  equippedWeaponId: 'weapon-scroll',
  equippedAccessoryId: 'accessory-none',
  activeCompanionId: 'companion-none',
  activeTechniqueId: 'definition-heart',
  techniqueMastery: {},
  storyChoices: {},
  characterBonds: {},
  masteredProblemIds: [],
  correctedProblemIds: [],
  bossVictories: {},
  bossAttempts: 0,
  surpriseChallengeWins: 0,
  surpriseChallengeLosses: 0,
  surpriseChallengeBestScore: 0,
  duelWins: 0,
  duelLosses: 0,
  duelRecords: {}
}

describe('斗气境界与奖励进度', () => {
  it('累计经验、连续复习并解锁行为称号', () => {
    const next = applyStudyToProfile(profile, 14, new Date('2026-07-27T12:00:00+08:00'), {
      rating: 'independent',
      isCorrect: true,
      coinsEarned: 13
    })
    expect(next.xp).toBe(84)
    expect(next.streak).toBe(3)
    expect(next.totalReviews).toBe(10)
    expect(next.coins).toBe(25)
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

  it('首次完成结算灵石，同题当天重复不再结算', () => {
    expect(calculateCoinReward('independent', true, false)).toBe(13)
    expect(calculateCoinReward('multiple', false, true)).toBe(0)
    expect(getEncouragement('何耀焜', 'multiple', true, 0)).toContain('何耀焜')
  })
})
