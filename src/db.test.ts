import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { MathRecallDatabase, normalizeProblemRecord, normalizeProfileRecord } from './db'
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
})
