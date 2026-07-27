import Dexie, { type EntityTable } from 'dexie'
import { makeSeedProblems } from './data/seed'
import { applyStudyToProfile, createRewardCard, getRealmAdvance, getTodayKey } from './domain/gamification'
import { getReviewOutcome } from './domain/scheduler'
import type {
  AppSetting,
  ImageAsset,
  PlayerProfile,
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
const LEGACY_SEED_IDS = Array.from({ length: 15 }, (_, index) => `seed-${String(index + 1).padStart(2, '0')}`)

export const defaultProfile: PlayerProfile = {
  id: 'player',
  xp: 0,
  streak: 0,
  lastStudyDate: '',
  totalReviews: 0,
  selectedTitle: '斗气化题',
  independentReviews: 0,
  multipleSolutionReviews: 0,
  correctChoiceReviews: 0,
  breakthroughCount: 0
}

export function normalizeProblemRecord(problem: Problem): Problem {
  const fallbackMethod = problem.answerText || problem.coreMethod
  return {
    ...problem,
    questionFormat: problem.questionFormat || 'open',
    options: Array.isArray(problem.options) ? problem.options : [],
    correctOptionIds: Array.isArray(problem.correctOptionIds) ? problem.correctOptionIds : [],
    solutionMethods: Array.isArray(problem.solutionMethods) && problem.solutionMethods.length
      ? problem.solutionMethods
      : fallbackMethod
        ? [{ id: 'method-1', title: '主方法', content: fallbackMethod }]
        : []
  }
}

export function normalizeProfileRecord(profile?: PlayerProfile): PlayerProfile {
  return {
    ...defaultProfile,
    ...profile,
    selectedTitle: profile?.selectedTitle && profile.selectedTitle !== '初见学者' ? profile.selectedTitle : defaultProfile.selectedTitle,
    independentReviews: profile?.independentReviews || 0,
    multipleSolutionReviews: profile?.multipleSolutionReviews || 0,
    correctChoiceReviews: profile?.correctChoiceReviews || 0,
    breakthroughCount: profile?.breakthroughCount || 0
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
  }
}

export const db = new MathRecallDatabase()

export async function initializeDatabase() {
  await db.transaction('rw', db.problems, db.profiles, db.settings, async () => {
    const dismissed = new Set(await getSettingValue<string[]>(DISMISSED_SEEDS_KEY, []))
    const existingIds = new Set(await db.problems.toCollection().primaryKeys())
    const missingSeeds = makeSeedProblems().filter((problem) => !existingIds.has(problem.id) && !dismissed.has(problem.id))
    if (missingSeeds.length) await db.problems.bulkAdd(missingSeeds)

    const currentProfile = await db.profiles.get('player')
    if (!currentProfile) await db.profiles.add(defaultProfile)
    else await db.profiles.put(normalizeProfileRecord(currentProfile))
  })
}

export async function getSettingValue<T>(key: string, fallback: T): Promise<T> {
  const record = await db.settings.get(key)
  return (record?.value as T | undefined) ?? fallback
}

export async function setSettingValue<T>(key: string, value: T) {
  await db.settings.put({ key, value, updatedAt: Date.now() })
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
}

export async function recordReview(problemId: string, rating: ReviewRating, answerMeta: ReviewAnswerMeta = {}) {
  const now = Date.now()
  const result = await db.transaction('rw', db.problems, db.reviews, db.rewards, db.profiles, async () => {
    const problem = await db.problems.get(problemId)
    if (!problem) throw new Error('题目不存在')

    const outcome = getReviewOutcome(problem.intervalIndex, rating, now)
    const reward = createRewardCard(problemId, rating, now)
    const currentProfile = normalizeProfileRecord(await db.profiles.get('player'))
    const advance = getRealmAdvance(currentProfile.xp, currentProfile.xp + outcome.xp)
    const nextProfile = applyStudyToProfile(currentProfile, outcome.xp, new Date(now), {
      rating,
      isCorrect: answerMeta.isCorrect,
      realmBreakthrough: advance.realmBreakthrough
    })

    await db.problems.update(problemId, {
      nextReviewAt: outcome.nextReviewAt,
      intervalIndex: outcome.intervalIndex,
      reviewCount: problem.reviewCount + 1,
      updatedAt: now
    })
    await db.reviews.add({
      problemId,
      rating,
      reviewedAt: now,
      nextReviewAt: outcome.nextReviewAt,
      intervalIndex: outcome.intervalIndex,
      xpEarned: outcome.xp,
      selectedOptionIds: answerMeta.selectedOptionIds,
      isCorrect: answerMeta.isCorrect
    })
    await db.rewards.add(reward)
    await db.profiles.put(nextProfile)

    return { outcome, reward, profile: nextProfile, advance }
  })
  await createRecoverySnapshot('完成复习')
  return result
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
