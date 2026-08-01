import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import {
  db,
  defaultProfile,
  clearActivePracticeSession,
  equipShopItem,
  equipTechnique,
  getActivePracticeSession,
  getLatestPracticeCheckpoint,
  initializeDatabase,
  MathRecallDatabase,
  normalizeProblemRecord,
  normalizeProfileRecord,
  PRACTICE_SESSION_CHECKPOINTS_KEY,
  purchaseShopItem,
  recordDuelResult,
  recordSurpriseChallengeResult,
  saveActivePracticeSession
} from './db'
import { LEGACY_PRIVATE_BANK_SOURCE } from './data/questionQuality'
import { makeSeedProblems } from './data/seed'
import { ACTIVE_PRACTICE_SESSION_KEY, createPracticeSession } from './domain/practiceSession'
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
    expect(migrated.duelWins).toBe(0)
    expect(migrated.duelLosses).toBe(0)
    expect(migrated.duelRecords).toEqual({})
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

  it('从 v7 升级到 v8 时补齐质量元数据并隔离同构题', async () => {
    const name = `quality-migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(7).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    })
    await legacyDb.open()
    const base = {
      kind: 'problem', title: '参数极限', source: '个人整理', page: '12', tags: ['第1讲', '极限'],
      coreMethod: '先提取最高阶，再比较分子分母的主导项。', mistakes: '不要只比较表面次数。',
      answerText: '同除最高次幂后取极限。', questionFormat: 'open', options: [], correctOptionIds: [],
      solutionMethods: [
        { id: 'm1', title: '主导项', content: '同除最高次幂，逐项取极限得到结论。' },
        { id: 'm2', title: '换元复核', content: '令自变量倒数为新变量，在零点复核。' }
      ],
      updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0
    }
    await legacyDb.table('problems').bulkPut([
      { ...base, id: 'clone-a', statement: '计算 $\\lim_{x\\to\\infty}(2x+1)/(x+3)$。', createdAt: 1 },
      { ...base, id: 'clone-b', statement: '计算 $\\lim_{t\\to\\infty}(5t+7)/(t+9)$。', createdAt: 2 }
    ])
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    const migrated = (await upgraded.problems.toArray()).sort((a, b) => a.createdAt - b.createdAt)
    expect(migrated[0]).toMatchObject({ qualityStatus: 'verified', difficulty: expect.any(Number), estimatedMinutes: expect.any(Number), discrimination: expect.any(Number) })
    expect(migrated[0].semanticClusterId).toMatch(/^semantic:/)
    expect(migrated[0].prerequisites).toEqual(expect.arrayContaining(['极限']))
    expect(migrated[1].qualityStatus).toBe('needs-review')
    expect(migrated[1].qualityIssues).toContainEqual(expect.objectContaining({ code: 'semantic-duplicate' }))
    upgraded.close()
  })

  it('升级到 v9 时归档内置定义卡但保留个人数据与历史记录', async () => {
    const name = `definition-card-migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(8).stores({
      problems: 'id, kind, questionFormat, qualityStatus, difficulty, nextReviewAt, updatedAt, source, *tags, *prerequisites',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    })
    await legacyDb.open()
    const concept = {
      kind: 'concept', title: '旧定义卡', statement: '定义内容', source: '旧题库', page: '', tags: ['定义'],
      coreMethod: '旧方法', mistakes: '', answerText: '旧答案', questionFormat: 'open', options: [], correctOptionIds: [],
      solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0
    }
    await legacyDb.table('problems').bulkPut([
      { ...concept, id: 'seed-concept', isSeed: true },
      { ...concept, id: 'personal-concept', isSeed: false }
    ])
    await legacyDb.table('reviews').add({ problemId: 'seed-concept', rating: 'independent', reviewedAt: 1, nextReviewAt: 2, intervalIndex: 1, xpEarned: 10 })
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    expect((await upgraded.problems.get('seed-concept'))?.archived).toBe(true)
    expect((await upgraded.problems.get('personal-concept'))?.archived).not.toBe(true)
    expect(await upgraded.reviews.where('problemId').equals('seed-concept').count()).toBe(1)
    upgraded.close()
  })

  it('升级到 v10 时归档全部内置定义、辨析和非 PDF 模板，保留正式应用题与作答历史', async () => {
    const name = `pdf-only-migration-${crypto.randomUUID()}`
    databases.push(name)
    const legacyDb = new Dexie(name)
    legacyDb.version(9).stores({
      problems: 'id, kind, questionFormat, qualityStatus, difficulty, nextReviewAt, updatedAt, source, *tags, *prerequisites',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    })
    await legacyDb.open()
    const base = {
      kind: 'problem', statement: '完整题面', source: '旧内置题', page: 'PDF 1', tags: ['高等数学'],
      coreMethod: '完整方法', mistakes: '常见错误', answerText: '完整答案', questionFormat: 'open', options: [],
      correctOptionIds: [], solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0,
      isSeed: true
    }
    await legacyDb.table('problems').bulkPut([
      { ...base, id: 'zy27-c01-limit-choice', title: '命题辨析' },
      { ...base, id: 'zy27-c01-limit-audit', title: '错解审判' },
      { ...base, id: 'dpm20-extra-application', title: '旧原创模板' },
      { ...base, id: 'seed-01', title: '旧样例' },
      { ...base, id: 'zy27-c01-limit-application', title: 'PDF 经典应用' },
      { ...base, id: 'personal-concept', kind: 'concept', title: '个人卡片', isSeed: false }
    ])
    await legacyDb.table('reviews').add({ problemId: 'zy27-c01-limit-choice', rating: 'independent', reviewedAt: 1, nextReviewAt: 2, intervalIndex: 1, xpEarned: 10 })
    legacyDb.close()

    const upgraded = new MathRecallDatabase(name)
    await upgraded.open()
    for (const id of ['zy27-c01-limit-choice', 'zy27-c01-limit-audit', 'dpm20-extra-application', 'seed-01']) {
      expect((await upgraded.problems.get(id))?.archived).toBe(true)
    }
    expect((await upgraded.problems.get('zy27-c01-limit-application'))?.archived).not.toBe(true)
    expect((await upgraded.problems.get('personal-concept'))?.archived).not.toBe(true)
    expect(await upgraded.reviews.where('problemId').equals('zy27-c01-limit-choice').count()).toBe(1)
    upgraded.close()
  })

  it('增量刷新内置题时保留旧手机的作答进度和图片，并补入新增题', async () => {
    db.close()
    await db.delete()
    await db.open()

    const [latestSeed] = makeSeedProblems(1_000)
    await db.problems.put({
      ...latestSeed,
      title: '旧版本题面',
      createdAt: 10,
      nextReviewAt: 20,
      intervalIndex: 3,
      reviewCount: 7,
      questionImageId: 'question-image',
      answerImageId: 'answer-image',
      seedVersion: 12
    })

    await initializeDatabase()

    const refreshed = await db.problems.get(latestSeed.id)
    expect(refreshed).toMatchObject({
      title: latestSeed.title,
      createdAt: 10,
      nextReviewAt: 20,
      intervalIndex: 3,
      reviewCount: 7,
      questionImageId: 'question-image',
      answerImageId: 'answer-image',
      seedVersion: 27
    })
    expect(await db.problems.filter((problem) => problem.isSeed === true && !problem.archived).count()).toBe(641)

    db.close()
    await db.delete()
  })

  it('会话写入保留 12 个滚动恢复点、拒绝旧状态回写并可彻底清理', async () => {
    db.close()
    await db.delete()
    await db.open()
    const base = createPracticeSession({
      mode: 'practice',
      selection: { lectureId: 'lecture-01', role: 'all', label: '第 1 讲', adaptiveMode: 'weak' },
      queueIds: ['q1', 'q2'],
      now: 1
    })
    for (let updatedAt = 1; updatedAt <= 14; updatedAt += 1) {
      await saveActivePracticeSession({ ...base, updatedAt, answer: { ...base.answer, thinking: updatedAt >= 2 } })
    }
    await saveActivePracticeSession({ ...base, updatedAt: 5, answer: { ...base.answer, thinking: false } })

    const active = await getActivePracticeSession()
    const checkpoints = await db.settings.get(PRACTICE_SESSION_CHECKPOINTS_KEY)
    expect(active).toMatchObject({ id: base.id, updatedAt: 14, answer: { thinking: true } })
    expect((checkpoints?.value as unknown[])).toHaveLength(12)
    expect((await getLatestPracticeCheckpoint())?.createdAt).toBe(14)

    await db.settings.delete(ACTIVE_PRACTICE_SESSION_KEY)
    const recovery = await getLatestPracticeCheckpoint()
    expect(recovery?.session.updatedAt).toBe(14)
    await saveActivePracticeSession(recovery!.session)
    await clearActivePracticeSession(base.id)
    expect(await db.settings.get(ACTIVE_PRACTICE_SESSION_KEY)).toBeUndefined()
    expect(await db.settings.get(PRACTICE_SESSION_CHECKPOINTS_KEY)).toBeUndefined()

    db.close()
    await db.delete()
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

  it('主动挑战幂等结算胜负、灵石、羁绊与对手战绩', async () => {
    await db.delete()
    await db.open()
    await db.profiles.put({ ...defaultProfile, coins: 20, lifetimeCoins: 20 })

    const first = await recordDuelResult({
      challengeId: 'duel-idempotent', opponentId: 'zeng-yuxin', score: 92, passed: true, timedOut: false, now: 200
    })
    const repeated = await recordDuelResult({
      challengeId: 'duel-idempotent', opponentId: 'zeng-yuxin', score: 92, passed: true, timedOut: false, now: 201
    })
    await recordDuelResult({
      challengeId: 'duel-later', opponentId: 'chen-yanjun', score: 48, passed: false, timedOut: true, now: 202
    })
    const staleRepeat = await recordDuelResult({
      challengeId: 'duel-idempotent', opponentId: 'zeng-yuxin', score: 92, passed: true, timedOut: false, now: 203
    })

    expect(first).toMatchObject({ coinBonus: 72, bondBonus: 2, duplicate: false })
    expect(repeated).toMatchObject({ coinBonus: 0, duplicate: true })
    expect(staleRepeat).toMatchObject({ coinBonus: 0, duplicate: true })
    expect(await db.profiles.get('player')).toMatchObject({
      coins: 92,
      lifetimeCoins: 92,
      duelWins: 1,
      duelLosses: 1,
      characterBonds: { 'zeng-yuxin': 2, 'chen-yanjun': 1 },
      duelRecords: {
        'zeng-yuxin': { wins: 1, losses: 0, bestScore: 92, lastPlayedAt: 200 },
        'chen-yanjun': { wins: 0, losses: 1, bestScore: 48, lastPlayedAt: 202 }
      },
      lastDuelId: 'duel-later'
    })

    db.close()
    await db.delete()
  })

  it('购买与五槽装备在关闭数据库后仍完整保留且互不覆盖', async () => {
    await db.delete()
    await db.open()
    await db.profiles.put({
      ...defaultProfile,
      coins: 3_000,
      lifetimeCoins: 3_000,
      correctChoiceReviews: 5
    })

    const loadout = [
      ['outfit-flame', 80],
      ['aura-iron', 100],
      ['weapon-ruler', 90],
      ['accessory-jade', 75],
      ['companion-ember', 120]
    ] as const
    for (const [itemId] of loadout) {
      await purchaseShopItem(itemId)
      await equipShopItem(itemId)
    }
    await equipTechnique('question-eye')

    const beforeRestart = await db.profiles.get('player')
    expect(beforeRestart).toMatchObject({
      coins: 3_000 - loadout.reduce((sum, [, price]) => sum + price, 0),
      equippedOutfitId: 'outfit-flame',
      equippedAuraId: 'aura-iron',
      equippedWeaponId: 'weapon-ruler',
      equippedAccessoryId: 'accessory-jade',
      activeCompanionId: 'companion-ember',
      activeTechniqueId: 'question-eye'
    })
    expect(beforeRestart?.ownedItemIds).toEqual(expect.arrayContaining(loadout.map(([itemId]) => itemId)))

    db.close()
    await db.open()
    expect(await db.profiles.get('player')).toEqual(beforeRestart)

    db.close()
    await db.delete()
  })

  it('拒绝装备未购买物品和未解锁功法且不污染已保存装束', async () => {
    await db.delete()
    await db.open()
    await db.profiles.put({ ...defaultProfile })

    await expect(equipShopItem('outfit-flame')).rejects.toThrow('请先拥有这件物品')
    await expect(equipTechnique('question-eye')).rejects.toThrow('尚未解锁')
    expect(await db.profiles.get('player')).toMatchObject({
      ownedItemIds: defaultProfile.ownedItemIds,
      equippedOutfitId: 'outfit-apprentice',
      equippedAuraId: 'aura-none',
      equippedWeaponId: 'weapon-scroll',
      equippedAccessoryId: 'accessory-none',
      activeCompanionId: 'companion-none',
      activeTechniqueId: 'definition-heart'
    })

    db.close()
    await db.delete()
  })
})
