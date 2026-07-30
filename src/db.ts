import Dexie, { type EntityTable } from 'dexie'
import { DEPRECATED_SEED_IDS, makeSeedProblems } from './data/seed'
import {
  auditProblemBank,
  enrichProblemQuality,
  isLegacyPrivateBankProblem,
  isProblemEligibleForPractice,
  LEGACY_PRIVATE_BANK_SOURCE
} from './data/questionQuality'
import {
  applyStudyToProfile,
  calculateCoinReward,
  createRewardCard,
  getEncouragement,
  getRealmAdvance,
  getTodayKey,
  SHOP_ITEMS
} from './domain/gamification'
import { getReviewOutcome } from './domain/scheduler'
import { CULTIVATION_TECHNIQUES, resolveTechnique } from './domain/cultivation'
import { STORY_ENCOUNTERS } from './domain/encounters'
import { getCharacter, isStoryThresholdUnlocked } from './domain/story'
import { getLectureBoss } from './domain/boss'
import { getNewUnlockEvents } from './domain/unlocks'
import { applyProblemMasteryToProfile, rebuildProfileMastery } from './domain/mastery'
import {
  DUEL_SETTLEMENT_KEY,
  getDuelPresentation,
  normalizeDuelSettlementState,
  type DuelSettlementState
} from './domain/duel'
import {
  advanceRivalCompetition,
  RIVAL_COMPETITION_STATE_KEY,
  type RivalCompetitionState
} from './domain/rivalCompetition'
import {
  getPracticeCycleSettingKey,
  markPracticeProblemSeen as markCycleProblemSeen,
  preparePracticeCycle,
  type PracticeCycleState
} from './domain/practiceCycle'
import { ACTIVE_PRACTICE_SESSION_KEY } from './domain/practiceSession'
import {
  buildSurpriseChallengeQueue,
  normalizeSurpriseChallengeState,
  prepareSurpriseChallengeOffer,
  SURPRISE_CHALLENGE_COOLDOWN_MS,
  SURPRISE_CHALLENGE_DECLINE_MS,
  SURPRISE_CHALLENGE_STATE_KEY,
  SURPRISE_CHALLENGE_WIN_COINS,
  type SurpriseChallengeOffer,
  type SurpriseChallengeState
} from './domain/surpriseChallenge'
import type {
  ActivePracticeSession,
  AppSetting,
  ImageAsset,
  PlayerProfile,
  PracticeSessionCheckpoint,
  Problem,
  RecoverySnapshot,
  ReviewLog,
  ReviewRating,
  RewardCard,
  StoragePersistenceState
} from './types'

const DISMISSED_SEEDS_KEY = 'dismissed-seed-ids'
const STORAGE_PERSISTENCE_KEY = 'storage-persistence'
const LAST_EXTERNAL_BACKUP_KEY = 'last-external-backup-at'
export const PRACTICE_SESSION_CHECKPOINTS_KEY = 'practice-session-checkpoints'
const LEGACY_SEED_IDS = Array.from({ length: 15 }, (_, index) => `seed-${String(index + 1).padStart(2, '0')}`)
const LEGACY_CHARACTER_IDS: Record<string, string> = {
  'he-jiancheng': 'he-xinping',
  'chen-xiulan': 'zhong-shanyan',
  'pei-shenxing': 'zeng-yuxin',
  'shen-li': 'yuan-yue',
  'han-che': 'chen-ruibin',
  'lin-jianyue': 'chen-yanjun',
  'su-wanqiao': 'medusa',
  'tang-zhixia': 'xiaoyixian'
}

function migrateCharacterBonds(bonds?: Record<string, number>) {
  const migrated: Record<string, number> = {}
  for (const [characterId, points] of Object.entries(bonds || {})) {
    const nextId = LEGACY_CHARACTER_IDS[characterId] || characterId
    migrated[nextId] = (migrated[nextId] || 0) + points
  }
  return migrated
}

export const defaultProfile: PlayerProfile = {
  id: 'player',
  name: '何耀焜',
  xp: 0,
  coins: 0,
  lifetimeCoins: 0,
  streak: 0,
  lastStudyDate: '',
  totalReviews: 0,
  selectedTitle: '斗气化题',
  independentReviews: 0,
  multipleSolutionReviews: 0,
  correctChoiceReviews: 0,
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

export function normalizeProblemRecord(problem: Problem): Problem {
  const fallbackMethod = problem.answerText || problem.coreMethod
  const normalized: Problem = {
    ...problem,
    archived: isLegacyPrivateBankProblem(problem) ? true : problem.archived,
    questionFormat: problem.questionFormat || 'open',
    options: Array.isArray(problem.options) ? problem.options : [],
    correctOptionIds: Array.isArray(problem.correctOptionIds) ? problem.correctOptionIds : [],
    solutionMethods: Array.isArray(problem.solutionMethods) && problem.solutionMethods.length
      ? problem.solutionMethods
      : fallbackMethod
        ? [{ id: 'method-1', title: '主方法', content: fallbackMethod }]
        : []
  }
  return enrichProblemQuality(normalized, problem.qualityAuditedAt || Date.now())
}

export function normalizeProfileRecord(profile?: PlayerProfile): PlayerProfile {
  return {
    ...defaultProfile,
    ...profile,
    name: profile?.name || defaultProfile.name,
    coins: profile?.coins ?? 0,
    lifetimeCoins: profile?.lifetimeCoins ?? 0,
    selectedTitle: profile?.selectedTitle && profile.selectedTitle !== '初见学者' ? profile.selectedTitle : defaultProfile.selectedTitle,
    independentReviews: profile?.independentReviews || 0,
    multipleSolutionReviews: profile?.multipleSolutionReviews || 0,
    correctChoiceReviews: profile?.correctChoiceReviews || 0,
    breakthroughCount: profile?.breakthroughCount || 0,
    ownedItemIds: Array.isArray(profile?.ownedItemIds)
      ? [...new Set([...defaultProfile.ownedItemIds, ...profile.ownedItemIds])]
      : defaultProfile.ownedItemIds,
    equippedOutfitId: profile?.equippedOutfitId || defaultProfile.equippedOutfitId,
    equippedAuraId: profile?.equippedAuraId || defaultProfile.equippedAuraId,
    equippedWeaponId: profile?.equippedWeaponId || defaultProfile.equippedWeaponId,
    equippedAccessoryId: profile?.equippedAccessoryId || defaultProfile.equippedAccessoryId,
    activeCompanionId: profile?.activeCompanionId || defaultProfile.activeCompanionId,
    activeTechniqueId: profile?.activeTechniqueId || defaultProfile.activeTechniqueId,
    techniqueMastery: profile?.techniqueMastery && typeof profile.techniqueMastery === 'object' ? profile.techniqueMastery : {},
    storyChoices: profile?.storyChoices && typeof profile.storyChoices === 'object' ? profile.storyChoices : {},
    characterBonds: profile?.characterBonds && typeof profile.characterBonds === 'object'
      ? migrateCharacterBonds(profile.characterBonds)
      : {},
    masteredProblemIds: Array.isArray(profile?.masteredProblemIds) ? [...new Set(profile.masteredProblemIds)] : [],
    correctedProblemIds: Array.isArray(profile?.correctedProblemIds) ? [...new Set(profile.correctedProblemIds)] : [],
    bossVictories: profile?.bossVictories && typeof profile.bossVictories === 'object' ? profile.bossVictories : {},
    bossAttempts: profile?.bossAttempts || 0,
    surpriseChallengeWins: profile?.surpriseChallengeWins || 0,
    surpriseChallengeLosses: profile?.surpriseChallengeLosses || 0,
    surpriseChallengeBestScore: profile?.surpriseChallengeBestScore || 0,
    lastSurpriseChallengeId: profile?.lastSurpriseChallengeId,
    lastSurpriseChallengeAt: profile?.lastSurpriseChallengeAt,
    duelWins: profile?.duelWins || 0,
    duelLosses: profile?.duelLosses || 0,
    duelRecords: profile?.duelRecords && typeof profile.duelRecords === 'object' ? profile.duelRecords : {},
    lastDuelId: profile?.lastDuelId
  }
}

export class MathRecallDatabase extends Dexie {
  problems!: EntityTable<Problem, 'id'>
  images!: EntityTable<ImageAsset, 'id'>
  reviews!: EntityTable<ReviewLog, 'id'>
  rewards!: EntityTable<RewardCard, 'id'>
  profiles!: EntityTable<PlayerProfile, 'id'>
  settings!: EntityTable<AppSetting, 'key'>
  snapshots!: EntityTable<RecoverySnapshot, 'id'>

  constructor(name = 'math-recall-pwa') {
    super(name)
    this.version(1).stores({
      problems: 'id, kind, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id'
    })
    this.version(2).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const problems = transaction.table<Problem>('problems')
      const profiles = transaction.table<PlayerProfile>('profiles')
      const settings = transaction.table<AppSetting>('settings')
      const [existingIds, existingProfile] = await Promise.all([
        problems.toCollection().primaryKeys() as Promise<string[]>,
        profiles.get('player')
      ])

      if (existingIds.length > 0 || existingProfile) {
        const existingSet = new Set(existingIds)
        const dismissed = LEGACY_SEED_IDS.filter((id) => !existingSet.has(id))
        if (dismissed.length) {
          await settings.put({ key: DISMISSED_SEEDS_KEY, value: dismissed, updatedAt: Date.now() })
        }
      }

      await problems.toCollection().modify((problem) => {
        Object.assign(problem, normalizeProblemRecord(problem))
      })
      if (existingProfile) await profiles.put(normalizeProfileRecord(existingProfile))
    })
    this.version(3).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      await transaction.table<Problem>('problems').toCollection().modify((problem) => {
        if (problem.source.startsWith('拾阶数学')) {
          problem.source = problem.source.replace('拾阶数学', '斗破数学')
        }
      })
    })
    this.version(4).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const profiles = transaction.table<PlayerProfile>('profiles')
      const profile = await profiles.get('player')
      if (profile) await profiles.put(normalizeProfileRecord(profile))
    })
    this.version(5).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const profiles = transaction.table<PlayerProfile>('profiles')
      const profile = await profiles.get('player')
      if (profile) await profiles.put(normalizeProfileRecord(profile))
    })
    this.version(6).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const profiles = transaction.table<PlayerProfile>('profiles')
      const settings = transaction.table<AppSetting>('settings')
      const [profile, routeSetting] = await Promise.all([
        profiles.get('player'),
        settings.get('active-romance-route')
      ])
      if (profile) await profiles.put(normalizeProfileRecord(profile))
      if (typeof routeSetting?.value === 'string' && LEGACY_CHARACTER_IDS[routeSetting.value]) {
        await settings.put({
          ...routeSetting,
          value: LEGACY_CHARACTER_IDS[routeSetting.value],
          updatedAt: Date.now()
        })
      }
    })
    this.version(7).stores({
      problems: 'id, kind, questionFormat, nextReviewAt, updatedAt, source, *tags',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const problems = transaction.table<Problem>('problems')
      for (const id of DEPRECATED_SEED_IDS) {
        const duplicate = await problems.get(id)
        if (duplicate?.isSeed) await problems.update(id, { archived: true, seedVersion: 4 })
      }
      await problems
        .where('source')
        .equals(LEGACY_PRIVATE_BANK_SOURCE)
        .filter(isLegacyPrivateBankProblem)
        .modify({ archived: true })
    })
    this.version(8).stores({
      problems: 'id, kind, questionFormat, qualityStatus, difficulty, nextReviewAt, updatedAt, source, *tags, *prerequisites',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      const problems = transaction.table<Problem>('problems')
      const audited = auditProblemBank((await problems.toArray()).map(normalizeProblemRecord))
      if (audited.length) await problems.bulkPut(audited)
    })
    this.version(9).stores({
      problems: 'id, kind, questionFormat, qualityStatus, difficulty, nextReviewAt, updatedAt, source, *tags, *prerequisites',
      images: 'id, createdAt',
      reviews: '++id, problemId, reviewedAt, isCorrect, techniqueId',
      rewards: 'id, problemId, earnedAt, rarity',
      profiles: 'id',
      settings: 'key, updatedAt',
      snapshots: 'id, createdAt'
    }).upgrade(async (transaction) => {
      await transaction.table<Problem>('problems')
        .where('kind')
        .equals('concept')
        .filter((problem) => problem.isSeed === true)
        .modify({ archived: true, seedVersion: 8 })
    })
  }
}

export const db = new MathRecallDatabase()

export async function initializeDatabase() {
  await db.transaction('rw', db.problems, db.reviews, db.profiles, db.settings, async () => {
    const dismissed = new Set(await getSettingValue<string[]>(DISMISSED_SEEDS_KEY, []))
    const seeds = makeSeedProblems()
    const existingSeeds = await db.problems.bulkGet(seeds.map((problem) => problem.id))
    const existingById = new Map(existingSeeds.filter(Boolean).map((problem) => [problem!.id, problem!]))
    const missingSeeds = seeds.filter((problem) => !existingById.has(problem.id) && !dismissed.has(problem.id))
    if (missingSeeds.length) await db.problems.bulkAdd(missingSeeds)

    const refreshedSeeds = seeds.flatMap((seed) => {
      const existing = existingById.get(seed.id)
      if (!existing?.isSeed || (existing.seedVersion || 0) >= (seed.seedVersion || 0)) return []
      return [{
        ...seed,
        createdAt: existing.createdAt,
        nextReviewAt: existing.nextReviewAt,
        intervalIndex: existing.intervalIndex,
        reviewCount: existing.reviewCount,
        archived: existing.archived,
        questionImageId: existing.questionImageId,
        answerImageId: existing.answerImageId
      }]
    })
    if (refreshedSeeds.length) await db.problems.bulkPut(refreshedSeeds)

    for (const id of DEPRECATED_SEED_IDS) {
      const duplicate = await db.problems.get(id)
      if (duplicate?.isSeed && !duplicate.archived) await db.problems.update(id, { archived: true, seedVersion: 4 })
    }

    await db.problems
      .where('kind')
      .equals('concept')
      .filter((problem) => problem.isSeed === true && !problem.archived)
      .modify({ archived: true, seedVersion: 8 })

    await db.problems
      .where('source')
      .equals(LEGACY_PRIVATE_BANK_SOURCE)
      .filter(isLegacyPrivateBankProblem)
      .modify({ archived: true })

    const currentProfile = await db.profiles.get('player')
    if (!currentProfile) await db.profiles.add(defaultProfile)
    else {
      const [problems, reviews] = await Promise.all([db.problems.toArray(), db.reviews.toArray()])
      await db.profiles.put(rebuildProfileMastery(normalizeProfileRecord(currentProfile), problems, reviews))
    }
  })
}

export async function getSettingValue<T>(key: string, fallback: T): Promise<T> {
  const record = await db.settings.get(key)
  return (record?.value as T | undefined) ?? fallback
}

export async function setSettingValue<T>(key: string, value: T) {
  await db.settings.put({ key, value, updatedAt: Date.now() })
}

export async function getActivePracticeSession() {
  await sessionWriteChain.catch(() => undefined)
  return getSettingValue<ActivePracticeSession | undefined>(ACTIVE_PRACTICE_SESSION_KEY, undefined)
}

let sessionWriteChain: Promise<unknown> = Promise.resolve()

export function saveActivePracticeSession(session: ActivePracticeSession) {
  const write = sessionWriteChain.catch(() => undefined).then(async () => {
    await db.transaction('rw', db.settings, async () => {
      const activeRecord = await db.settings.get(ACTIVE_PRACTICE_SESSION_KEY)
      const activeSession = activeRecord?.value as ActivePracticeSession | undefined
      if (activeSession?.updatedAt && activeSession.updatedAt > session.updatedAt) return
      const checkpointRecord = await db.settings.get(PRACTICE_SESSION_CHECKPOINTS_KEY)
      const checkpoints = Array.isArray(checkpointRecord?.value)
        ? checkpointRecord.value as PracticeSessionCheckpoint[]
        : []
      const checkpoint: PracticeSessionCheckpoint = {
        id: `${session.id}:${session.updatedAt}`,
        sessionId: session.id,
        createdAt: session.updatedAt,
        session
      }
      const nextCheckpoints = [...checkpoints.filter((item) => item.id !== checkpoint.id), checkpoint]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 12)
      await Promise.all([
        db.settings.put({ key: ACTIVE_PRACTICE_SESSION_KEY, value: session, updatedAt: session.updatedAt }),
        db.settings.put({ key: PRACTICE_SESSION_CHECKPOINTS_KEY, value: nextCheckpoints, updatedAt: session.updatedAt })
      ])
    })
    return session
  })
  sessionWriteChain = write
  return write
}

export async function clearActivePracticeSession(sessionId?: string) {
  const write = sessionWriteChain.catch(() => undefined).then(async () => {
    if (sessionId) {
      const active = await getSettingValue<ActivePracticeSession | undefined>(ACTIVE_PRACTICE_SESSION_KEY, undefined)
      if (active?.id !== sessionId) return
    }
    const checkpointRecord = await db.settings.get(PRACTICE_SESSION_CHECKPOINTS_KEY)
    const checkpoints = Array.isArray(checkpointRecord?.value)
      ? checkpointRecord.value as PracticeSessionCheckpoint[]
      : []
    const retained = sessionId ? checkpoints.filter((item) => item.sessionId !== sessionId) : []
    await db.transaction('rw', db.settings, async () => {
      await db.settings.delete(ACTIVE_PRACTICE_SESSION_KEY)
      if (retained.length) await db.settings.put({ key: PRACTICE_SESSION_CHECKPOINTS_KEY, value: retained, updatedAt: Date.now() })
      else await db.settings.delete(PRACTICE_SESSION_CHECKPOINTS_KEY)
    })
  })
  sessionWriteChain = write
  await write
}

export async function getLatestPracticeCheckpoint() {
  await sessionWriteChain.catch(() => undefined)
  const checkpoints = await getSettingValue<PracticeSessionCheckpoint[]>(PRACTICE_SESSION_CHECKPOINTS_KEY, [])
  return [...checkpoints].sort((a, b) => b.createdAt - a.createdAt)[0]
}

export async function refreshRivalCompetitionState(now = Date.now()) {
  return db.transaction('rw', db.profiles, db.settings, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const record = await db.settings.get(RIVAL_COMPETITION_STATE_KEY)
    const current = record?.value as Partial<RivalCompetitionState> | undefined
    const next = advanceRivalCompetition(profile, current, now)
    if (!current || JSON.stringify(current) !== JSON.stringify(next)) {
      await db.settings.put({ key: RIVAL_COMPETITION_STATE_KEY, value: next, updatedAt: now })
    }
    return next
  })
}

export async function getSurpriseChallengeState() {
  return normalizeSurpriseChallengeState(await getSettingValue<SurpriseChallengeState | undefined>(SURPRISE_CHALLENGE_STATE_KEY, undefined))
}

export async function getOrCreateSurpriseChallengeOffer(now = Date.now(), seed = now) {
  return db.transaction('rw', db.profiles, db.problems, db.settings, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const state = normalizeSurpriseChallengeState((await db.settings.get(SURPRISE_CHALLENGE_STATE_KEY))?.value as SurpriseChallengeState | undefined)
    const problems = await db.problems.filter(isProblemEligibleForPractice).toArray()
    const prepared = prepareSurpriseChallengeOffer({
      profile,
      state,
      availableProblemCount: buildSurpriseChallengeQueue(problems, seed).length,
      now,
      seed
    })
    if (prepared.changed) await db.settings.put({ key: SURPRISE_CHALLENGE_STATE_KEY, value: prepared.state, updatedAt: now })
    return prepared.offer
  })
}

async function resolveSurpriseChallengeOffer(offerId: string, accepted: boolean, now = Date.now()) {
  return db.transaction('rw', db.settings, async () => {
    const record = await db.settings.get(SURPRISE_CHALLENGE_STATE_KEY)
    const state = normalizeSurpriseChallengeState(record?.value as SurpriseChallengeState | undefined)
    if (state.pendingOffer?.id !== offerId) return state
    const next: SurpriseChallengeState = {
      ...state,
      pendingOffer: undefined,
      nextEligibleAt: now + (accepted ? SURPRISE_CHALLENGE_COOLDOWN_MS : SURPRISE_CHALLENGE_DECLINE_MS)
    }
    await db.settings.put({ key: SURPRISE_CHALLENGE_STATE_KEY, value: next, updatedAt: now })
    return next
  })
}

export function acceptSurpriseChallengeOffer(offerId: string, now = Date.now()) {
  return resolveSurpriseChallengeOffer(offerId, true, now)
}

export function declineSurpriseChallengeOffer(offerId: string, now = Date.now()) {
  return resolveSurpriseChallengeOffer(offerId, false, now)
}

export async function recordSurpriseChallengeResult(input: {
  challengeId: string
  rivalId: SurpriseChallengeOffer['rivalId']
  score: number
  passed: boolean
  timedOut: boolean
  now?: number
}) {
  const now = input.now ?? Date.now()
  const result = await db.transaction('rw', db.profiles, db.settings, async () => {
    const current = normalizeProfileRecord(await db.profiles.get('player'))
    const state = normalizeSurpriseChallengeState((await db.settings.get(SURPRISE_CHALLENGE_STATE_KEY))?.value as SurpriseChallengeState | undefined)
    const alreadySettled = current.lastSurpriseChallengeId === input.challengeId || state.settledChallengeIds.includes(input.challengeId)
    if (alreadySettled) {
      if (!state.settledChallengeIds.includes(input.challengeId)) {
        await db.settings.put({
          key: SURPRISE_CHALLENGE_STATE_KEY,
          value: { ...state, settledChallengeIds: [...state.settledChallengeIds, input.challengeId].slice(-50) },
          updatedAt: now
        })
      }
      return { profile: current, coinBonus: 0, duplicate: true }
    }
    const coinBonus = input.passed ? SURPRISE_CHALLENGE_WIN_COINS : 0
    const next: PlayerProfile = {
      ...current,
      coins: current.coins + coinBonus,
      lifetimeCoins: current.lifetimeCoins + coinBonus,
      surpriseChallengeWins: current.surpriseChallengeWins + Number(input.passed),
      surpriseChallengeLosses: current.surpriseChallengeLosses + Number(!input.passed),
      surpriseChallengeBestScore: Math.max(current.surpriseChallengeBestScore, input.score),
      lastSurpriseChallengeId: input.challengeId,
      lastSurpriseChallengeAt: now
    }
    const nextState: SurpriseChallengeState = {
      ...state,
      pendingOffer: undefined,
      lastResultAt: now,
      nextEligibleAt: Math.max(state.nextEligibleAt, now + SURPRISE_CHALLENGE_COOLDOWN_MS),
      settledChallengeIds: [...state.settledChallengeIds, input.challengeId].slice(-50)
    }
    await Promise.all([
      db.profiles.put(next),
      db.settings.put({ key: SURPRISE_CHALLENGE_STATE_KEY, value: nextState, updatedAt: now })
    ])
    return { profile: next, coinBonus, duplicate: false }
  })
  if (!result.duplicate) {
    await createRecoverySnapshot(input.timedOut ? '突发邀战超时' : input.passed ? '突发邀战胜利' : '突发邀战失利')
  }
  return result
}

export async function recordDuelResult(input: {
  challengeId: string
  opponentId: string
  score: number
  passed: boolean
  timedOut: boolean
  now?: number
}) {
  const now = input.now ?? Date.now()
  const result = await db.transaction('rw', db.profiles, db.settings, async () => {
    const current = normalizeProfileRecord(await db.profiles.get('player'))
    const state = normalizeDuelSettlementState(
      (await db.settings.get(DUEL_SETTLEMENT_KEY))?.value as Partial<DuelSettlementState> | undefined
    )
    const alreadySettled = current.lastDuelId === input.challengeId || state.settledChallengeIds.includes(input.challengeId)
    if (alreadySettled) return { profile: current, coinBonus: 0, bondBonus: 0, duplicate: true }

    const presentation = getDuelPresentation(input.opponentId)
    const character = getCharacter(input.opponentId)
    const coinBonus = input.passed ? presentation.winCoins : 0
    const bondBonus = input.passed ? (character.role === 'rival' ? 2 : 3) : 1
    const previousRecord = current.duelRecords[input.opponentId] || { wins: 0, losses: 0, bestScore: 0, lastPlayedAt: 0 }
    const next: PlayerProfile = {
      ...current,
      coins: current.coins + coinBonus,
      lifetimeCoins: current.lifetimeCoins + coinBonus,
      duelWins: current.duelWins + Number(input.passed),
      duelLosses: current.duelLosses + Number(!input.passed),
      duelRecords: {
        ...current.duelRecords,
        [input.opponentId]: {
          wins: previousRecord.wins + Number(input.passed),
          losses: previousRecord.losses + Number(!input.passed),
          bestScore: Math.max(previousRecord.bestScore, input.score),
          lastPlayedAt: now
        }
      },
      characterBonds: {
        ...current.characterBonds,
        [input.opponentId]: (current.characterBonds[input.opponentId] || 0) + bondBonus
      },
      lastDuelId: input.challengeId
    }
    const nextState: DuelSettlementState = {
      settledChallengeIds: [...state.settledChallengeIds, input.challengeId].slice(-100)
    }
    await Promise.all([
      db.profiles.put(next),
      db.settings.put({ key: DUEL_SETTLEMENT_KEY, value: nextState, updatedAt: now })
    ])
    return { profile: next, coinBonus, bondBonus, duplicate: false }
  })
  if (!result.duplicate) {
    await createRecoverySnapshot(input.timedOut ? '五题挑战超时' : input.passed ? '五题挑战胜利' : '五题挑战失利')
  }
  return result
}

export async function getOrStartPracticeCycle(lectureId: string, problemIds: readonly string[], seed = Date.now()) {
  return db.transaction('rw', db.settings, async () => {
    const key = getPracticeCycleSettingKey(lectureId)
    const record = await db.settings.get(key)
    const prepared = preparePracticeCycle(lectureId, problemIds, record?.value as PracticeCycleState | undefined, seed)
    if (prepared.changed) await db.settings.put({ key, value: prepared.state, updatedAt: Date.now() })
    return prepared
  })
}

export async function recordPracticeCycleCompletion(lectureId: string, problemId: string, problemIds: readonly string[]) {
  return db.transaction('rw', db.settings, async () => {
    const key = getPracticeCycleSettingKey(lectureId)
    const record = await db.settings.get(key)
    const prepared = preparePracticeCycle(lectureId, problemIds, record?.value as PracticeCycleState | undefined)
    const next = markCycleProblemSeen(prepared.state, problemId)
    if (prepared.changed || next !== prepared.state) await db.settings.put({ key, value: next, updatedAt: Date.now() })
    return next
  })
}

export async function saveImage(file: File) {
  const blob = await optimizeImage(file)
  const asset: ImageAsset = {
    id: crypto.randomUUID(),
    blob,
    name: file.name,
    mimeType: blob.type || file.type || 'image/jpeg',
    createdAt: Date.now()
  }
  await db.images.add(asset)
  return asset.id
}

async function optimizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  try {
    const bitmap = await createImageBitmap(file)
    const maxEdge = 1800
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 1_500_000) {
      bitmap.close()
      return file
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.84)
    })
  } catch {
    return file
  }
}

export async function deleteProblem(id: string) {
  await createRecoverySnapshot('删除题卡前')
  await db.transaction('rw', db.problems, db.images, db.reviews, db.rewards, db.settings, async () => {
    const problem = await db.problems.get(id)
    if (!problem) return
    const imageIds = [problem.questionImageId, problem.answerImageId].filter(Boolean) as string[]
    if (problem.isSeed) {
      const dismissed = new Set(await getSettingValue<string[]>(DISMISSED_SEEDS_KEY, []))
      dismissed.add(problem.id)
      await setSettingValue(DISMISSED_SEEDS_KEY, Array.from(dismissed))
    }
    await Promise.all([
      db.problems.delete(id),
      db.reviews.where('problemId').equals(id).delete(),
      db.rewards.where('problemId').equals(id).delete(),
      db.images.bulkDelete(imageIds)
    ])
  })
}

interface ReviewAnswerMeta {
  selectedOptionIds?: string[]
  isCorrect?: boolean
  durationSeconds?: number
  revealedAt?: number
}

export async function recordReview(problemId: string, rating: ReviewRating, answerMeta: ReviewAnswerMeta = {}) {
  const now = Date.now()
  const result = await db.transaction('rw', db.problems, db.reviews, db.rewards, db.profiles, async () => {
    const problem = await db.problems.get(problemId)
    if (!problem) throw new Error('题目不存在')

    const previousReviews = await db.reviews.where('problemId').equals(problemId).toArray()
    const alreadyRewardedToday = previousReviews.some((review) => (
      (review.coinsEarned || 0) > 0 && getTodayKey(new Date(review.reviewedAt)) === getTodayKey(new Date(now))
    ))
    const baseOutcome = getReviewOutcome(problem.intervalIndex, rating, now)
    const reward = createRewardCard(problemId, rating, now)
    const currentProfile = normalizeProfileRecord(await db.profiles.get('player'))
    const resolvedTechnique = resolveTechnique(currentProfile, problem, rating, answerMeta.isCorrect)
    const technique = alreadyRewardedToday ? {
      ...resolvedTechnique,
      triggered: false,
      xpBonus: 0,
      coinBonus: 0,
      masteryGained: 0,
      nextMastery: resolvedTechnique.previousMastery,
      nextLevel: resolvedTechnique.previousLevel
    } : resolvedTechnique
    const outcome = { ...baseOutcome, xp: baseOutcome.xp + technique.xpBonus }
    const coinsEarned = calculateCoinReward(rating, answerMeta.isCorrect, alreadyRewardedToday) + technique.coinBonus
    const encouragement = getEncouragement(currentProfile.name, rating, answerMeta.isCorrect, now)
    const advance = getRealmAdvance(currentProfile.xp, currentProfile.xp + outcome.xp)
    const studiedProfile = applyStudyToProfile(currentProfile, outcome.xp, new Date(now), {
      rating,
      isCorrect: answerMeta.isCorrect,
      realmBreakthrough: advance.realmBreakthrough,
      coinsEarned
    })
    const profileWithTechnique: PlayerProfile = {
      ...studiedProfile,
      techniqueMastery: {
        ...studiedProfile.techniqueMastery,
        [technique.technique.id]: technique.nextMastery
      }
    }
    const reviewRecord: ReviewLog = {
      problemId,
      rating,
      reviewedAt: now,
      nextReviewAt: outcome.nextReviewAt,
      intervalIndex: outcome.intervalIndex,
      xpEarned: outcome.xp,
      coinsEarned,
      selectedOptionIds: answerMeta.selectedOptionIds,
      isCorrect: answerMeta.isCorrect,
      techniqueId: technique.technique.id,
      techniqueXpBonus: technique.xpBonus,
      techniqueCoinBonus: technique.coinBonus,
      techniqueMasteryGained: technique.masteryGained,
      durationSeconds: answerMeta.durationSeconds,
      revealedAt: answerMeta.revealedAt
    }
    const nextProfile = applyProblemMasteryToProfile(profileWithTechnique, problem, [...previousReviews, reviewRecord])
    const problemMastered = !currentProfile.masteredProblemIds.includes(problem.id) && nextProfile.masteredProblemIds.includes(problem.id)
    const problemCorrected = !currentProfile.correctedProblemIds.includes(problem.id) && nextProfile.correctedProblemIds.includes(problem.id)
    const unlockEvents = getNewUnlockEvents(currentProfile, nextProfile)

    await db.problems.update(problemId, {
      nextReviewAt: outcome.nextReviewAt,
      intervalIndex: outcome.intervalIndex,
      reviewCount: problem.reviewCount + 1,
      updatedAt: now
    })
    await db.reviews.add(reviewRecord)
    await db.rewards.add(reward)
    await db.profiles.put(nextProfile)

    return { outcome, reward, profile: nextProfile, advance, coinsEarned, encouragement, technique, unlockEvents, problemMastered, problemCorrected }
  })
  await createRecoverySnapshot('完成做题')
  return result
}

export async function recordBossBattleResult(lectureId: string, score: number, passed: boolean) {
  return db.transaction('rw', db.profiles, async () => {
    const current = normalizeProfileRecord(await db.profiles.get('player'))
    const boss = getLectureBoss(lectureId)
    const previousVictory = current.bossVictories[lectureId]
    const firstVictory = passed && !previousVictory
    const coinBonus = passed ? (firstVictory ? 80 : 24) : 0
    const next: PlayerProfile = {
      ...current,
      coins: current.coins + coinBonus,
      lifetimeCoins: current.lifetimeCoins + coinBonus,
      bossAttempts: current.bossAttempts + 1,
      bossVictories: passed ? {
        ...current.bossVictories,
        [lectureId]: {
          lectureId,
          bossId: boss.id,
          bestScore: Math.max(score, previousVictory?.bestScore || 0),
          victories: (previousVictory?.victories || 0) + 1,
          lastDefeatedAt: Date.now()
        }
      } : current.bossVictories
    }
    const unlockEvents = getNewUnlockEvents(current, next)
    if (firstVictory) {
      unlockEvents.unshift({
        id: `challenge:${boss.id}`,
        kind: 'challenge',
        title: `${boss.name} · 首次击破`,
        description: `第 ${Number(lectureId.slice(-2))} 讲 Boss 战通关`
      })
    }
    await db.profiles.put(next)
    return { profile: next, boss, score, passed, firstVictory, coinBonus, unlockEvents }
  })
}

export async function equipTechnique(techniqueId: string) {
  return db.transaction('rw', db.profiles, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const technique = CULTIVATION_TECHNIQUES.find((candidate) => candidate.id === techniqueId)
    if (!technique) throw new Error('功法不存在')
    if (!technique.unlocked(profile)) throw new Error(`尚未解锁：${technique.unlockLabel}`)
    const next = { ...profile, activeTechniqueId: technique.id }
    await db.profiles.put(next)
    return next
  })
}

export async function chooseStoryEncounter(encounterId: string, choiceId: string) {
  return db.transaction('rw', db.profiles, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const encounter = STORY_ENCOUNTERS.find((candidate) => candidate.id === encounterId)
    const selected = encounter?.choices.find((candidate) => candidate.id === choiceId)
    if (!encounter || !selected) throw new Error('剧情选择不存在')
    if (!isStoryThresholdUnlocked(profile, encounter.threshold)) throw new Error('这段剧情尚未解锁')
    if (profile.storyChoices[encounter.id]) return profile
    const next: PlayerProfile = {
      ...profile,
      coins: profile.coins + selected.coinReward,
      lifetimeCoins: profile.lifetimeCoins + selected.coinReward,
      storyChoices: { ...profile.storyChoices, [encounter.id]: selected.id },
      characterBonds: {
        ...profile.characterBonds,
        [selected.bondTargetId]: (profile.characterBonds[selected.bondTargetId] || 0) + selected.bondGain
      }
    }
    await db.profiles.put(next)
    return next
  })
}

export async function purchaseShopItem(itemId: string) {
  return db.transaction('rw', db.profiles, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const item = SHOP_ITEMS.find((candidate) => candidate.id === itemId)
    if (!item) throw new Error('物品不存在')
    if (profile.ownedItemIds.includes(item.id)) return profile
    if (profile.coins < item.price) throw new Error(`还差 ${item.price - profile.coins} 灵石`)
    const next = {
      ...profile,
      coins: profile.coins - item.price,
      ownedItemIds: [...profile.ownedItemIds, item.id]
    }
    await db.profiles.put(next)
    return next
  })
}

export async function equipShopItem(itemId: string) {
  return db.transaction('rw', db.profiles, async () => {
    const profile = normalizeProfileRecord(await db.profiles.get('player'))
    const item = SHOP_ITEMS.find((candidate) => candidate.id === itemId)
    if (!item || !profile.ownedItemIds.includes(item.id)) throw new Error('请先拥有这件物品')
    const slotByCategory = {
      outfit: 'equippedOutfitId',
      aura: 'equippedAuraId',
      weapon: 'equippedWeaponId',
      accessory: 'equippedAccessoryId',
      companion: 'activeCompanionId'
    } as const
    const next = { ...profile, [slotByCategory[item.category]]: item.id }
    await db.profiles.put(next)
    return next
  })
}

export async function createRecoverySnapshot(reason: string) {
  const [problems, reviews, rewards, profiles] = await Promise.all([
    db.problems.toArray(),
    db.reviews.toArray(),
    db.rewards.toArray(),
    db.profiles.toArray()
  ])
  const snapshot: RecoverySnapshot = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    reason,
    data: { problems, reviews, rewards, profiles }
  }
  await db.transaction('rw', db.snapshots, async () => {
    await db.snapshots.add(snapshot)
    const stale = await db.snapshots.orderBy('createdAt').reverse().offset(5).primaryKeys()
    if (stale.length) await db.snapshots.bulkDelete(stale)
  })
  return snapshot
}

export async function restoreLatestSnapshot() {
  const snapshot = await db.snapshots.orderBy('createdAt').last()
  if (!snapshot) throw new Error('还没有可用的本机恢复点')
  await createRecoverySnapshot('恢复操作前')
  await db.transaction('rw', db.problems, db.reviews, db.rewards, db.profiles, async () => {
    await Promise.all([db.problems.clear(), db.reviews.clear(), db.rewards.clear(), db.profiles.clear()])
    await db.problems.bulkPut(snapshot.data.problems.map(normalizeProblemRecord))
    await db.reviews.bulkPut(snapshot.data.reviews)
    await db.rewards.bulkPut(snapshot.data.rewards)
    await db.profiles.bulkPut(snapshot.data.profiles.map(normalizeProfileRecord))
  })
  return snapshot
}

export async function requestPersistentStorage(): Promise<StoragePersistenceState> {
  let status: StoragePersistenceState['status'] = 'unsupported'
  if (navigator.storage?.persisted && navigator.storage?.persist) {
    try {
      const granted = await navigator.storage.persisted() || await navigator.storage.persist()
      status = granted ? 'granted' : 'denied'
    } catch {
      status = 'denied'
    }
  }
  const state: StoragePersistenceState = { status, checkedAt: Date.now() }
  await setSettingValue(STORAGE_PERSISTENCE_KEY, state)
  return state
}

export async function markExternalBackupCreated() {
  await setSettingValue(LAST_EXTERNAL_BACKUP_KEY, new Date().toISOString())
}

export async function repairStreakIfNeeded() {
  const profile = await db.profiles.get('player')
  if (!profile?.lastStudyDate) return
  const today = getTodayKey()
  const last = new Date(`${profile.lastStudyDate}T12:00:00`).getTime()
  const current = new Date(`${today}T12:00:00`).getTime()
  if ((current - last) / 86_400_000 > 1 && profile.streak !== 0) {
    await db.profiles.update('player', { streak: 0 })
  }
}
