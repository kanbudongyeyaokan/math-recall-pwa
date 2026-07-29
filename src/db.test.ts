import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import {
  db,
  defaultProfile,
  MathRecallDatabase,
  normalizeProblemRecord,
  normalizeProfileRecord,
  recordSurpriseChallengeResult
} from './db'
import { LEGACY_PRIVATE_BANK_SOURCE } from './data/questionQuality'
import type { PlayerProfile, Problem } from './types'

describe('旧数据迁移归一化', () => {
  const databases: string[] = []

  afterEach(async () => {
    await Promise.all(databases.splice(0).map((name) => Dexie.delete(name)))
  })

  it('为旧题卡补齐开放题和解析字段', () => {
    const legacy = {
      id: 'legacy', kind: 'problem', title: '旧题', statement: '题面', source: '', page: '', tags: [],
      coreMethod: '方法', mistakes: '', answerText: '答案', createdAt: 1, updatedAt: 1,
      nextReviewAt: 1, intervalIndex: -1, reviewCount: 0
    } as unknown as Problem
    const migrated = normalizeProblemRecord(legacy)
    expect(migrated.questionFormat).toBe('open')
    expect(migrated.options).toEqual([])
    expect(migrated.solutionMethods[0].content).toBe('答案')
  })

  it('为旧玩家补齐斗气统计字段', () => {
    const legacy = {
      id: 'player', xp: 20, streak: 1, lastStudyDate: '', totalReviews: 2, selectedTitle: '初见学者',
      ownedItemIds: ['outfit-apprentice', 'aura-none']
    } as unknown as PlayerProfile
    const migrated = normalizeProfileRecord(legacy)
    expect(migrated.multipleSolutionReviews).toBe(0)
    expect(migrated.correctChoiceReviews).toBe(0)
    expect(migrated.name).toBe('何耀焜')
    expect(migrated.coins).toBe(0)
    expect(migrated.ownedItemIds).toEqual(['outfit-apprentice', 'aura-none', 'weapon-scroll', 'accessory-none', 'companion-none'])
    expect(migrated.equippedWeaponId).toBe('weapon-scroll')
    expect(migrated.equippedAccessoryId).toBe('accessory-none')
    expect(migrated.activeCompanionId).toBe('companion-none')
    expect(migrated.activeTechniqueId).toBe('definition-heart')
    expect(migrated.techniqueMastery).toEqual({})
    expect(migrated.storyChoices).toEqual({})
    expect(migrated.surpriseChallengeWins).toBe(0)
    expect(migrated.surpriseChallengeLosses).toBe(0)
    expect(migrated.surpriseChallengeBestScore).toBe(0)
  })

  it('把旧人物羁绊归并到新版角色且不丢点数', () => {
    const legacy = {
      ...normalizeProfileRecord(),
      characterBonds: { 'lin-jianyue': 16, 'chen-yanjun': 8, 'pei-shenxing': 12, 'chen-xiulan': 8 }
    }
    const migrated = normalizeProfileRecord(legacy)
    expect(migrated.characterBonds).toEqual({ 'chen-yanjun': 24, 'zeng-yuxin': 12, 'zhong-shanyan': 8 })
  })

  it('真实打开 v1 数据库时执行 v2 升级并保留已删种子', async () => {
    const name = `migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(1).stores({
      problems: 'id, kind, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id'
    })
    await legacyDb.open()
    await legacyDb.table('problems').put({
      id: 'seed-01', kind: 'problem', title: '旧题', statement: '题面', source: '拾阶数学 · 原创样例', page: '', tags: [],
      coreMethod: '方法', mistakes: '', answerText: '答案', createdAt: 1, updatedAt: 1,
      nextReviewAt: 1, intervalIndex: -1, reviewCount: 0, isSeed: true
    })
    await legacyDb.table('profiles').put({ id: 'player', xp: 20, streak: 1, lastStudyDate: '', totalReviews: 2, selectedTitle: '初见学者' })
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    const [problem, player, dismissed] = await Promise.all([
      upgraded.problems.get('seed-01'),
      upgraded.profiles.get('player'),
      upgraded.settings.get('dismissed-seed-ids')
    ])
    expect(problem?.questionFormat).toBe('open')
    expect(problem?.solutionMethods).toHaveLength(1)
    expect(problem?.source).toBe('斗破数学 · 原创样例')
    expect(player?.selectedTitle).toBe('斗气化题')
    expect(player?.name).toBe('何耀焜')
    expect(player?.coins).toBe(0)
    expect(player?.equippedOutfitId).toBe('outfit-apprentice')
    expect(player?.equippedWeaponId).toBe('weapon-scroll')
    expect(dismissed?.value).toEqual(expect.arrayContaining(['seed-02', 'seed-15']))
    upgraded.close()
  })

  it('真实打开 v5 数据库时迁移人物羁绊与已选情缘路线', async () => {
    const name = `cast-migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(5).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    })
    await legacyDb.open()
    await legacyDb.table('profiles').put({
      ...normalizeProfileRecord(),
      coins: 321,
      totalReviews: 180,
      characterBonds: { 'lin-jianyue': 24, 'su-wanqiao': 8, 'han-che': 16 }
    })
    await legacyDb.table('settings').put({ key: 'active-romance-route', value: 'lin-jianyue', updatedAt: 1 })
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    const [player, route] = await Promise.all([
      upgraded.profiles.get('player'),
      upgraded.settings.get('active-romance-route')
    ])
    expect(player?.coins).toBe(321)
    expect(player?.totalReviews).toBe(180)
    expect(player?.characterBonds).toEqual({ 'chen-yanjun': 24, medusa: 8, 'chen-ruibin': 16 })
    expect(route?.value).toBe('chen-yanjun')
    upgraded.close()
  })

  it('升级到 v7 时归档重复内置题但保留历史做题记录', async () => {
    const name = `dedupe-migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(6).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    })
    await legacyDb.open()
    await legacyDb.table('problems').put({
      id: 'seed-56', kind: 'concept', title: '重复题', statement: '旧题面', source: '旧内置题', page: '', tags: [],
      coreMethod: '旧方法', mistakes: '', answerText: '旧答案', questionFormat: 'open', options: [], correctOptionIds: [],
      solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: 0, reviewCount: 1, isSeed: true
    })
    await legacyDb.table('problems').bulkPut([
      {
        id: 'zy30-heyaokun-001', kind: 'problem', title: '旧模板题', statement: '只换数字的旧题', source: LEGACY_PRIVATE_BANK_SOURCE,
        page: '1-75', tags: [], coreMethod: '旧方法', mistakes: '', answerText: '旧答案', questionFormat: 'open', options: [],
        correctOptionIds: [], solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: 2, reviewCount: 6, isSeed: false
      },
      {
        id: 'zy30-heyaokun-002', kind: 'problem', title: '何耀焜自建题', statement: '不能误归档', source: '何耀焜手工新增',
        page: '', tags: [], coreMethod: '自建方法', mistakes: '', answerText: '答案', questionFormat: 'open', options: [],
        correctOptionIds: [], solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0, isSeed: false
      },
      {
        id: 'zy30-heyaokun-1001', kind: 'problem', title: '范围外题目', statement: '不能误归档', source: LEGACY_PRIVATE_BANK_SOURCE,
        page: '', tags: [], coreMethod: '新方法', mistakes: '', answerText: '答案', questionFormat: 'open', options: [],
        correctOptionIds: [], solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0, isSeed: false
      }
    ])
    await legacyDb.table('reviews').add({ problemId: 'seed-56', rating: 'independent', reviewedAt: 1, nextReviewAt: 2, intervalIndex: 1, xpEarned: 10 })
    await legacyDb.table('reviews').add({ problemId: 'zy30-heyaokun-001', rating: 'independent', reviewedAt: 1, nextReviewAt: 2, intervalIndex: 2, xpEarned: 18 })
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    expect((await upgraded.problems.get('seed-56'))?.archived).toBe(true)
    expect((await upgraded.problems.get('zy30-heyaokun-001'))?.archived).toBe(true)
    expect((await upgraded.problems.get('zy30-heyaokun-002'))?.archived).not.toBe(true)
    expect((await upgraded.problems.get('zy30-heyaokun-1001'))?.archived).not.toBe(true)
    expect(await upgraded.reviews.where('problemId').equals('seed-56').count()).toBe(1)
    expect(await upgraded.reviews.where('problemId').equals('zy30-heyaokun-001').count()).toBe(1)
    upgraded.close()
  })

  it('同一场突发邀战重复结算时不会重复增加灵石或胜场', async () => {
    await db.delete()
    await db.open()
    await db.profiles.put({ ...defaultProfile, coins: 10, lifetimeCoins: 10 })

    const first = await recordSurpriseChallengeResult({
      challengeId: 'ambush-idempotent',
      rivalId: 'zeng-yuxin',
      score: 88,
      passed: true,
      timedOut: false,
      now: 100
    })
    const repeated = await recordSurpriseChallengeResult({
      challengeId: 'ambush-idempotent',
      rivalId: 'zeng-yuxin',
      score: 88,
      passed: true,
      timedOut: false,
      now: 101
    })
    await recordSurpriseChallengeResult({
      challengeId: 'ambush-later-defeat',
      rivalId: 'yuan-yue',
      score: 60,
      passed: false,
      timedOut: false,
      now: 102
    })
    const staleRepeat = await recordSurpriseChallengeResult({
      challengeId: 'ambush-idempotent',
      rivalId: 'zeng-yuxin',
      score: 88,
      passed: true,
      timedOut: false,
      now: 103
    })

    expect(first).toMatchObject({ coinBonus: 66, duplicate: false })
    expect(repeated).toMatchObject({ coinBonus: 0, duplicate: true })
    expect(staleRepeat).toMatchObject({ coinBonus: 0, duplicate: true })
    expect(await db.profiles.get('player')).toMatchObject({
      coins: 76,
      lifetimeCoins: 76,
      surpriseChallengeWins: 1,
      surpriseChallengeLosses: 1,
      surpriseChallengeBestScore: 88,
      lastSurpriseChallengeId: 'ambush-later-defeat'
    })

    db.close()
    await db.delete()
  })
})
